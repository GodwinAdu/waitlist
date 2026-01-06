import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IABTestView extends Document {
  projectId: mongoose.Types.ObjectId
  variantId: string
  sessionId: string
  userAgent?: string
  ipAddress?: string
  converted: boolean
  convertedAt?: Date
  createdAt: Date
}

const ABTestViewSchema: Schema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    variantId: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    userAgent: String,
    ipAddress: String,
    converted: {
      type: Boolean,
      default: false,
    },
    convertedAt: Date,
  },
  {
    timestamps: true,
  }
)

ABTestViewSchema.index({ projectId: 1, variantId: 1 })
ABTestViewSchema.index({ sessionId: 1 })

const ABTestView: Model<IABTestView> = 
  mongoose.models.ABTestView || mongoose.model<IABTestView>("ABTestView", ABTestViewSchema)

export default ABTestView