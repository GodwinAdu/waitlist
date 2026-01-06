import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ISubscriptionTier {
  name: string
  price: number
  currency: string
  benefits: string[]
  isActive: boolean
}

export interface IProject extends Document {
  name: string
  slug: string
  description: string
  tagline?: string
  logo?: string
  primaryColor?: string
  backgroundImage?: string
  launchDate?: Date
  features?: Array<{ icon?: string; title: string; description: string }>
  // Media fields
  images?: string[]
  videos?: string[]
  // A/B Testing fields
  abTestEnabled: boolean
  variants?: Array<{
    id: string
    name: string
    isControl: boolean
    traffic: number
    headline?: string
    description?: string
    primaryColor?: string
    ctaText?: string
  }>
  // SEO fields
  seo: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
  // Custom fields
  customFields?: Array<{
    id: string
    name: string
    type: 'text' | 'email' | 'phone' | 'select' | 'textarea'
    required: boolean
    options?: string[]
    validation?: string
  }>
  // Template
  templateId?: mongoose.Types.ObjectId
  // White label
  whiteLabel: {
    enabled: boolean
    domain?: string
    favicon?: string
    brandName?: string
  }
  adminId: mongoose.Types.ObjectId
  isActive: boolean
  gamificationEnabled: boolean
  showLeaderboard: boolean
  showLiveSignups: boolean
  subscriptionEnabled: boolean
  subscriptionTiers?: ISubscriptionTier[]
  // Email Settings
  emailSettings: {
    smtpHost?: string
    smtpPort?: number
    smtpUser?: string
    smtpPassword?: string
    fromEmail?: string
    fromName?: string
  }
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
    },
    primaryColor: {
      type: String,
      default: "#3b82f6",
    },
    backgroundImage: {
      type: String,
    },
    launchDate: {
      type: Date,
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
    abTestEnabled: {
      type: Boolean,
      default: false,
    },
    variants: [
      {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        isControl: {
          type: Boolean,
          default: false,
        },
        traffic: {
          type: Number,
          default: 50,
        },
        headline: String,
        description: String,
        primaryColor: String,
        ctaText: String,
      },
    ],
    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String
    },
    customFields: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      type: { type: String, enum: ['text', 'email', 'phone', 'select', 'textarea'], required: true },
      required: { type: Boolean, default: false },
      options: [String],
      validation: String
    }],
    templateId: { type: Schema.Types.ObjectId, ref: "Template" },
    whiteLabel: {
      enabled: { type: Boolean, default: false },
      domain: String,
      favicon: String,
      brandName: String
    },
    features: [
      {
        icon: String,
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    gamificationEnabled: {
      type: Boolean,
      default: true,
    },
    showLeaderboard: {
      type: Boolean,
      default: true,
    },
    showLiveSignups: {
      type: Boolean,
      default: true,
    },
    subscriptionEnabled: {
      type: Boolean,
      default: false,
    },
    subscriptionTiers: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        currency: {
          type: String,
          default: "GHS",
        },
        benefits: {
          type: [String],
          default: [],
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    emailSettings: {
      smtpHost: { type: String },
      smtpPort: { type: Number },
      smtpUser: { type: String },
      smtpPassword: { type: String },
      fromEmail: { type: String },
      fromName: { type: String }
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster slug lookups
ProjectSchema.index({ slug: 1 })

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)

export default Project
