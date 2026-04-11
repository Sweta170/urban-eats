const request = require('supertest');
const app = require('./app');

console.log('Verifying Route Registration...');

const routesToCheck = [
  '/api/rider/register',
  '/api/rider/profile',
  '/api/admin/riders'
];

async function checkRoutes() {
  for (const route of routesToCheck) {
    try {
      const res = await request(app).post(route); // Using POST just to see if it's handled (will likely 401/400)
      console.log(`Checking ${route}: Status ${res.status}`);
      if (res.status !== 404) {
        console.log(`[PASS] Route ${route} is registered.`);
      } else {
        console.warn(`[FAIL] Route ${route} is NOT registered (404).`);
      }
    } catch (err) {
      console.error(`Error checking ${route}:`, err.message);
    }
  }
}

checkRoutes().then(() => {
  console.log('\nVerification complete.');
  process.exit(0);
});
