# aimg

A Node.js CLI for generating AI images with Replicate and saving them to disk.

![screenshot](https://github.com/replicate/cog/assets/2289/f6ad8d6b-cc9c-4b07-a241-7766cd232d6f)

## Features

- Easy to install and use.
- Supports multiple models like [Flux](https://replicate.com/blog/flux-state-of-the-art-image-generation) and [SD3](https://replicate.com/stability-ai/stable-diffusion-3).
- Saves all the files to disk for you.
- Includes prediction id and a slug of the prompt in the filename.
- Lets you specify an exact prompt, or specify a subject and roll the dice with random [promptmaker](https://npm.im/promptmaker) prompts.

## Installation

```
npm i -g aimg
```

The grab a [Replicate API token](https://replicate.com/account/api-tokens) and set it in your environment:

```
export REPLICATE_API_TOKEN="r8_..."
```

## Usage

All that is required is a prompt:

```
aimg "cute cat"
```

This will generate three images of a cute cat and save them to the current directory.

### Long prompt

If your prompt is long, you can put it in a file:

```
aimg "$(cat prompt.md)"
```

## Different model

You don't have to use SD3. Here's an example using [Flux Schnell](https://replicate.com/blog/flux-state-of-the-art-image-generation), the new state-of-the-art image generation model for the creators of Stable Diffusion:

```
aimg "cute cat" --model "black-forest-labs/flux-schnell"
```

### More images

If you want more images, use the `--count` option:

```
aimg "cute cat" --count 20
```

### Random prompts

If you want generate a different semi-random prompt for each image, specify a `subject` and it will use [promptmaker](https://npm.im/promptmaker) to generate random prompts:

```
aimg --subject "a white cat"
```

If you specify a `subject`, then `prompt` is ignored.

### Output directory

If you want to save the images to a specific directory, use the `--outputdir` option:

```
aimg "pink cat" --outputdir "pink-cat"
```

### Kitchen sink

Hee's an example that loads a prompt from a file, generates 100 images with random "pink cat" prompts, and stuffs them in a specific directory:

```
aimg --subject "pink cat" --count 100 --outputdir "pink-cat"
```

## Options

- `--count`: Number of images to generate. Defaults to 3
- `--model`: Model to use. Defaults to [stability-ai/stable-diffusion-3](https://replicate.com/stability-ai/stable-diffusion-3)
- `--subject`: Subject to pass into [promptmaker](https://npm.im/promptmaker) to generate random prompts