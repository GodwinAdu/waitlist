import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ITemplate extends Document {
  name: string
  category: string
  description: string
  preview: string
  isPremium: boolean
  price: number
  downloads: number
  rating: number
  config: {
    layout: string
    colors: Record<string, string>
    fonts: Record<string, string>
    sections: any[]
  }
  createdBy: mongoose.Types.ObjectId
}

const TemplateSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  preview: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  config: {
    layout: { type: String, required: true },
    colors: Schema.Types.Mixed,
    fonts: Schema.Types.Mixed,
    sections: [Schema.Types.Mixed]
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "Admin" }
}, { timestamps: true })

const Template: Model<ITemplate> = 
  mongoose.models.Template || mongoose.model<ITemplate>("Template", TemplateSchema)

export default Template