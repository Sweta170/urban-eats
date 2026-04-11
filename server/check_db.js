const mongoose = require('mongoose');
require('dotenv').config();
const Food = require('./models/Food');
const Cart = require('./models/Cart');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected');
  const carts = await Cart.find().populate('items.food');
  console.log("Carts:", JSON.stringify(carts, null, 2));
  
  const foods = await Food.find();
  const missingRestaurants = foods.filter(f => !f.restaurant);
  console.log('Foods missing restaurant:', missingRestaurants.map(f => f.name));
  
  process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
