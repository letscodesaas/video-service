import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { is_upload_file_exists,is_preprocess_file_exists } from "./utils/check_file.utils.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { worker } from "./worker/worker.js";
import { delete_file } from "./utils/delete_file.utils.js";

const _dirname = fileURLToPath(import.meta.url);
const _filename = path.join(_dirname, "../", "upload");
const _file_upload_path = path.join(_dirname, "../", "threads");

is_upload_file_exists();
is_preprocess_file_exists();
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/upload", async (c) => {
  try {
    const data = await c.req.parseBody();
    const file_name = data["video"] as File;
    const file_uploader_worker = await worker(
      `${_file_upload_path}/file_upload_thread.js`,
      {
        file_name,
        _filename,
        name: file_name.name,
      },
    );

    if (file_uploader_worker) {
      const video_preprocess = await worker(
        `${_file_upload_path}/video_process_thread.js`,
        {
          _filename,
          name: file_name.name,
        },
      );
      delete_file(`${_filename}/${file_name.name}`);
      console.log(video_preprocess);
    }

    return c.json({ message: "success" });
  } catch (error) {
    c.json({ message: "Internal server error" });
  }
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
