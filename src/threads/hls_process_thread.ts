import { parentPort, workerData } from "worker_threads";
import { exec } from "child_process";
import path from "path";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";

const _dirname = fileURLToPath(import.meta.url);
const _filename = path.join(_dirname, "../", "../", "hls_video_files");

export const hls_process_thread = async () => {
  try {
    const data = workerData;
    mkdirSync(`${_filename}/${data.file_names}`, {
      recursive: true,
    });

    return new Promise((resolve, reject) => {
      const hls_command = `ffmpeg -i ${data.video_path} -codec:v libx264 -codec:a aac  -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${_filename}/${data.file_names}/segment%03d.ts" -start_number 0 ${_filename}/${data.file_names}/index.m3u8`;
      exec(hls_command, (err, stdout, stderr) => {
        if (err) {
          parentPort?.postMessage(err.message);
          reject(err.message);
        }
        if (stdout) {
          parentPort?.postMessage(stdout);
          resolve(stdout);
        }
        if (stderr) {
          parentPort?.postMessage(stderr);
          reject(stderr);
        }
      });
    });
  } catch (error) {
    throw new Error(String(error));
  }
};

hls_process_thread();
