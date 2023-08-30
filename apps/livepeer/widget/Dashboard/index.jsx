/*__@import:everything/utils/UUID__*/

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #4cc38a;
  background-image: linear-gradient(180deg, #c5ecdb 0%, #a5e1c6 100%);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 18px;
  background-color: #f2f2f2;
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

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

const Branding = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  cursor: pointer;

  svg {
    width: auto;
    height: 1em;
    vertical-align: middle;
  }
`;

const MainText = styled.span`
  font-size: 3em;
  font-weight: bold;
  margin-right: 8px;
`;

const SubText = styled.span`
  font-size: 0.8em;
  color: grey;
  margin-left: 4px;
`;

const Button = styled.button``;

const CreateButton = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  font-weight: var(--font-weight-medium);
  text-transform: lowercase !important;
  text-align: center;
  text-decoration: none;
  border: 2px outset #333;
  background-color: #f5f5f5;
  cursor: pointer;
`;

const Modal = styled.div`
  background-color: #fff;
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

function handleTabClick(newView) {
  State.update({ view: newView });
}

function handleOnChange(video) {
  State.update({ currentUpload: video });
}

function handleCreateVideo() {
  const { playbackId, storage, size, videoSpec, downloadUrl, name, source } =
    state.uploadedVideo;
  console.log(state.uploadedVideo);
  const id = UUID.generate("xxxxxxx");
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

function handleExpandVideo(path, blockHeight) {
  State.update({ view: "VIEW", expandedVideo: { path, blockHeight } });
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

return (
  <Container>
    <Header>
      <Branding onClick={() => handleTabClick("BROWSE")}>
        <MainText>every video</MainText>
        <SubText>powered by</SubText>
        <svg
          width="640"
          height="640"
          viewBox="0 0 640 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="320" cy="320" r="320" fill="#141716" />
          <rect
            x="444.69"
            y="355.605"
            width="60"
            height="60"
            transform="rotate(-90 444.69 355.605)"
            fill="white"
          />
          <rect
            x="314.692"
            y="285.605"
            width="60"
            height="60"
            transform="rotate(-90 314.692 285.605)"
            fill="white"
          />
          <rect
            x="314.692"
            y="425.605"
            width="60"
            height="60"
            transform="rotate(-90 314.692 425.605)"
            fill="white"
          />
          <rect
            x="184.69"
            y="495.605"
            width="60"
            height="60"
            transform="rotate(-90 184.69 495.605)"
            fill="white"
          />
          <rect
            x="184.69"
            y="355.605"
            width="60"
            height="60"
            transform="rotate(-90 184.69 355.605)"
            fill="white"
          />
          <rect
            x="184.69"
            y="215.605"
            width="60"
            height="60"
            transform="rotate(-90 184.69 215.605)"
            fill="white"
          />
        </svg>
        <svg
          width="640"
          height="177"
          viewBox="0 0 640 177"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M53.3346 0H34.2151V18.883H53.3346V0ZM17.1069 6.56513e-05H0V138.144H17.1069V6.56513e-05ZM225.909 35.7698C208.511 35.7698 194.951 44.6133 187.787 56.4889C182.158 65.8377 180.111 76.4499 180.111 88.3255C180.111 102.475 184.205 115.614 192.648 125.216C200.324 134.312 211.837 140.123 226.165 140.123C235.632 140.123 244.587 137.344 251.751 132.543C259.938 126.984 265.823 117.888 267.358 108.034H250.727C249.448 113.34 247.657 116.119 244.843 118.899C240.749 123.194 234.097 125.468 226.165 125.468C218.489 125.468 212.349 122.942 207.743 118.393C201.603 112.329 198.021 102.475 198.021 93.3789H269.405L269.661 83.2721C269.917 69.8805 265.056 56.9942 256.868 48.1507C249.192 40.5705 238.958 35.7698 225.909 35.7698ZM198.274 79.2295C198.785 64.5745 207.74 49.9196 225.906 49.9196C234.861 49.9196 241.514 53.457 245.863 59.0157C249.957 64.3218 252.004 71.902 252.004 79.2295H198.274ZM327.819 36.7786C316.623 36.7786 303.645 42.3233 297.792 52.1527L294.739 39.2989H281.761V176.91H298.556V126.755C303.9 135.829 316.877 140.869 327.565 140.869C339.27 140.869 348.431 136.837 355.047 130.788C365.225 121.21 370.315 105.584 370.315 88.4458C370.315 72.0635 365.48 56.9414 355.81 47.3641C349.703 40.8111 340.033 36.7786 327.819 36.7786ZM325.027 127.019C317.648 127.019 312.813 123.994 308.741 120.466C300.344 113.157 297.545 101.311 297.545 88.9613C297.545 76.6116 300.344 64.5138 308.741 57.4569C312.813 53.9284 317.648 50.9039 325.027 50.9039C347.42 50.9039 353.273 70.8147 353.273 88.9613C353.273 107.108 347.42 127.019 325.027 127.019ZM390.067 56.4889C397.231 44.6133 410.791 35.7698 428.19 35.7698C441.238 35.7698 451.473 40.5705 459.148 48.1507C467.336 56.9942 472.197 69.8805 471.941 83.2721L471.685 93.3789H400.301C400.301 102.475 403.883 112.329 410.024 118.393C414.629 122.942 420.77 125.468 428.445 125.468C436.377 125.468 443.029 123.194 447.123 118.899C449.937 116.119 451.728 113.34 453.008 108.034H469.638C468.103 117.888 462.219 126.984 454.031 132.543C446.867 137.344 437.912 140.123 428.445 140.123C414.117 140.123 402.604 134.312 394.928 125.216C386.485 115.614 382.391 102.475 382.391 88.3255C382.391 76.4499 384.438 65.8377 390.067 56.4889ZM428.184 49.9196C410.018 49.9196 401.063 64.5745 400.552 79.2295H454.282C454.282 71.902 452.235 64.3218 448.141 59.0157C443.791 53.457 437.139 49.9196 428.184 49.9196ZM528.81 35.7732C511.411 35.7732 497.851 44.6167 490.687 56.4923C485.058 65.8411 483.011 76.4534 483.011 88.3289C483.011 102.479 487.105 115.617 495.548 125.219C503.224 134.315 514.738 140.127 529.066 140.127C538.532 140.127 547.487 137.347 554.651 132.546C562.839 126.988 568.723 117.892 570.259 108.037H553.628C552.349 113.343 550.558 116.123 547.743 118.902C543.649 123.198 536.997 125.472 529.066 125.472C521.39 125.472 515.249 122.945 510.644 118.397C504.503 112.333 500.921 102.479 500.921 93.3824H572.305L572.561 83.2755C572.817 69.8839 567.956 56.9976 559.768 48.1541C552.093 40.574 541.858 35.7732 528.81 35.7732ZM501.174 79.2292C501.686 64.5743 510.641 49.9193 528.807 49.9193C537.762 49.9193 544.414 53.4567 548.764 59.0155C552.857 64.3216 554.904 71.9018 554.904 79.2292H501.174ZM640 51.4028L636.175 39.2643L600.723 51.6557L597.662 38.7585H584.655V138.143H601.488V67.5876L640 51.4028ZM34.2139 38.7585H51.3208V138.143H34.2139V38.7585Z"
            fill="#191D1B"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M130.082 36.4229H109.269V57.2358H130.082V36.4229ZM130.082 119.674H109.269V140.487H130.082V119.674ZM150.894 36.4229H171.707V57.2358H150.894V36.4229ZM88.4546 36.4235H67.6416V57.2364H88.4546V36.4235ZM130.081 78.0482H150.894V98.8612H130.081V78.0482ZM109.269 78.0482H88.4558V98.8612H109.269V78.0482Z"
            fill="#191D1B"
          />
        </svg>
      </Branding>
      <ButtonRow>
        <Button onClick={() => handleTabClick("BROWSE")}>Browse</Button>
        <Button onClick={() => handleTabClick("CREATE")}>Create</Button>
      </ButtonRow>
    </Header>
    <div
      className={
        "container h-100" + (state.view !== "SUCCESS" ? " d-none" : "")
      }
      key={"SUCCESS"}
    >
      <p>Video successfully uploaded! Go watch it</p>
    </div>
    <div
      className={"container h-100" + (state.view !== "VIEW" ? " d-none" : "")}
      key={"VIEW"}
    >
      <Widget
        src="livepeer.near/widget/Video.Player"
        props={{
          path: state.expandedVideo.path,
          blockHeight: state.expandedVideo.blockHeight,
        }}
      />
    </div>
    <div
      className={"container h-100" + (state.view !== "BROWSE" ? " d-none" : "")}
      key={"BROWSE"}
    >
      <Widget
        src="livepeer.near/widget/Dashboard.list"
        props={{ handleExpandVideo: handleExpandVideo }}
      />
    </div>
    <div
      className={"container h-100" + (state.view !== "CREATE" ? " d-none" : "")}
      key={"CREATE"}
    >
      <Main>
        <div className="left" style={{ position: "relative" }}>
          {state.uploadStatus === "loading" && (
            <ProcessingOverlay>
              <p>Processing...</p>
            </ProcessingOverlay>
          )}
          <h2>Upload to Livepeer</h2>

          <Widget
            src={"livepeer.near/widget/Inputs.File"}
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
            src="livepeer.near/widget/Livepeer.Creator"
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
              src="livepeer.near/widget/Livepeer.Player"
              props={{
                playbackId: state.playbackId,
                title: state.title,
                PostImage: state.image && (
                  <img
                    src={
                      "https://ipfs.near.social/ipfs/" + state.image.ipfs_cid
                    }
                    alt={state.title}
                  />
                ),
              }}
            />
          )}
        </div>
      </Main>
    </div>
  </Container>
);

// <Widget
//           src="nearui.near/widget/Layout.Modal"
//           props={{
//             open: state.creatorOpen,
//             onOpenChange: (open) => {
//               State.update({
//                 ...state,
//                 creatorOpen: open,
//               });
//             },
//             toggle: (
//               <CreateButton>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   stroke-width="2"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                 >
//                   <line x1="12" y1="8" x2="12" y2="16"></line>
//                   <line x1="8" y1="12" x2="16" y2="12"></line>
//                 </svg>
//               </CreateButton>
//             ),
//             content: (
//               <Modal>
// <Main>
//   <div className="left">
//     <h2>Upload to Livepeer</h2>
//     <Files
//       multiple={false}
//       accepts={["video/*"]}
//       minFileSize={1}
//       clickable
//       className="files-button"
//       onChange={(files) => {
//         if (!files || !files.length) return;
//         const [body] = files;
//         State.update({ currentUpload: body });
//         console.log(body);
//       }}
//     >
//       {state.uploading
//         ? "Uploading"
//         : state.cid
//         ? "Replace"
//         : "Upload"}
//     </Files>
//     <input
//       type="text"
//       placeholder="Title"
//       value={state.title}
//       onChange={(e) => State.update({ title: e.target.value })}
//     />
//     <input
//       type="text"
//       placeholder="Description"
//       value={state.description}
//       onChange={(e) =>
//         State.update({ description: target.value })
//       }
//     />

//     <Widget
//       src="devs.near/widget/Livepeer.Creator"
//       props={{
//         video: state.currentUpload,
//         metadata: { title, description },
//         handleAssets: handleAssets,
//       }}
//     />
//   </div>
//   <div className="right">
//     <h2>Play from Livepeer</h2>
//     <input
//       type="text"
//       placeholder="Playback ID"
//       value={state.playbackId}
//       onChange={(e) =>
//         State.update({ playbackId: e.target.value })
//       }
//     />
//     {state.playbackId && (
//       <Widget
//         src="livepeer.near/widget/Livepeer.Player"
//         props={{
//           playbackId: state.playbackId,
//           title: state.title,
//         }}
//       />
//     )}
//   </div>
// </Main>
//               </Modal>
//             ),
//           }}
//         />
