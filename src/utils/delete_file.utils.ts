import { unlink } from "node:fs";

export const delete_file = (filepath: string) => {
  return new Promise((resolve, reject) => {
    unlink(filepath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
};
