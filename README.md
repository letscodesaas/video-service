# Editorial Service

A lightweight Node.js + TypeScript service built with Hono to upload and preprocess video files using worker threads.

## Tech Stack

- TypeScript
- Hono (`@hono/node-server`)
- Node.js worker threads
- `ffmpeg` for video preprocessing

## Prerequisites

- Node.js 18+
- pnpm (recommended, lockfile included)
- `ffmpeg` installed and available in your shell path

Verify `ffmpeg`:

```bash
ffmpeg -version
```

## Install

```bash
pnpm install
```

## Run

Development (watch mode):

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Start compiled build:

```bash
pnpm start
```

Server runs on:

```text
http://localhost:3000
```

## API

### `GET /`

Health/basic response:

```text
Hello Hono!
```

### `POST /upload`

Uploads a video file and preprocesses it.

- Content type: `multipart/form-data`
- Form field name: `video`

Example:

```bash
curl -X POST http://localhost:3000/upload \
	-F "video=@/absolute/path/to/input.mp4"
```

Success response:

```json
{ "message": "success" }
```

## Processing Flow

1. Ensures required folders exist at startup.
2. Saves uploaded file using `src/threads/file_upload_thread.ts`.
3. Runs preprocessing using `src/threads/video_process_thread.ts`.
4. Executes `ffmpeg` transformation:
	 - `fps=30`
	 - pixel format: `yuv420p`
5. Writes processed output to:
	 - `src/preprocess_video_files/video.mp4`
6. Deletes original uploaded file after preprocessing.

## Project Structure

```text
src/
	index.ts
	preprocess_video_files/
	service/
	threads/
		file_upload_thread.ts
		video_process_thread.ts
	upload/
	utils/
		check_file.utils.ts
		delete_file.utils.ts
	worker/
		worker.ts
```

## Notes

- Current preprocessing output filename is fixed as `video.mp4`.
- Upload + preprocessing tasks are handled in worker threads to keep request handling responsive.
