const express = require('express');
const cloudinary = require('cloudinary');
const multer = require('multer');
const { body, param, validationResult } = require('express-validator');

const DeliveryPartner = require('../models/DeliveryPartner');
const DeliveryEarning = require('../models/DeliveryEarning');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

// ─── Multer (memory storage → Cloudinary) ────────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// ─── Helper: upload buffer to Cloudinary ─────────────────────────────────────
const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result))
    ).end(buffer);
  });

// ─── Helper: validation error response ───────────────────────────────────────
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return false;
  }
  return true;
};

// ─── All routes below require a valid JWT ─────────────────────────────────────
router.use(auth);

// =============================================================================
// POST /api/rider/register
// Rider self-registration. Creates DeliveryPartner linked to the logged-in user.
// =============================================================================
router.post(
  "/register",
  upload.fields([
    { name: "licenseImage", maxCount: 1 },
    { name: "vehicleImage", maxCount: 1 },
  ]),
  [
    body("phone").notEmpty().withMessage("Valid phone number required"),
    body("vehicleType")
      .isIn(["bike", "scooter", "car"])
      .withMessage("vehicleType must be bike, scooter, or car"),
    body("vehicleNumber").notEmpty().withMessage("vehicleNumber is required"),
  ],
  async (req, res) => {
    if (!validate(req, res)) return;

    try {
      // Prevent duplicate registrations
      const existing = await DeliveryPartner.findOne({ userId: req.user.userId });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Rider profile already exists for this account",
        });
      }

      const { phone, vehicleType, vehicleNumber, bankDetails } = req.body;

      // Upload documents to Cloudinary if provided
      let licenseUrl, vehicleImageUrl;
      if (req.files?.licenseImage?.[0]) {
        const result = await uploadToCloudinary(
          req.files.licenseImage[0].buffer,
          "urban-eats/rider-docs"
        );
        licenseUrl = result.secure_url;
      }
      if (req.files?.vehicleImage?.[0]) {
        const result = await uploadToCloudinary(
          req.files.vehicleImage[0].buffer,
          "urban-eats/rider-docs"
        );
        vehicleImageUrl = result.secure_url;
      }

      const rider = await DeliveryPartner.create({
        userId: req.user.userId,
        name: req.user.name || "Unknown Rider", // Assuming req.user has name from token
        phone,
        vehicleType,
        vehicleNumber,
        licenseImageUrl: licenseUrl,
        vehicleImageUrl,
        bankDetails: bankDetails ? JSON.parse(bankDetails) : undefined,
        documentsVerified: false, // Admin must verify before first delivery
        isOnline: false,
        isAvailable: false,
      });

      res.status(201).json({ success: true, data: rider });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// =============================================================================
