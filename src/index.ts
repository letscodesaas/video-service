import { serve } from "@hono/node-server";
import { Hono } from "hono";
import {
  is_upload_file_exists,
  is_preprocess_file_exists,
  is_hls_file_exists,
} from "./utils/check_file.utils.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { worker } from "./worker/worker.js";
import { delete_file } from "./utils/delete_file.utils.js";
import { createWriteStream } from "node:fs";
import { pipeline } from "stream/promises";
import { statusMonitor } from "hono-status-monitor";


const _dirname = fileURLToPath(import.meta.url);
const _filename = path.join(_dirname, "../", "upload");
const _file_upload_path = path.join(_dirname, "../", "threads");
const _video_path = path.join(_dirname, "../", "preprocess_video_files");

is_upload_file_exists();
is_preprocess_file_exists();
is_hls_file_exists();

const app = new Hono();
const monitor = statusMonitor();


app.use("*", monitor.middleware);

app.route("/status", monitor.routes);

app.get("/health", (c) => {
  c.status(200);
  return c.json({ message: "Healthy" });
});

app.post("/upload", async (c) => {
  try {
    const data = await c.req.parseBody();
    const file_name = data["video"] as File;
    const file_type = file_name.name.split(".")[1];
    const file_names = file_name.name.split(".")[0];
    const writeStream = createWriteStream(`${_filename}/${file_name.name}`);
    await pipeline(file_name.stream(), writeStream);
    if (file_type !== "mp4") {
      await worker(`${_file_upload_path}/video_process_thread.js`, {
        _filename,
        name: file_name.name,
        filename: file_names,
      });
      await worker(`${_file_upload_path}/hls_process_thread.js`, {
        file_names: file_names,
        video_path: `${_video_path}/${file_names}.mp4`,
      });
      await delete_file(`${_video_path}/${file_names}.mp4`);
    }

    await worker(`${_file_upload_path}/hls_process_thread.js`, {
      file_names: file_names,
      video_path: `${_filename}/${file_names}.mp4`,
    });

    await delete_file(`${_filename}/${file_name.name}`);

    return c.json({ message: "success" });
  } catch (error) {
    c.json({ message: "Internal server error" });
  }
});

serve({
  fetch: app.fetch,
  port: 3000,
});
monitor.initSocket(serve);
console.log("server is on")