const content = fetch(
  props.src ||
    "https://raw.githubusercontent.com/replicate/replicate-javascript/main/README.md",
);

if (content === null) return "";

return (
  <Widget
    src="/*__@appAccount__*//widget/render"
    props={{ content: content.body }}
  />
);
