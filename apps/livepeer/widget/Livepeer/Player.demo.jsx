const ROOT_ACCOUNT = props.ROOT_ACCOUNT ?? "/*__@appAccount__*/";

const propsTable = `
| Prop Name  | Type/Values  | Default Value  | Description |
|------------|--------------|----------------|-------------|
| ${"`title`"}      | string       | ${'`""`'}       | The title for the content. This is highly recommended, since it is used for accessibility labels in the Player. If you do not want to show the title visually, see [showTitle](https://docs.livepeer.org/reference/livepeer-js/Player#showtitle). |
| ${"`playbackId`"} | number/string | ${'`""`'}            | The ${`[playbackId](https://docs.livepeer.org/reference/livepeer-js/Player#playbackid-or-src)`} of the video. Can be a short playbackId for an Asset or Stream, a media source URL, or an IPFS CID. |
| ${"`PosterImage`"} | Function/ReactNode    | ${"`N/A`"}      | A custom component to render the poster image while video is not playing. |
| ${"`showPipButton`"}    | boolean       | ${'`true`'}    | Whether to show the picture-in-picture button. |
| ${"`objectFit`"}| string       | ${'`"cover"`'}           |  The object fit for the video. |
| ${"`priority`"} | boolean    | ${'`true`'}| Whether to prioritize the video. |
| ${"`...props`"} | any    | ${"`N/A`"} | Any other props will be passed to the underlying [Livepeer Video Player](https://docs.livepeer.org/reference/livepeer-js/Player). |
`;

const widgetCode = `
\`\`\`jsx
<Widget
  src={\"${ROOT_ACCOUNT}/widget/Livepeer.Player\"}
  props={{
    title: "Original Keyboard Cat!",
    playbackId: "8b3bdqjtdj4jsjwa",
    PosterImage: <img src="https://ipfs.near.social/ipfs/bafkreihfigi325t3s2ilgf6d3xjcz7eiyjuafoulbrhtti5sz5vdg7jgjq" alt={"Original Keyboard Cat!"} />
  }}
/>
\`\`\`
`;

return (
  <div className="d-flex flex-column gap-1 pb-4">
    <Widget
      src={"nearui.near/widget/Typography.Text"}
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
        src={`${ROOT_ACCOUNT}/widget/Livepeer.Player`}
        props={{
          title: "Original Keyboard Cat!",
          playbackId: "8b3bdqjtdj4jsjwa",
          PosterImage: <img src="https://ipfs.near.social/ipfs/bafkreihfigi325t3s2ilgf6d3xjcz7eiyjuafoulbrhtti5sz5vdg7jgjq" alt={"Original Keyboard Cat!"} />
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
