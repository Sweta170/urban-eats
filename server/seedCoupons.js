const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Coupon = require("./models/Coupon");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected for seeding"))
    .catch(err => console.log(err));

const seedCoupons = async () => {
    try {
        await Coupon.deleteMany();

        const coupons = [
            {
                code: "SAVE20",
                discountType: "percentage",
                discountAmount: 20,
                minPurchase: 500,
                maxDiscount: 200,
                expiryDate: new Date("2026-12-31"),
                isActive: true
            },
            {
                code: "FLAT100",
                discountType: "fixed",
                discountAmount: 100,
                minPurchase: 1000,
                expiryDate: new Date("2026-12-31"),
                isActive: true
            },
            {
                code: "WELCOME",
                discountType: "percentage",
                discountAmount: 50,
                minPurchase: 200,
                maxDiscount: 150,
                expiryDate: new Date("2026-12-31"),
                isActive: true
            }
        ];

        await Coupon.insertMany(coupons);
        console.log("Coupons seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding coupons:", error);
        process.exit(1);
    }
};

seedCoupons();
