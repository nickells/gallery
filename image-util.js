const exifReader = require('exif-reader')
const fs = require('fs').promises
const path = require('path')
const sharp = require('sharp')
const pick = require('lodash/pick')

const go = async () => {
  const basePath = path.join(__dirname, '.images')
  const dataPath = path.join(basePath, 'data.json')
  let images = await fs.readdir(basePath)
  images = images.filter(path => {
    if (path[0] === '.') return false
    if (path.includes('_nano')) return false
    if (path.includes('.json')) return false
    return true
  })

  let metadataJSON = []

  let i = 0
  for (let imagePath of images) {
    const inputPath = path.join(basePath, imagePath)
    const outputPath = inputPath.replace('.jpg', '_nano.jpg')
    const img = sharp(inputPath)
    
    img
    .resize(100)
    .toFile(outputPath)
    
    let data = await img.metadata()
    data.exif = exifReader(data.exif).exif
    data.url = imagePath

  
    let trimData = pick(data,
      'url',
      'width', 
      'height',
      'exif'
    )
    
    metadataJSON[i++] = trimData

  }
  
  fs.writeFile(dataPath, JSON.stringify(metadataJSON, null, 2))
}

go()