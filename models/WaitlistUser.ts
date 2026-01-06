import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IWaitlistUser extends Document {
  projectId: mongoose.Types.ObjectId
  name: string
  email: string
  phone?: string
  role?: string
  message?: string
  referralCode?: string
  referredBy?: mongoose.Types.ObjectId
  referralCount: number
  isNotified: boolean
  notifiedAt?: Date
  position: number
  tier: "bronze" | "silver" | "gold" | "platinum"
  badges: string[]
  points: number
  subscriptionTier?: string
  isPaid: boolean
  paystackReference?: string
  paymentVerifiedAt?: Date
  // Analytics fields
  country?: string
  trafficSource?: string
  userAgent?: string
  ipAddress?: string
  createdAt: Date
  updatedAt: Date
}

const WaitlistUserSchema: Schema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: "WaitlistUser",
    },
    referralCount: {
      type: Number,
      default: 0,
    },
    isNotified: {
      type: Boolean,
      default: false,
    },
    notifiedAt: {
      type: Date,
    },
    position: {
      type: Number,
      required: true,
    },
    tier: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
    },
    badges: {
      type: [String],
      default: [],
    },
    points: {
      type: Number,
      default: 0,
    },
    subscriptionTier: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paystackReference: {
      type: String,
    },
    paymentVerifiedAt: {
      type: Date,
    },
    // Analytics fields
    country: {
      type: String,
      trim: true,
    },
    trafficSource: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to prevent duplicate emails per project
WaitlistUserSchema.index({ projectId: 1, email: 1 }, { unique: true })
// Index for faster position lookups
WaitlistUserSchema.index({ projectId: 1, position: 1 })
// Index for leaderboard queries
WaitlistUserSchema.index({ projectId: 1, referralCount: -1 })
WaitlistUserSchema.index({ projectId: 1, points: -1 })

const WaitlistUser: Model<IWaitlistUser> =
  mongoose.models.WaitlistUser || mongoose.model<IWaitlistUser>("WaitlistUser", WaitlistUserSchema)

export default WaitlistUser
