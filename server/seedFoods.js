const mongoose = require('mongoose');
const Food = require('./models/Food');

const foods = [
  { name: 'Margherita Pizza', price: 8.99, category: 'Pizza', description: 'Classic cheese and tomato pizza', imageUrl: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366' },
  { name: 'Veggie Burger', price: 6.49, category: 'Burger', description: 'Crispy veg patty with fresh veggies', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349' },
  { name: 'Chicken Biryani', price: 10.99, category: 'Rice', description: 'Aromatic rice with chicken and spices', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' },
  { name: 'Caesar Salad', price: 5.99, category: 'Salad', description: 'Fresh romaine lettuce with Caesar dressing', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' },
  { name: 'Pasta Alfredo', price: 9.49, category: 'Pasta', description: 'Creamy Alfredo pasta with herbs', imageUrl: 'https://images.unsplash.com/photo-1516685018646-5499d0a7d42f' },
  { name: 'Paneer Tikka', price: 199, category: 'Starter', description: 'Grilled paneer cubes with spices', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' },
];

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/food-delivery-mern');
  await Food.deleteMany({});
  await Food.insertMany(foods);
  console.log('Sample foods inserted!');
  mongoose.disconnect();
}

seed();
