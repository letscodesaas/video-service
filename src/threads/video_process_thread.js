import { exec } from "node:child_process";
import { parentPort, workerData } from "node:worker_threads";
import path from "node:path";
import { fileURLToPath } from "node:url";

const _dirname = fileURLToPath(import.meta.url);
const _filename = path.join(_dirname, "../", "../", "preprocess_video_files");
export const video_process_thread = async () => {
  const data = workerData;
  return new Promise((resolve, reject) => {
    exec(
      `ffmpeg -i ${data._filename}/${data.name} -vf "fps=30" -pix_fmt yuv420p ${_filename}/${data.filename}.mp4`,
      (err, stdout, stderr) => {
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
      },
    );
  });
};
video_process_thread();
