import { spawn } from 'child_process'
import path from 'path'

interface ParseResult {
  success: boolean
  layers?: Array<{
    name: string
    entities: Array<{
      type: string
      start?: { x: number; y: number }
      end?: { x: number; y: number }
      center?: { x: number; y: number }
      radius?: number
      points?: Array<{ x: number; y: number }>
      is_closed?: boolean
      position?: { x: number; y: number }
      text?: string
      height?: number
      color?: number
    }>
  }>
  bounds?: {
    minX: number
    minY: number
    maxX: number
    maxY: number
  }
  error?: string
}

export class DwgParserService {
  async parse(filePath: string): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
      const script = path.join(__dirname, '../../scripts/parse_dwg.py')
      const proc = spawn('python3', [script, filePath])
      
      let output = '', error = ''
      proc.stdout.on('data', (data) => output += data)
      proc.stderr.on('data', (data) => error += data)
      
      proc.on('close', (code) => {
        if (code !== 0) {
          console.error('Python script error:', error)
          resolve({ success: false, error: error || '解析失败' })
        } else {
          try {
            const result = JSON.parse(output)
            resolve(result)
          } catch (err) {
            resolve({ success: false, error: '解析结果格式错误' })
          }
        }
      })
    })
  }
}

export const dwgParser = new DwgParserService()
