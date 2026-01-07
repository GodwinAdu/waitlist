import { connectToDB } from "./mongoose"
import Admin from "@/models/Admin"
import Project from "@/models/Project"
import WaitlistUser from "@/models/WaitlistUser"

export async function createIndexes() {
  try {
    await connectToDB()
    
    // Admin indexes
    await Admin.collection.createIndex({ email: 1 }, { unique: true })
    await Admin.collection.createIndex({ username: 1 }, { unique: true })
    await Admin.collection.createIndex({ subscriptionStatus: 1 })
    
    // Project indexes
    await Project.collection.createIndex({ slug: 1 }, { unique: true })
    await Project.collection.createIndex({ adminId: 1 })
    await Project.collection.createIndex({ isActive: 1 })
    
    // WaitlistUser indexes
    await WaitlistUser.collection.createIndex({ projectId: 1, email: 1 }, { unique: true })
    await WaitlistUser.collection.createIndex({ projectId: 1, position: 1 })
    await WaitlistUser.collection.createIndex({ referralCode: 1 })
    await WaitlistUser.collection.createIndex({ createdAt: -1 })
    
    console.log('Database indexes created successfully')
  } catch (error) {
    console.error('Error creating indexes:', error)
  }
}