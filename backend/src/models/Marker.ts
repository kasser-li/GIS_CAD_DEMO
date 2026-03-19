import mongoose, { Schema } from 'mongoose'

export interface Marker {
  projectId: Schema.Types.ObjectId
  dwgFileId?: Schema.Types.ObjectId
  name: string
  type: 'normal' | 'important' | 'monitor' | 'device' | 'danger'
  description: string
  coordinates: {
    lng: number
    lat: number
  }
  altitude?: number
  properties: Record<string, any>
  style: {
    icon: string
    color: string
    size: number
    label: string
  }
  images: string[]
  videos: string[]
  documents: string[]
  creator: Schema.Types.ObjectId
  updater?: Schema.Types.ObjectId
  status: 'active' | 'inactive' | 'deleted'
  createdAt: Date
  updatedAt: Date
}

const MarkerSchema = new Schema<Marker>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  dwgFileId: { type: Schema.Types.ObjectId, ref: 'DwgFile' },
  name: { type: String, required: true },
  type: { type: String, enum: ['normal', 'important', 'monitor', 'device', 'danger'], default: 'normal' },
  description: { type: String },
  coordinates: {
    lng: { type: Number, required: true },
    lat: { type: Number, required: true }
  },
  altitude: { type: Number },
  properties: { type: Schema.Types.Mixed, default: {} },
  style: {
    icon: { type: String, default: 'default' },
    color: { type: String, default: '#1890ff' },
    size: { type: Number, default: 16 },
    label: { type: String, default: '' }
  },
  images: { type: [String], default: [] },
  videos: { type: [String], default: [] },
  documents: { type: [String], default: [] },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  updater: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' }
}, { timestamps: true })

// 地理空间索引
MarkerSchema.index({ coordinates: '2dsphere' })
// 复合索引
MarkerSchema.index({ projectId: 1, status: 1 })

export const Marker = mongoose.model<Marker>('Marker', MarkerSchema)
