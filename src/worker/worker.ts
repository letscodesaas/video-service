import { Worker } from "node:worker_threads";

export const worker = (filename: string, data?: any) => {
  const w = new Worker(filename, {
    workerData: data,
  });

  return new Promise((resolve, reject) => {
    w.on("error", (err) => {
      reject(err)
    });
    w.on("exit", (code) => {
      if (code !== 0) {
        reject("worker exit")
      }
    });
    w.on("message", (data) => {
        resolve(data)
    });
  });
};
