import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ITeamMember extends Document {
  adminId: mongoose.Types.ObjectId
  email: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  permissions: string[]
  invitedBy: mongoose.Types.ObjectId
  invitedAt: Date
  acceptedAt?: Date
  status: 'pending' | 'active' | 'suspended'
}

const TeamMemberSchema: Schema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['owner', 'admin', 'editor', 'viewer'], default: 'viewer' },
  permissions: [{ type: String }],
  invitedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  invitedAt: { type: Date, default: Date.now },
  acceptedAt: Date,
  status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' }
}, { timestamps: true })

TeamMemberSchema.index({ adminId: 1, email: 1 }, { unique: true })

const TeamMember: Model<ITeamMember> = 
  mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema)

export default TeamMember