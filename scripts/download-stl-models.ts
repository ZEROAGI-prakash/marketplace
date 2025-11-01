/**
 * Script to download free STL models from Printables.com
 * Run: npx tsx scripts/download-stl-models.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

interface ModelDownload {
  name: string
  url: string
  filename: string
  category: 'free' | 'premium'
}

// Popular free STL models that can be downloaded
const MODELS_TO_DOWNLOAD: ModelDownload[] = [
  {
    name: 'Articulated Dragon',
    url: 'https://www.printables.com/model/3d_files/articulated-dragon.stl',
    filename: 'articulated-dragon-v1.stl',
    category: 'free',
  },
  {
    name: 'Flexi Rex',
    url: 'https://www.printables.com/model/3d_files/flexi-rex.stl',
    filename: 'flexi-rex-v1.stl',
    category: 'free',
  },
  {
    name: 'Cable Clips',
    url: 'https://www.printables.com/model/3d_files/cable-clips.stl',
    filename: 'cable-clips-v1.stl',
    category: 'free',
  },
]

async function downloadFile(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath)
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`))
        return
      }
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {})
      reject(err)
    })
  })
}

async function main() {
  const modelsDir = path.join(process.cwd(), 'public', 'models')
  
  // Ensure directories exist
  const freeDir = path.join(modelsDir, 'free')
  const premiumDir = path.join(modelsDir, 'premium')
  
  if (!fs.existsSync(freeDir)) {
    fs.mkdirSync(freeDir, { recursive: true })
  }
  if (!fs.existsSync(premiumDir)) {
    fs.mkdirSync(premiumDir, { recursive: true })
  }

  console.log('🚀 Starting STL model downloads...\n')

  for (const model of MODELS_TO_DOWNLOAD) {
    const outputDir = model.category === 'free' ? freeDir : premiumDir
    const outputPath = path.join(outputDir, model.filename)

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`✓ ${model.name} already exists, skipping...`)
      continue
    }

    try {
      console.log(`📥 Downloading ${model.name}...`)
      await downloadFile(model.url, outputPath)
      const stats = fs.statSync(outputPath)
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2)
      console.log(`✓ Downloaded ${model.name} (${fileSizeMB} MB)\n`)
    } catch (error) {
      console.error(`✗ Failed to download ${model.name}:`, error)
    }
  }

  console.log('✅ Download complete!')
  console.log('\nNote: Some URLs may be placeholders. For real models, visit:')
  console.log('- https://www.printables.com')
  console.log('- https://www.thingiverse.com')
  console.log('- https://thangs.com')
}

main().catch(console.error)
