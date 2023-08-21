const { docs, onChange } = props;

State.init({
  tab: "EDIT",
  count: Object.keys(docs).length + 1,
});

function init() {
  // When we first load, check if there is a selected document in state
  const docId = Storage.privateGet("selectedDoc");
  if (docId) {
    // If there is, then get the content for it
    const doc = Storage.privateGet(docId);
    State.update({
      selectedDoc: docId,
      content: doc.content,
      title: doc.title,
    });
  } else {
    // If there's not, then default to first doc
    const firstDocPath = [Object.keys(docs)[0]];
    const firstDocContent = docs[firstDocPath[0]].content;
    State.update({
      selectedDoc: firstDocPath,
      content: firstDocContent,
      title: firstDocPath.title,
    });
  }
}

init();

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
  // Set selected document in local storage
  Storage.privateSet("selectedDoc", path);
  // And check if there are any stored changes for it
  const doc = Storage.privateGet(path);
  if (doc) {
    State.update({
      selectedDoc: path,
      content: doc.content,
      title: doc.title,
    });
  } else {
    // Else, grab from default object
    const doc = getDocFromPath(docs, path);
    State.update({
      selectedDoc: path,
      content: doc.content,
      title: path[0],
    });
  }
};

let timeoutId;

const debounce = (func, delay) => {
  if (!delay) {
    delay = 300;
  }
  clearTimeout(timeoutId);
  timeoutId = setTimeout(func, delay);
};

const handleContentChange = (value) => {
  debounce(() => {
    try {
      Storage.privateSet(state.selectedDoc, {
        title: state.title,
        content: value,
      });
      State.update({ content: value });
      // onChange(state.selectedDoc, { content: value});
    } catch (error) {
      console.error("Error saving content: ", error);
    }
  });
};

const handleTitleChange = (value) => {
  debounce(() => {
    try {
      Storage.privateSet(state.selectedDoc, {
        title: value,
        content: state.content,
      });
      State.update({ title: value });
      // onChange(state.selectedDoc, { title: value});
    } catch (error) {
      console.error("Error saving title: ", error);
    }
  });
};

const handlePublish = () => {
  const thingId = "docs";
  Social.set({
    thing: { docs },
    index: {
      every: JSON.stringify({
        key: "efiz.near/type/docs",
        value: {
          id: thingId,
          type: "efiz.near/type/docs",
        },
      }),
    },
  });
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
  onChange(newPath, { title: "", content: "", children: {} });

  State.update({
    selectedDoc: newPath,
    title: "",
    content: "",
    count: state.count + 1,
  });
};

const handleDeleteDocument = (path) => {
  console.log("handleDeleteDocument", path);
  onChange(path, null);
  Storage.privateSet(path, null);

  // Check if the deleted document was the currently selected one
  if (JSON.stringify(path) === JSON.stringify(state.selectedDoc)) {
    const newSelectedDocPath = [Object.keys(docs)[0]];
    const newSelectedDocContent = docs[newSelectedDocPath[0]].content;

    Storage.privateSet("selectedDoc", newSelectedDocPath);

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

return (
  <div key={state.selectedDoc}>
    {widget("/*__@appAccount__*//widget/editor.ui", {
      handleCreateDocument,
      handleDeleteDocument,
      handleDocumentClick,
      handleContentChange,
      handleTitleChange,
      handleTabChange,
      handlePublish,
      docs,
      content: state.content,
      tab: state.tab,
      title: state.title,
    })}
  </div>
);
