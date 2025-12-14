/**
 * Quick script to test if the Render.com backend is accessible
 * Run with: node test-backend.js
 */

const BACKEND_URL = 'https://ai-closet-backend.onrender.com';

async function testBackend() {
  console.log('Testing backend at:', BACKEND_URL);
  console.log('');

  // Test health endpoint
  try {
    console.log('1. Testing /health endpoint...');
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    console.log('   The backend may be sleeping (free tier). Wait 30-60 seconds and try again.');
    return;
  }

  // Test API auth endpoint (should return 404 for GET, but confirms route exists)
  try {
    console.log('\n2. Testing /api/auth endpoint...');
    const authResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
    });
    const authData = await authResponse.json();
    if (authResponse.status === 401 || authResponse.status === 400) {
      console.log('✅ Auth endpoint is accessible (expected error for test credentials)');
    } else {
      console.log('⚠️  Unexpected response:', authResponse.status, authData);
    }
  } catch (error) {
    console.log('❌ Auth endpoint test failed:', error.message);
  }

  console.log('\n✅ Backend appears to be working!');
  console.log('   If login still fails, check:');
  console.log('   - CORS configuration in backend');
  console.log('   - Frontend is using correct API URL');
  console.log('   - Browser console for specific errors');
}

testBackend();

