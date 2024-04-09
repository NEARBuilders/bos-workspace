const { path, blockHeight, editorValue, setEditorValue, Children } = props;

let data = "";
if (path) {
  data = Social.get(path, blockHeight);

  if (!data) {
    return <p>Loading...</p>;
  }
}

function handleEditorChange(value) {
  setEditorValue(value);
}

return <Children value={data} onChange={handleEditorChange} path={path} />;
