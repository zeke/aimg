import fs from 'node:fs/promises'
import Replicate from 'replicate'
import dotenv from 'dotenv'
import download from 'download'
import { slugify } from 'transliteration'
import path from 'node:path'
import MediaProvenance from 'media-provenance'

dotenv.config()

const replicate = new Replicate()

async function getModelFullNameWithVersion (model) {
  const [owner, name] = model.split('/')
  if (owner && name) {
    const { results: versions } = await replicate.models.versions.list(owner, name)
    const latestVersion = versions[0].id
    return `${model}:${latestVersion}`
  }
  throw new Error('Invalid model format. Expected "owner/name".')
}

export async function run ({ model, input, outputDir }) {
  let output
  let prediction
  try {
    output = await replicate.run(model, { input }, (predictionData) => {
      prediction = predictionData
    })
  } catch (error) {
    if (error.response?.status === 422) {
      console.log(`Received 422 error from the Replicate API. Attempting to fetch version data for ${model}...`)
      const versionedModel = await getModelFullNameWithVersion(model)
      console.log(`Rerunning with versioned model: ${versionedModel}`)
      output = await replicate.run(versionedModel, { input }, (predictionData) => {
        prediction = predictionData
      })
    } else {
      console.error('Error running model:', error)
      return
    }
  }

  console.log({ input, output })

  if (!output || output.length === 0) {
    console.error('No output')
    return
  }

  await fs.mkdir(outputDir, { recursive: true })

  // Only one URL? Make it an array.
  if (!Array.isArray(output)) {
    output = [output]
  }

  for (const url of output) {
    const urlPath = new URL(url).pathname
    const fileExtension = path.extname(urlPath)
    const filename = `${prediction.id}-${slugify(input.prompt).substring(0, 100)}${fileExtension}`

    await download(url, outputDir, { filename })

    // Add MediaProvenance metadata to the image file
    // See https://github.com/zeke/media-provenance
    const fullPath = path.join(outputDir, filename)
    const provenanceData = {
      provider: 'Replicate (https://replicate.com/)',
      model,
      input: prediction.input,
      output: prediction.output,
      meta: {
        ...prediction,
        input: undefined,
        output: undefined,
        logs: undefined
      }
    }
    await MediaProvenance.set(fullPath, provenanceData)
  }
}
