const SideBySide = styled.div`
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

function handleVideoChange(e) {
  State.update(e.target.files[0]);
}

function handleAssets(assets) {
  console.log("assets", assets);
  State.update({ playbackId: assets[0].playbackId });
}

State.init({
  title: "",
  description: "",
  playbackId: "",
});

return (
  <SideBySide>
    <div className="left">
      <h2>Upload to Livepeer</h2>
      <Files
        multiple={false}
        accepts={["video/*"]}
        minFileSize={1}
        clickable
        className="files-button"
        onChange={(files) => {
          if (!files || !files.length) return;
          const [body] = files;
          State.update({ currentUpload: body });
          console.log(body);
        }}
      >
        {state.uploading ? "Uploading" : state.cid ? "Replace" : "Upload"}
      </Files>
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
        onChange={(e) => State.update({ description: target.value })}
      />

      <Widget
        src="devs.near/widget/Livepeer.Creator"
        props={{
          video: state.currentUpload,
          metadata: { title, description },
          handleAssets: handleAssets,
          Button: ({ onClick, disabled }) => (
            <button onClick={onClick} disabled={disabled}>
              {/* onClick could be "triggerUpload" */}
              upload to livepeer
            </button>
          ),
        }}
      />
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
          src="livepeer.near/widget/Livepeer.Player"
          props={{ playbackId: state.playbackId, title: state.title }}
        />
      )}
    </div>
  </SideBySide>
);
