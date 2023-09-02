/*__@import:everything/utils/UUID__*/


function handleVideoChange(e) {
  State.update(e.target.files[0]);
}

function handleAssets(assets) {
  console.log("assets", assets);
  State.update({ uploadedVideo: assets[0] });
}

function handleStatus(status) {
  console.log(status);
  State.update({ uploadStatus: status });
}

State.init({
  title: "",
  description: "",
  tags: [],
  playbackId: "",
  view: "BROWSE",
});

function handleOnChange(video) {
  State.update({ currentUpload: video });
}

function handleCreateVideo() {
  const { playbackId, storage, size, videoSpec, downloadUrl, name, source } =
    state.uploadedVideo;
  console.log(state.uploadedVideo);
  const id = UUID.generate("xxxxxxx");
  // TODO: Validate against Type
  Social.set(
    {
      thing: {
        [id]: {
          "": JSON.stringify({
            playbackId,
            storage,
            size,
            videoSpec,
            downloadUrl,
            name,
            source,
            poster: "https://ipfs.near.social/ipfs/" + state.image.ipfs_cid,
          }),
          metadata: {
            name: state.title,
            description: state.description,
            type: "every.near/type/video",
          },
        },
      },
      index: {
        every: JSON.stringify({
          key: "video",
          value: { id, type: "every.near/type/video" },
        }),
      },
    },
    {
      onCommit: () => {
        State.update({ title: "", description: "", view: "SUCCESS" });
      },
    }
  );
}

function handleImageUpload(image) {
  State.update({ image });
}

const ImageUploaderContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;
  padding: 1em;
  background: #ffffff;
  border: 1px solid #eceef0;
  box-shadow:
    0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 8px;
  width: 100%;
`;

const ProcessingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Main = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  .left,
  .right {
    width: 50%;
    padding: 20px;
    box-sizing: border-box;
  }

  input,
  button {
    margin-top: 10px;
  }
`;

const Button = styled.button``;

return (
  <Main className="container">
    <div className="left" style={{ position: "relative" }}>
      {state.uploadStatus === "loading" && (
        <ProcessingOverlay>
          <p>Processing... (this can take a minute)</p>
        </ProcessingOverlay>
      )}
      <h2>Upload to Livepeer</h2>

      <Widget
        src={"/*__@appAccount__*//widget/Inputs.File"}
        props={{
          label: "Video",
          id: "livepeer-video",
          fileAccept: ["video/*"],
          value: state.vid,
          UploadButton: (p) => <Button children={p.children} />,
          handleOnChange,
        }}
      />
      <ImageUploaderContainer>
        <Widget
          src="every.near/widget/every.image.create"
          props={{ onChange: handleImageUpload }}
        />
      </ImageUploaderContainer>
      <input
        type="text"
        placeholder="Title"
        value={state.title}
        onChange={(e) => State.update({ title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={state.description}
        onChange={(e) => State.update({ description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Tags separated by commas"
        value={state.tags.join(", ")}
        onChange={(e) => {
          const v = e.target.value || "";
          State.update({
            tags: v
              .split(",")
              .filter((v) => v !== "")
              .map((v) => v.trim()),
          });
        }}
      />
      <Widget
        src="/*__@appAccount__*//widget/Livepeer.Creator"
        props={{
          video: state.currentUpload,
          metadata: { title, description },
          handleAssets: handleAssets,
          handleStatus: handleStatus,
        }}
      />
      <Button onClick={handleCreateVideo}>Create Thing</Button>
    </div>
    <div className="right">
      <h2>Play from Livepeer</h2>
      <input
        type="text"
        placeholder="Playback ID"
        value={state.playbackId}
        onChange={(e) => State.update({ playbackId: e.target.value })}
      />
      {state.playbackId && (
        <Widget
          src="/*__@appAccount__*//widget/Livepeer.Player"
          props={{
            playbackId: state.playbackId,
            title: state.title,
            PostImage: state.image && (
              <img
                src={"https://ipfs.near.social/ipfs/" + state.image.ipfs_cid}
                alt={state.title}
              />
            ),
          }}
        />
      )}
    </div>
  </Main>
);
