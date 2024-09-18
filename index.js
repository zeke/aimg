#!/usr/bin/env node

import minimist from 'minimist'
import promptmaker from 'promptmaker'
import { run } from './lib/run.js'

const argv = minimist(process.argv.slice(2))

let prompt = argv._[0]
const count = argv.count || 3
const model = argv.model || 'black-forest-labs/flux-schnell'
const subject = argv.subject
const outputDir = argv.outputdir || '.'

if (!prompt && !subject) {
  console.log('Usage: aimg <prompt> [--count 3] [--model black-forest-labs/flux-schnell] [--subject <subject>] [--outputdir output-<timestamp>] [--<flag> <value>...]')
  process.exit()
}

console.log({ count, model, prompt, subject, outputDir })
console.log('Generating images...')

for (let i = 0; i < count; i++) {
  if (subject) {
    prompt = promptmaker({ subject })
  }

  const input = { prompt }

  // Add arbitrary CLI flags to the input object
  for (const [key, value] of Object.entries(argv)) {
    if (!['_', 'count', 'model', 'subject', 'outputdir'].includes(key)) {
      input[key] = value
    }
  }

  run({ model, input, outputDir })
}
