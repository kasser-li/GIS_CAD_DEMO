import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import projectRouter from './routes/project'
import dwgRouter from './routes/dwg'
import markerRouter from './routes/marker'

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/projects', projectRouter)
app.use('/api/dwg', dwgRouter)
app.use('/api/markers', markerRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gis_system')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

export { app }
