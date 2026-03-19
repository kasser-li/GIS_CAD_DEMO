import { Request, Response } from 'express'
import { Marker } from '../models/Marker'

export const markerController = {
  async create(req: Request, res: Response) {
    try {
      const marker = await Marker.create({ 
        ...req.body, 
        creator: req.user?.id 
      })
      res.status(201).json(marker)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  async query(req: Request, res: Response) {
    try {
      const { projectId, page = 1, pageSize = 100 } = req.query
      const filter: any = { projectId, status: 'active' }
      
      const [list, total] = await Promise.all([
        Marker.find(filter)
          .skip((Number(page) - 1) * Number(pageSize))
          .limit(Number(pageSize))
          .sort({ createdAt: -1 }),
        Marker.countDocuments(filter)
      ])
      
      res.json({ list, total, page: Number(page), pageSize: Number(pageSize) })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response) {
    try {
      const marker = await Marker.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updater: req.user?.id },
        { new: true }
      )
      res.json(marker)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await Marker.findByIdAndUpdate(req.params.id, { status: 'deleted' })
      res.json({ success: true })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  async import(req: Request, res: Response) {
    try {
      const { markers } = req.body
      const importedMarkers = await Marker.insertMany(markers.map((marker: any) => ({
        ...marker,
        creator: req.user?.id,
        status: 'active'
      })))
      res.status(201).json({ success: true, count: importedMarkers.length })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  async export(req: Request, res: Response) {
    try {
      const { projectId } = req.query
      const markers = await Marker.find({ projectId, status: 'active' })
      res.json(markers)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
