import { exec } from "node:child_process";
import { parentPort, workerData } from "node:worker_threads";
import path from "node:path";
import { fileURLToPath } from "node:url";

const _dirname = fileURLToPath(import.meta.url);
const _filename = path.join(_dirname, "../", "preprocess_video_files");
export const video_process_thread = () => {
  const data = workerData;

  exec(
    `ffmpeg -i ${data._filename}/${data.name} -vf "fps=30" -pix_fmt yuv420p ${_filename}/video.mp4`,
    (err, stdout, stderr) => {
      if (err) {
        parentPort?.postMessage(err.message);
      }
      if (stdout) {
        parentPort?.postMessage(stdout);
      }
      if (stderr) {
        parentPort?.postMessage(stderr);
      }
    },
  );
};
video_process_thread();
