import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IWebhook extends Document {
  projectId: mongoose.Types.ObjectId
  url: string
  events: string[]
  secret?: string
  isActive: boolean
  lastTriggered?: Date
  failureCount: number
  headers?: Record<string, string>
}

const WebhookSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  url: { type: String, required: true },
  events: [{ type: String, required: true }],
  secret: String,
  isActive: { type: Boolean, default: true },
  lastTriggered: Date,
  failureCount: { type: Number, default: 0 },
  headers: Schema.Types.Mixed
}, { timestamps: true })

const Webhook: Model<IWebhook> = 
  mongoose.models.Webhook || mongoose.model<IWebhook>("Webhook", WebhookSchema)

export default Webhook