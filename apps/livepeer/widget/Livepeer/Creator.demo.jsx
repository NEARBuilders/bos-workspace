const ROOT_ACCOUNT = props.ROOT_ACCOUNT ?? "/*__@appAccount__*/";

const propsTable = `

| Prop Name       | Type/Values     | Default Value  | Description                                        |
|-----------------|-----------------|----------------|----------------------------------------------------|
| ${"`video`"}         | File            | ${"`N/A`"}            | The video file to upload.                          |
| ${"`metadata`"}      | Object          | ${"`N/A`"}            | The metadata for the video.                        |
| ${"`handleStatus`"}  | Function        | ${"`N/A`"}            | A callback function for status updates.            |
| ${"`handleProgress`"}| Function        | ${"`N/A`"}            | A callback function for progress updates.          |
| ${"`handleError`"}   | Function        | ${"`N/A`"}            | A callback function for error updates.             |
| ${"`handleAssets`"}  | Function        | ${"`N/A`"}            | A callback function for asset updates.             |
| ${"`Button`"}        | Function/ReactNode | ${"`N/A`"}         | A custom component to render the button for uploading.    |
| ${"`debug`"}         | Boolean         | ${"`false`"}        | Whether to log debug messages or not.              |
| ${"`...props`"} | any    | ${"`N/A`"}| Any other props will be passed to the underlying [Livepeer Asset Creator](https://docs.livepeer.org/reference/livepeer-js/asset/useCreateAsset). |
`;

const widgetCode = `
\`\`\`jsx
// Use Files if you need the user to upload a video asset from file system
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
  }}
  >
  Stage Video
</Files>

<Widget
  src={\"${ROOT_ACCOUNT}/widget/Livepeer.Creator\"}
  props={{
    video: state.currentUpload,
    metadata: { title, description },
    handleStatus: (status) => { console.log(status) },
    handleProgress: (progress) => { console.log(progress) },
    handleError: (error) => { console.log(assets) },
    handleAssets: (assets) => { console.log(assets) },
    Button: ({ onClick, disabled }) => (
      <button onClick={onClick} disabled={disabled}>
        Upload to Livepeer
      </button>
    ),
  }}
/>
\`\`\`
`;

return (
  <div className="d-flex flex-column gap-1 pb-4">
    <Widget
      src={`nearui.near/widget/Typography.Text`}
      props={{
        children: "Preview",
        tag: "h2",
        size: "4",
        weight: "bold",
        color: "default",
        className: "mt-4 mb-2",
      }}
    />
    <div
      className="d-flex flex-column gap-1"
      style={{
        background: "#fefefe",
        border: "1px solid #ccc",
        padding: "24px",
        borderRadius: "12px",
      }}
    >
      <Widget
        src={`${ROOT_ACCOUNT}/widget/Livepeer.Creator`}
        props={{
          children: "Preview",
          tag: "h2",
          size: "4",
          weight: "bold",
          color: "default",
          className: "mt-4 mb-2",
        }}
      />
    </div>
    <Widget
      src={`nearui.near/widget/Typography.Text`}
      props={{
        children: "Usage",
        tag: "h2",
        size: "4",
        weight: "bold",
        color: "default",
        className: "mt-4 mb-2",
      }}
    />
    <Markdown text={widgetCode} />
    <Widget
      src={`nearui.near/widget/Typography.Text`}
      props={{
        children: "Properties",
        tag: "h2",
        size: "4",
        weight: "bold",
        color: "default",
        className: "mt-4 mb-2",
      }}
    />
    <Markdown text={propsTable} />
  </div>
);
