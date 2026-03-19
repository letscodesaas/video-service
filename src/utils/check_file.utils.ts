import { fileURLToPath } from "node:url";
import path from "node:path";
import { mkdir } from "node:fs";
const _dirname = fileURLToPath(import.meta.url);
const _filename = path.join(_dirname, "../", "../", "upload");
const _pre_process_filename = path.join(_dirname, "../", "../", "preprocess_video_files");


export const is_upload_file_exists = () => {
  mkdir(
    _filename,
    {
      recursive: true,
    },
    (err) => {
      console.log(err);
    },
  );
};


export const is_preprocess_file_exists = () => {
  mkdir(
    _pre_process_filename,
    {
      recursive: true,
    },
    (err) => {
      console.log(err);
    },
  );
};
