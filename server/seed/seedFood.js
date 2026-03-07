const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('../models/Food');
dotenv.config();

const foodData = [
  { name: 'Margherita Pizza', price: 8.99, category: 'Pizza' },
  { name: 'Veggie Burger', price: 6.49, category: 'Burger' },
  { name: 'Chicken Biryani', price: 10.99, category: 'Rice' },
  { name: 'Caesar Salad', price: 5.99, category: 'Salad' },
  { name: 'Pasta Alfredo', price: 9.49, category: 'Pasta' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Food.deleteMany({});
    await Food.insertMany(foodData);
    console.log('Food data seeded!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
