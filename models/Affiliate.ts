import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IAffiliate extends Document {
  adminId: mongoose.Types.ObjectId
  code: string
  commissionRate: number
  totalEarnings: number
  totalReferrals: number
  payoutMethod: string
  payoutDetails: Record<string, any>
  isActive: boolean
  referrals: Array<{
    referredId: mongoose.Types.ObjectId
    commission: number
    status: 'pending' | 'paid'
    createdAt: Date
  }>
}

const AffiliateSchema: Schema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true, unique: true },
  code: { type: String, required: true, unique: true },
  commissionRate: { type: Number, default: 0.3 },
  totalEarnings: { type: Number, default: 0 },
  totalReferrals: { type: Number, default: 0 },
  payoutMethod: { type: String, default: 'paypal' },
  payoutDetails: Schema.Types.Mixed,
  isActive: { type: Boolean, default: true },
  referrals: [{
    referredId: { type: Schema.Types.ObjectId, ref: "Admin" },
    commission: Number,
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

const Affiliate: Model<IAffiliate> = 
  mongoose.models.Affiliate || mongoose.model<IAffiliate>("Affiliate", AffiliateSchema)

export default Affiliate