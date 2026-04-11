const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
const DeliveryPartner = require('./models/DeliveryPartner');
const DeliveryEarning = require('./models/DeliveryEarning');

console.log('Testing Models Loading...');

try {
  console.log('User model loaded:', !!User);
  console.log('Order model loaded:', !!Order);
  console.log('DeliveryPartner model loaded:', !!DeliveryPartner);
  console.log('DeliveryEarning model loaded:', !!DeliveryEarning);
  
  console.log('\nChecking delivery fields in Order Schema:');
  const orderPaths = Order.schema.paths;
  const fieldsToCheck = ['riderId', 'deliveryStatus', 'riderLocation', 'pickedUpAt', 'deliveredAt', 'deliveryProofUrl', 'deliveryFee'];
  
  fieldsToCheck.forEach(field => {
    if (orderPaths[field] || orderPaths[`${field}.lat`]) {
      console.log(`[PASS] Field "${field}" found in Order schema.`);
    } else {
      console.warn(`[FAIL] Field "${field}" NOT found in Order schema.`);
    }
  });

  console.log('\nChecking roles in User Schema:');
  const roleEnum = User.schema.path('role').enumValues;
  if (roleEnum.includes('rider')) {
    console.log('[PASS] "rider" role found in User schema.');
  } else {
    console.warn('[FAIL] "rider" role NOT found in User schema.');
  }

  process.exit(0);
} catch (error) {
  console.error('Error loading models:', error);
  process.exit(1);
}
