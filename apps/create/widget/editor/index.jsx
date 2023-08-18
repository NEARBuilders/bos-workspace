const { docs, onChange } = props;

// Get the path to the first document
const firstDocPath = [Object.keys(docs)[0]];

// Get the content of the first document
const firstDocContent = docs[firstDocPath[0]].content;

State.init({
  selectedDoc: firstDocPath,
  content: firstDocContent,
  tab: "EDIT",
  count: Object.keys(docs).length + 1,
});

const getDocFromPath = (docs, path) => {
  return path.reduce((currentDoc, key, index) => {
    // If it's the last key in the path, return the document itself
    if (index === path.length - 1) {
      return currentDoc[key];
    }
    // Otherwise, navigate to the children of the current document
    return currentDoc[key].children;
  }, docs);
};

const handleDocumentClick = (path) => {
  console.log("handleDocumentClick", path);

  const doc = getDocFromPath(docs, path);
  State.update({
    selectedDoc: path,
    content: doc.content,
  });
};

const handleContentChange = (value) => {
  console.log("handleContentChange", value);
  onChange(state.selectedDoc, { content: value });

  // TODO: should save the content to local storage as Draft
  State.update({ content: value });
};

const handleTitleChange = (value) => {
  console.log("TODO: handleTitleChange", value);
  // TODO: need to be implemented
};

const handlePublish = () => {
  console.log("TODO: handlePublish");

  // TODO: need to be implemented
};

const handleRenameDocument = (path, value) => {
  console.log("TODO: handleRenameDocument", path, value);

  // TODO: need to be implemented
};

const handleMoveDocument = (from, to) => {
  console.log("TODO: handleMoveDocument", from, to);

  // TODO: need to be implemented
};

const handleCreateDocument = (parentPath) => {
  const newKey = `Doc${state.count}`;
  console.log("handleCreateDocument", parentPath, newKey);
  let newPath; // This will store the path to the newly created document

  if (parentPath && parentPath.length) {
    newPath = [...parentPath, newKey];
  } else {
    newPath = [newKey];
  }
  // Notify the parent about the addition of the new document
  onChange(newPath, { content: "", children: {} });

  State.update({
    selectedDoc: newPath,
    content: "",
    count: state.count + 1,
  });
};

const handleDeleteDocument = (path) => {
  console.log("handleDeleteDocument", path);
  onChange(path, null);

  // Check if the deleted document was the currently selected one
  if (JSON.stringify(path) === JSON.stringify(state.selectedDoc)) {
    const newSelectedDocPath = [Object.keys(docs)[0]];
    const newSelectedDocContent = docs[newSelectedDocPath[0]].content;

    State.update({
      selectedDoc: newSelectedDocPath,
      content: newSelectedDocContent,
    });
  }
};

function handleTabChange(newTab) {
  State.update({ tab: newTab });
}

/*__@import:QoL/widget__*/

return widget("/*__@appAccount__*//widget/editor.ui", {
  handleCreateDocument,
  handleDeleteDocument,
  handleDocumentClick,
  handleContentChange,
  handleTitleChange,
  handleTabChange,
  handlePublish,
  handleRenameDocument,
  handleMoveDocument,
  docs,
  content: state.content,
  tab: state.tab,
  title: state.selectedDoc[0],
});
