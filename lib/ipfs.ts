import { readFile } from "@/lib/utils/fs";

export interface UploadToIPFSOptions {
  uploadAPI: {
    url: string,
    method?: string,
    headers?: any,
  }
};
type SrcType = string | Buffer; // string is the local path to upload

export async function uploadToIPFS(src: SrcType, options: UploadToIPFSOptions): Promise<string> {
  let buffer: Buffer;
  if (typeof src === "string") {
    buffer = await readFile(src).catch((e) => {
      // TODO: handle log
      console.error(e);
      throw e;
    });
  } else if (Buffer.isBuffer(src)) {
    buffer = src;
  } else {
    throw new Error("src must be string path or Buffer");
  }

  const url = options.uploadAPI.url;
  const method = options.uploadAPI.method || "POST";
  const headers = options.uploadAPI.headers || {
    Accept: "application/json",
  };

  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const formData = new FormData();
  formData.append("file", blob);

  const cid = await fetch(url, {
    method,
    headers,
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      return res.cid;
    })
    .catch((e) => {
      // TODO: handle log
      console.error(e);
    });

  return cid;
}
