import mongoose, { Schema } from 'mongoose'

export interface Project {
  name: string
  description: string
  coordinateSystem: string
  defaultBaseMap: string
  creator: Schema.Types.ObjectId
  members: Array<{
    userId: Schema.Types.ObjectId
    role: 'admin' | 'editor' | 'viewer'
    joinTime: Date
  }>
  createTime: Date
  updateTime: Date
}

const ProjectSchema = new Schema<Project>({
  name: { type: String, required: true },
  description: { type: String },
  coordinateSystem: { type: String, default: 'WGS84' },
  defaultBaseMap: { type: String, default: 'amap' },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
    joinTime: { type: Date, default: Date.now }
  }]
}, { timestamps: {
  createdAt: 'createTime',
  updatedAt: 'updateTime'
}})

export const Project = mongoose.model<Project>('Project', ProjectSchema)
