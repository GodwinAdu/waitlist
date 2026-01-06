import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IEmailCampaign extends Document {
  projectId: mongoose.Types.ObjectId
  name: string
  subject: string
  content: string
  type: 'welcome' | 'launch' | 'reminder' | 'custom'
  status: 'draft' | 'scheduled' | 'sent' | 'paused'
  scheduledAt?: Date
  sentAt?: Date
  recipients: number
  opens: number
  clicks: number
  createdBy: mongoose.Types.ObjectId
  settings: {
    filters?: any
  }
}

const EmailCampaignSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['welcome', 'launch', 'reminder', 'custom'], default: 'custom' },
  status: { type: String, enum: ['draft', 'scheduled', 'sent', 'paused'], default: 'draft' },
  scheduledAt: { type: Date },
  sentAt: { type: Date },
  recipients: { type: Number, default: 0 },
  opens: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  settings: { type: Object, default: {} }
}, { timestamps: true })

const EmailCampaign: Model<IEmailCampaign> =
  mongoose.models.EmailCampaign || mongoose.model<IEmailCampaign>("EmailCampaign", EmailCampaignSchema)

export default EmailCampaign