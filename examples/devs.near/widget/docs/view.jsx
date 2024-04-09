const content = fetch(
  `https://raw.githubusercontent.com/${
    props.path ??
    "near-everything/bos-workspace/teleport/docs/teleport/README.md"
  }`
);
if (content === null) return "";

return (
  <div className="container">
    <Widget
      src="openwebbuild.near/widget/Post.Markdown"
      props={{
        text: content.body,
      }}
    />
  </div>
);
