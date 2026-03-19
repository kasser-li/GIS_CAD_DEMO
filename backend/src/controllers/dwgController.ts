import { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import { DwgFile } from '../models/DwgFile'
import { dwgParser } from '../services/dwgParser'

// 设置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
 })

export const dwgController = {
  upload: upload.single('dwg'),

  async create(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const dwgFile = await DwgFile.create({
        projectId: req.body.projectId,
        name: req.body.name || req.file.originalname,
        originalName: req.file.originalname,
        size: req.file.size,
        filePath: req.file.path,
        creator: req.user?.id
      })

      res.status(201).json(dwgFile)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  async get(req: Request, res: Response) {
    try {
      const dwgFile = await DwgFile.findById(req.params.id)
      if (!dwgFile) {
        return res.status(404).json({ error: 'DWG file not found' })
      }
      res.json(dwgFile)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  async parse(req: Request, res: Response) {
    try {
      const dwgFile = await DwgFile.findById(req.params.id)
      if (!dwgFile) {
        return res.status(404).json({ error: 'DWG file not found' })
      }

      const result = await dwgParser.parse(dwgFile.filePath)
      
      if (result.success) {
        await dwgFile.updateOne({
          status: 'parsed',
          layers: result.layers,
          bounds: result.bounds,
          parseTime: new Date()
        })
        res.json({ success: true, data: result })
      } else {
        await dwgFile.updateOne({ status: 'error' })
        res.status(400).json({ error: result.error })
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  async getLayers(req: Request, res: Response) {
    try {
      const dwgFile = await DwgFile.findById(req.params.id)
      if (!dwgFile) {
        return res.status(404).json({ error: 'DWG file not found' })
      }
      res.json(dwgFile.layers)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await DwgFile.findByIdAndDelete(req.params.id)
      res.json({ success: true })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
