import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IAdmin extends Document {
  username: string
  password: string
  email: string
  subscriptionTier: "free" | "pro" | "enterprise"
  subscriptionStatus: "active" | "expired" | "cancelled"
  subscriptionReference?: string
  subscriptionStartDate?: Date
  subscriptionEndDate?: Date
  paymentHistory: Array<{
    reference: string
    amount: number
    currency: string
    status: string
    paidAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}

const AdminSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subscriptionTier: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    subscriptionReference: {
      type: String,
      sparse: true,
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
    paymentHistory: [
      {
        reference: String,
        amount: Number,
        currency: String,
        status: String,
        paidAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  },
)

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema)

export default Admin
