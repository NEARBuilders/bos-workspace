async function uploadToIpfs(content) {
  const { createHelia } = await import("helia");
  const { json } = await import("@helia/json");

  const helia = await createHelia();
  const heliaInstance = json(helia);

  const cid = await heliaInstance.add(content);
  try {
    console.log("====================================");
    console.log("Added file:", cid);
    console.log("Added file:", cid.toString());
    console.log("====================================");
    return cid;
  } catch (e) {
    throw new Error(`Error uploading content to IPFS: ${e}`);
  }
}

module.exports = { uploadToIpfs };
