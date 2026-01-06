import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IIntegration extends Document {
  adminId: mongoose.Types.ObjectId
  type: 'crm' | 'social' | 'payment' | 'sms' | 'calendar'
  provider: string
  credentials: Record<string, any>
  isActive: boolean
  settings: Record<string, any>
  lastSync?: Date
  syncStatus: 'idle' | 'syncing' | 'error'
}

const IntegrationSchema: Schema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  type: { type: String, enum: ['crm', 'social', 'payment', 'sms', 'calendar'], required: true },
  provider: { type: String, required: true },
  credentials: { type: Schema.Types.Mixed, required: true },
  isActive: { type: Boolean, default: true },
  settings: { type: Schema.Types.Mixed, default: {} },
  lastSync: Date,
  syncStatus: { type: String, enum: ['idle', 'syncing', 'error'], default: 'idle' }
}, { timestamps: true })

const Integration: Model<IIntegration> = 
  mongoose.models.Integration || mongoose.model<IIntegration>("Integration", IntegrationSchema)

export default Integration