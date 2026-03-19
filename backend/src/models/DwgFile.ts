import mongoose, { Schema } from 'mongoose'

export interface DwgFile {
  projectId: Schema.Types.ObjectId
  name: string
  originalName: string
  size: number
  version: string
  status: 'pending' | 'parsed' | 'error'
  layers: Array<{
    name: string
    visible: boolean
    color: string
    type: 'point' | 'line' | 'polygon' | 'text'
  }>
  bounds: {
    minX: number
    minY: number
    maxX: number
    maxY: number
  }
  filePath: string
  previewPath: string
  geojsonPath: string
  creator: Schema.Types.ObjectId
  createTime: Date
  parseTime?: Date
}

const DwgFileSchema = new Schema<DwgFile>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  version: { type: String },
  status: { type: String, enum: ['pending', 'parsed', 'error'], default: 'pending' },
  layers: [{
    name: { type: String },
    visible: { type: Boolean, default: true },
    color: { type: String, default: '#000000' },
    type: { type: String, enum: ['point', 'line', 'polygon', 'text'] }
  }],
  bounds: {
    minX: { type: Number },
    minY: { type: Number },
    maxX: { type: Number },
    maxY: { type: Number }
  },
  filePath: { type: String, required: true },
  previewPath: { type: String },
  geojsonPath: { type: String },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  parseTime: { type: Date }
}, { timestamps: {
  createdAt: 'createTime'
}})

export const DwgFile = mongoose.model<DwgFile>('DwgFile', DwgFileSchema)
