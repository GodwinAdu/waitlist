import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IHeatmapData extends Document {
  projectId: mongoose.Types.ObjectId
  sessionId: string
  events: Array<{
    type: 'click' | 'scroll' | 'hover' | 'focus'
    x: number
    y: number
    element: string
    timestamp: Date
  }>
  viewport: {
    width: number
    height: number
  }
  userAgent: string
}

const HeatmapDataSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  sessionId: { type: String, required: true },
  events: [{
    type: { type: String, enum: ['click', 'scroll', 'hover', 'focus'], required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    element: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  viewport: {
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  userAgent: { type: String }
}, { timestamps: true })

const HeatmapData: Model<IHeatmapData> = 
  mongoose.models.HeatmapData || mongoose.model<IHeatmapData>("HeatmapData", HeatmapDataSchema)

export default HeatmapData