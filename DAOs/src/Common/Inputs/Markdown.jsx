const initialText = props.initialText ?? "# Hello World\n\n";
const height = props.height ?? "500px";

const code = `
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<script src="https://unpkg.com/react-markdown-editor-lite@1.3.4/lib/index.js" crossorigin></script>
<link rel="stylesheet" href="https://unpkg.com/react-markdown-editor-lite@1.3.4/lib/index.css" />


<div id="react-root"></div>

<script>
function TestReact(props) {
  const [value, setValue] = React.useState(props.initialText || "");
  return React.createElement(ReactMarkdownEditorLite.default, {
      value,
      view: { menu: true, md: true, html: false },
      canView: { menu: true, md: false, html: false, fullScreen: false, hideMenu: true },
      onChange: ({ text }) => {
        setValue(text);
        window.top.postMessage(text, "*");
      },
      renderHTML: () => {},
      className: "full",
    }); 
}

const domContainer = document.querySelector('#react-root');
const root = ReactDOM.createRoot(domContainer);

window.addEventListener("message", (event) => {
  root.render(React.createElement(TestReact, {
    initialText: event.data,
  }));
});

</script>
`;

return (
  <iframe
    className="w-100"
    style={{ 
        height: height,
     }}
    srcDoc={code}
    message={initialText}
    onMessage={props.onChange}
  />
);