// GET /api/rider/profile
// Returns own DeliveryPartner profile + lifetime stats.
// =============================================================================
router.get(
  "/profile",
  role("rider"),
  async (req, res) => {
    try {
      const rider = await DeliveryPartner.findOne({
        userId: req.user.userId,
      }).lean();

      if (!rider) {
        return res
          .status(404)
          .json({ success: false, message: "Rider profile not found" });
      }

      res.json({ success: true, data: rider });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// =============================================================================
// PATCH /api/rider/availability
// Toggle the rider's online / offline duty status.
// =============================================================================
router.patch(
  "/availability",
  role("rider"),
  [body("isOnline").isBoolean().withMessage("isOnline must be true or false")],
  async (req, res) => {
    if (!validate(req, res)) return;

    try {
      const rider = await DeliveryPartner.findOne({ userId: req.user.userId });
      if (!rider) {
        return res
          .status(404)
          .json({ success: false, message: "Rider profile not found" });
      }

      if (!rider.documentsVerified) {
        return res.status(403).json({
          success: false,
          message: "Account pending admin verification — you cannot go online yet",
        });
      }

      rider.isOnline = req.body.isOnline;
      // Going offline automatically marks as unavailable
      if (!req.body.isOnline) rider.isAvailable = false;
      else rider.isAvailable = true; // Going online makes you available by default if no active order
      
      await rider.save();

      // Notify via Socket.io
      const io = req.app.get('socketio');
      if (io) {
        io.to(`user_${req.user.userId}`).emit("rider:availability_changed", {
          isOnline: rider.isOnline,
        });
      }

      res.json({
        success: true,
        message: `You are now ${rider.isOnline ? "online" : "offline"}`,
        data: { isOnline: rider.isOnline, isAvailable: rider.isAvailable },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// =============================================================================
// PATCH /api/rider/location
// Called every ~5 s by the mobile app while the rider is on a delivery.
// =============================================================================
router.patch(
  "/location",
  role("rider"),
  [
    body("lat")
      .isFloat({ min: -90, max: 90 })
      .withMessage("lat must be between -90 and 90"),
    body("lng")
      .isFloat({ min: -180, max: 180 })
      .withMessage("lng must be between -180 and 180"),
  ],
  async (req, res) => {
    if (!validate(req, res)) return;

    try {
      const { lat, lng } = req.body;

      const rider = await DeliveryPartner.findOneAndUpdate(
        { userId: req.user.userId },
        { currentLocation: { lat, lng } },
        { new: true, select: "_id currentLocation" }
      );

      if (!rider) {
        return res
          .status(404)
          .json({ success: false, message: "Rider profile not found" });
      }

      // Find the active order this rider is currently delivering
      const activeOrder = await Order.findOne({
        riderId: rider._id,
        deliveryStatus: { $in: ["assigned", "rider_en_route", "picked_up"] },
      }).select("_id user");

      if (activeOrder) {
        // Push real-time location to the customer's socket room
        const io = req.app.get('socketio');
        if (io) {
          io.to(`order_${activeOrder._id}`).emit("rider:location_update", {
            orderId: activeOrder._id,
            location: { lat, lng },
          });
        }

        // Also update the snapshot on the order document for new subscribers
        await Order.findByIdAndUpdate(activeOrder._id, {
          riderLocation: { lat, lng },
        });
      }

      res.json({ success: true, data: { lat, lng } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// =============================================================================
// GET /api/rider/orders/available
// =============================================================================
router.get(
  "/orders/available",
  role("rider"),
  async (req, res) => {
    try {
      const rider = await DeliveryPartner.findOne({
        userId: req.user.userId,
      }).lean();

      if (!rider) {
        return res
          .status(404)
          .json({ success: false, message: "Rider profile not found" });
      }

      if (!rider.isOnline || !rider.documentsVerified) {
        return res.status(403).json({
          success: false,
          message: "You must be online and verified to view available orders",
        });
      }

      // Find orders that are confirmed but not yet assigned
      // Assuming 'status' for overall order state is 'Preparing' or 'Out for Delivery'?
      // Actually, image said deliveryStatus starts at 'pending_assignment'
      const orders = await Order.find({
        deliveryStatus: "pending_assignment"
      })
        .populate("user", "name") // Fix: 'user' instead of 'userId' based on model
        .populate({
          path: "items.restaurant",
          select: "name address location"
        })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      res.json({ success: true, count: orders.length, data: orders });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// =============================================================================
// POST /api/rider/orders/:id/accept
// =============================================================================
router.post(
  "/orders/:id/accept",
  role("rider"),
  [param("id").isMongoId().withMessage("Invalid order ID")],
  async (req, res) => {
    if (!validate(req, res)) return;

    try {
      const rider = await DeliveryPartner.findOne({ userId: req.user.userId });
      if (!rider) {
        return res
          .status(404)
          .json({ success: false, message: "Rider profile not found" });
      }

      if (!rider.isOnline || !rider.documentsVerified) {
        return res.status(403).json({
          success: false,
          message: "You must be online and verified to accept deliveries",
        });
      }

      if (!rider.isAvailable) {
        return res.status(409).json({
          success: false,
          message: "You already have an active delivery",
        });
      }

      // Atomic findOneAndUpdate
      const order = await Order.findOneAndUpdate(
        {
          _id: req.params.id,
          deliveryStatus: "pending_assignment",
        },
        {
          riderId: rider._id,
          deliveryStatus: "assigned",
          riderLocation: rider.currentLocation,
        },
        { new: true }
      )
        .populate("user", "name phone")
        .populate("items.restaurant", "name address location phone");

      if (!order) {
        return res.status(409).json({
          success: false,
          message: "Order is no longer available",
        });
      }

      // Mark rider as unavailable
      rider.isAvailable = false;
      await rider.save();

      // Notify via Socket.io
      const io = req.app.get('socketio');
      if (io) {
        io.to(`user_${order.user._id}`).emit("order:rider_accepted", {
          orderId: order._id,
          rider: {
            name: rider.name,
            phone: rider.phone,
            vehicleType: rider.vehicleType,
            vehicleNumber: rider.vehicleNumber,
            rating: rider.rating,
          },
        });
      }

      res.json({ success: true, data: order });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// =============================================================================
// PATCH /api/rider/orders/:id/status
// =============================================================================
const VALID_TRANSITIONS = {
  assigned: "rider_en_route",
  rider_en_route: "picked_up",
  picked_up: "delivered",
};

router.patch(
  "/orders/:id/status",
  role("rider"),
  [
    param("id").isMongoId().withMessage("Invalid order ID"),
    body("status")
      .isIn(["rider_en_route", "picked_up", "delivered"])
      .withMessage("Invalid status value"),
  ],
  async (req, res) => {
    if (!validate(req, res)) return;

    try {
      const rider = await DeliveryPartner.findOne({ userId: req.user.userId });
      if (!rider) {
        return res
          .status(404)
          .json({ success: false, message: "Rider profile not found" });
      }

      const order = await Order.findOne({
        _id: req.params.id,
        riderId: rider._id,
      }).populate("user", "_id name");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found or not assigned to you",
        });
      }

      if (VALID_TRANSITIONS[order.deliveryStatus] !== req.body.status) {
        return res.status(400).json({
          success: false,
          message: `Cannot transition from "${order.deliveryStatus}" to "${req.body.status}"`,
        });
      }

      order.deliveryStatus = req.body.status;

      if (req.body.status === "picked_up") order.pickedUpAt = new Date();
      if (req.body.status === "delivered") {
        order.deliveredAt = new Date();
        order.status = "Delivered"; // Existing status field
      }

      await order.save();

      const io = req.app.get('socketio');
      if (io) {
        io.to(`order_${order._id}`).emit("order:status_update", {
          orderId: order._id,
          deliveryStatus: order.deliveryStatus,
        });
      }

      if (req.body.status === "delivered") {
        // Free the rider
        rider.isAvailable = true;
        rider.totalDeliveries = (rider.totalDeliveries || 0) + 1;
        
        // Calculate earnings (rough logic)
        const total = 50; // Flat ₹50 for now
        await DeliveryEarning.create({
          riderId: rider._id,
          orderId: order._id,
          baseAmount: 30,
          distanceAmount: 20,
          totalAmount: total,
          status: "pending",
        });

        rider.totalEarnings = (rider.totalEarnings || 0) + total;
        await rider.save();
      }

      res.json({ success: true, data: { deliveryStatus: order.deliveryStatus } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// =============================================================================
// POST /api/rider/orders/:id/proof
// =============================================================================
router.post(
  "/orders/:id/proof",
  role("rider"),
  upload.single("proofImage"),
  [param("id").isMongoId().withMessage("Invalid order ID")],
  async (req, res) => {
    if (!validate(req, res)) return;

    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Proof image is required" });
      }

      const rider = await DeliveryPartner.findOne({ userId: req.user.userId });
      const order = await Order.findOne({
        _id: req.params.id,
        riderId: rider._id,
      });

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      const result = await uploadToCloudinary(req.file.buffer, "urban-eats/delivery-proofs");
      order.deliveryProofUrl = result.secure_url;
      await order.save();

      res.json({ success: true, data: { deliveryProofUrl: result.secure_url } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;
