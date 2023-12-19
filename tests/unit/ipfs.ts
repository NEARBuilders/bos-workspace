import { uploadToIPFS, UploadToIPFSOptions } from "@/lib/ipfs"


const unmockedFetch = global.fetch;

describe("uploadToIPFS", () => {
  beforeAll(() => {
    global.fetch = (() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          cid: "bafkreicpbijnii55242f7wcs6xnjf3ocyuyuguts6r6kkfz745g3jjudam",
        })
      })
    }) as any;
  })
  afterAll(() => {
    global.fetch = unmockedFetch;
  })
  it("uploads the blob to IPFS API and returns the CID", async () => {
    const opts: UploadToIPFSOptions = {
      uploadAPI: {
        url: "https://ipfs.near.social/add",
      }
    };
    const buffer = Buffer.from("hello world");
    const CID = await uploadToIPFS(buffer, opts);
    const CID_REGEX = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$/;

    expect(CID).toMatch(CID_REGEX);
  })
})
