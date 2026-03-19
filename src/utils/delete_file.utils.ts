import { unlink } from "node:fs";

export const delete_file = (filepath: string) => {
  unlink(filepath, (err) => {
    console.log(err);
  });
};
