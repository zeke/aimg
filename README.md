# aimg

A Node.js CLI for generating AI images with Replicate and saving them to disk.

![screenshot](https://github.com/replicate/cog/assets/2289/f6ad8d6b-cc9c-4b07-a241-7766cd232d6f)

## Features

- Easy to install and use.
- Supports any model on Replicate that has a `prompt` input. Default is [Flux Schnell](https://replicate.com/black-forest-labs/flux-schnell).
- Saves all the files to disk for you.
- Includes prediction id and a slug of the prompt in the filename.
- Lets you specify an exact prompt, or specify a subject and roll the dice with random [promptmaker](https://npm.im/promptmaker) prompts.
- Automatically adds [MediaProvenance](https://github.com/zeke/media-provenance) EXIF metadata to the downloaded image files so you have a record of the model, input, output, etc.

## Installation

```
npm i -g aimg
```

Then grab a [Replicate API token](https://replicate.com/account/api-tokens) and set it in your environment:

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

The default model is [Flux Schnell](https://replicate.com/blog/flux-state-of-the-art-image-generation), but you can specify any model with the `--model` option.

```
aimg "cute cat" --model bytedance/sdxl-lightning-4step
```

This will work for any model on Replicate that takes a `prompt` as input and outputs a list of URLs.

Examples:

- [`black-forest-labs/flux-dev`](https://replicate.com/black-forest-labs/flux-dev)
- [`bytedance/sdxl-lightning-4step`](https://replicate.com/bytedance/sdxl-lightning-4step)
- [`stability-ai/stable-diffusion-3`](https://replicate.com/stability-ai/stable-diffusion-3)
- [`zeke/ziki-flux`](https://replicate.com/zeke/ziki-flux) ← works for [Flux fine-tunes](https://replicate.com/collections/flux-fine-tunes) too!
- [more...](https://replicate.com/collections/text-to-image)

The latest version of the model is used unless you specify a version in the format `{owner}/{name}:{version}`:

```
aimg "cute cat" --model zeke/ziki-flux:dadc276a9062240e68f110ca06521752f334777a94f031feb0ae78ae3edca58e
```

### More images

If you want more images, use the `--count` option:

```
aimg "cute cat" --count 20
```

## Extra flags as inputs to the model

Any extra flags you pass will be passed along to the model as input. For example, if the model takes an `output_format` input, you can pass it like this:

```
aimg "cute cat" --output_format jpg
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