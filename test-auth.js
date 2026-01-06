// Simple test for auth routes
console.log('Testing auth routes...')

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com', 
  password: 'password123'
}

async function testRegister() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    })
    
    const data = await response.json()
    console.log('Register response:', response.status, data)
    return response.ok
  } catch (error) {
    console.error('Register error:', error.message)
    return false
  }
}

async function testLogin() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUser.username,
        password: testUser.password
      })
    })
    
    const data = await response.json()
    console.log('Login response:', response.status, data)
    return response.ok
  } catch (error) {
    console.error('Login error:', error.message)
    return false
  }
}

// Run tests
async function runTests() {
  console.log('1. Testing register...')
  const registerSuccess = await testRegister()
  
  if (registerSuccess) {
    console.log('2. Testing login...')
    await testLogin()
  }
}

runTests()