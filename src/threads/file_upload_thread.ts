import { parentPort, workerData } from "node:worker_threads";
import { writeFile } from "node:fs";

export const file_uploader_thread = async () => {
  const data = workerData;
  const buffer = Buffer.from(await data.file_name.arrayBuffer());
  writeFile(`${data._filename}/${data.name}`, buffer, (err) => {
    parentPort?.postMessage(err?.message);
  });
  parentPort?.postMessage("file uploaded");
};
file_uploader_thread();
