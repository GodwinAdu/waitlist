import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IAIContent extends Document {
  projectId: mongoose.Types.ObjectId
  type: 'email' | 'landing_page' | 'social_post' | 'ad_copy'
  prompt: string
  generatedContent: string
  aiModel: string
  tokens: number
  status: 'generating' | 'completed' | 'failed'
  createdBy: mongoose.Types.ObjectId
}

const AIContentSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  type: { type: String, enum: ['email', 'landing_page', 'social_post', 'ad_copy'], required: true },
  prompt: { type: String, required: true },
  generatedContent: { type: String },
  aiModel: { type: String, default: 'gpt-3.5-turbo' },
  tokens: { type: Number, default: 0 },
  status: { type: String, enum: ['generating', 'completed', 'failed'], default: 'generating' },
  createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true }
}, { timestamps: true })

const AIContent: Model<IAIContent> = 
  mongoose.models.AIContent || mongoose.model<IAIContent>("AIContent", AIContentSchema)

export default AIContent