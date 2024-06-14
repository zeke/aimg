#!/usr/bin/env node

import minimist from 'minimist'
import promptmaker from 'promptmaker'
import { run } from './lib/run.js'

const argv = minimist(process.argv.slice(2))

let prompt = argv._[0]
const count = argv.count || 3
const model = argv.model || 'stability-ai/stable-diffusion-3'
const subject = argv.subject
const outputDir = argv.outputdir || '.'

if (!prompt && !subject) {
  console.log('Usage: aimg <prompt> [--count 3] [--model stability-ai/stable-diffusion-3] [--subject <subject>] [--outputdir output-<timestamp>]')
  process.exit()
}

console.log({ count, model, prompt, subject, outputDir })
console.log('Generating images...')

for (let i = 0; i < count; i++) {
  if (subject) {
    prompt = promptmaker({ subject })
  }

  run({ model, prompt, outputDir })
}
