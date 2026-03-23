import { createReadStream, readdirSync, rmdir, unlink } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { WebHook_Handler } from "../webhook/webhook.js";

const _dirname = fileURLToPath(import.meta.url);
const _filename = path.join(_dirname, "../", "../", "hls_video_files");

export class File_uploader_Serivce extends WebHook_Handler {
  private access_token: string;
  private secret_token: string;
  private bucket: string;
  constructor(
    access_token: string,
    secret_token: string,
    url: string,
    bucket_name: string,
  ) {
    super(url);
    this.access_token = access_token;
    this.secret_token = secret_token;
    this.bucket = bucket_name;
  }

  private async s3Configuation() {
    try {
      const s3 = new S3Client({
        credentials: {
          accessKeyId: this.access_token,
          secretAccessKey: this.secret_token,
        },
        region: "ap-south-1",
      });
      return s3;
    } catch (error) {
      throw new Error(String(error));
    }
  }
  public async upload(foldername: string) {
    try {
      const s3 = await this.s3Configuation();
      const files = readdirSync(`${_filename}/${foldername}`);
      for (const f of files) {
        const file_stream = createReadStream(`${_filename}/${foldername}/${f}`);
        await s3.send(
          new PutObjectCommand({
            Bucket: this.bucket,
            Key: `${foldername}/${f}`,
            Body: file_stream,
          }),
        );
      }
      const obj = {
        filepath: `${_filename}/${foldername}`,
      };
      await this.handler(obj, "secret");
      for (const f of files) {
        unlink(`${_filename}/${foldername}/${f}`, (err) => {
          console.log(err);
        });
      }
      rmdir(`${_filename}/${foldername}`, (err) => {
        console.log(err);
      });
    } catch (error) {
      throw new Error(String(error));
    }
  }
}
