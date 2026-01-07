#!/usr/bin/env node

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up WaitlistPro...\n')

// Generate encryption key
const encryptionKey = crypto.randomBytes(32).toString('hex')
console.log('✅ Generated encryption key')

// Check if .env exists
const envPath = path.join(process.cwd(), '.env')
const envExamplePath = path.join(process.cwd(), '.env.example')

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    // Copy .env.example to .env
    let envContent = fs.readFileSync(envExamplePath, 'utf8')
    
    // Replace placeholder encryption key
    envContent = envContent.replace(
      'ENCRYPTION_KEY=your-32-character-encryption-key-for-sensitive-data',
      `ENCRYPTION_KEY=${encryptionKey}`
    )
    
    // Generate JWT secret
    const jwtSecret = crypto.randomBytes(64).toString('hex')
    envContent = envContent.replace(
      'JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters-long',
      `JWT_SECRET=${jwtSecret}`
    )
    
    fs.writeFileSync(envPath, envContent)
    console.log('✅ Created .env file with secure keys')
  } else {
    console.log('❌ .env.example not found')
  }
} else {
  console.log('ℹ️  .env file already exists')
}

console.log('\n📋 Next steps:')
console.log('1. Update .env with your database and service credentials')
console.log('2. Run: npm run dev')
console.log('3. Visit: http://localhost:3000')
console.log('\n🔐 Security keys have been generated automatically')
console.log('💡 Remember to set up your MongoDB, Paystack, and SMTP credentials')