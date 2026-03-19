import { Request, Response } from 'express'
import { Project } from '../models/Project'

export const projectController = {
  async create(req: Request, res: Response) {
    try {
      const project = await Project.create({ 
        ...req.body, 
        creator: req.user?.id,
        members: [{ userId: req.user?.id, role: 'admin', joinTime: new Date() }]
      })
      res.status(201).json(project)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  async list(req: Request, res: Response) {
    try {
      const projects = await Project.find()
        .populate('creator', 'name email')
        .populate('members.userId', 'name email')
      res.json(projects)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  async get(req: Request, res: Response) {
    try {
      const project = await Project.findById(req.params.id)
        .populate('creator', 'name email')
        .populate('members.userId', 'name email')
      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }
      res.json(project)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response) {
    try {
      const project = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }
      res.json(project)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await Project.findByIdAndDelete(req.params.id)
      res.json({ success: true })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
