import fs from 'node:fs/promises'
import Replicate from 'replicate'
import dotenv from 'dotenv'
import download from 'download'
import { slugify } from 'transliteration'
import path from 'node:path'
dotenv.config()

const replicate = new Replicate()

export async function run ({ model, prompt, outputDir }) {
  const input = { prompt }

  let output
  try {
    output = await replicate.run(model, { input })
    console.log({ input, output })
  } catch (error) {
    console.error(error)
    return
  }

  if (!output || output.length === 0) {
    console.error('No output')
    return
  }

  await fs.mkdir(outputDir, { recursive: true })

  for (const url of output) {
    const urlPath = new URL(url).pathname
    const segments = urlPath.split('/')
    const secondToLastSegment = segments[segments.length - 2]
    const fileExtension = path.extname(urlPath)
    const filename = `${secondToLastSegment}-${slugify(input.prompt).substring(0, 100)}${fileExtension}`

    await download(url, outputDir, { filename })
  }
}
