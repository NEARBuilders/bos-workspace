const ChildContainer = styled.div`
  display: flex;
  width: 100%;
`;

const SidePanel = styled.div`
  width: 30%;
  border-right: 1px solid black;
  padding: 10px;
`;

const DocumentPanel = styled.div`
  width: 70%;
`;

const DocumentContent = styled.div`
  width: 100%;
  height: 80vh;
`;

const DocumentHeader = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: flex-end;
`;

const DocumentItem = styled.div`
  cursor: pointer;
  padding: 5px;
  padding-left: ${(props) =>
    props.depth * 20}px; // Increase padding based on depth
  margin: 5px 0;
  border-radius: 5px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Button = styled.button``;

const { docs, onChange } = props;

// Get the path to the first document
const firstDocPath = [Object.keys(docs)[0]];

// Get the content of the first document
const firstDocContent = docs[firstDocPath[0]].content;

State.init({
  selectedDoc: firstDocPath,
  content: firstDocContent,
  view: "EDIT",
  count: Object.keys(docs).length + 1,
});
const renderDocs = (docs, path) => {
  if (!path) {
    path = [];
  }
  return Object.keys(docs).map((key) => {
    const currentPath = [...path, key];
    const children = docs[key].children;
    return (
      <Widget
        src="create.near/widget/item"
        props={{
          key,
          depth: path.length,
          handleDocumentClick: () => handleDocumentClick(currentPath),
          handleCreateDocument: () => handleCreateDocument(currentPath),
          handleDeleteDocument: () => handleDeleteDocument(currentPath),
          children: (
            <>
              {children && Object.keys(children).length > 0 ? (
                renderDocs(children, currentPath)
              ) : (
                <pre>empty</pre>
              )}
            </>
          ),
        }}
      />
    );
  });
};

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
  const doc = getDocFromPath(docs, path);
  State.update({
    selectedDoc: path,
    content: doc.content,
  });
};

const handleContentChange = (value) => {
  onChange(state.selectedDoc, { content: value });
  State.update({ content: value });
};

const handleCreateDocument = (parentPath) => {
  const newKey = `Doc${state.count}`;
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

function handleToggle() {
  const newView = state.view === "EDIT" ? "VIEW" : "EDIT";
  State.update({ view: newView });
}

function Content({ view }) {
  switch (view) {
    case "EDIT": {
      return (
        <div key={state.selectedDoc}>
          <Widget
            src="efiz.near/widget/SimpleMDE"
            props={{
              data: { content: state.content },
              onChange: handleContentChange,
              toolbar: [
                "heading",
                "bold",
                "italic",
                "quote",
                "code",
                "link",
                "unordered-list",
                "ordered-list",
                "checklist",
                "mention",
                "reference",
              ],
            }}
          />
        </div>
      );
    }
    case "VIEW": {
      return (
        <div key={state.selectedDoc}>
          <Widget
            src="openwebbuild.near/widget/Post.Markdown"
            props={{ text: state.content }}
          />
        </div>
      );
    }
  }
}

return (
  <ChildContainer>
    <SidePanel>
      <Button onClick={handleCreateDocument}>Create Top-Level Document</Button>
      {renderDocs(docs)}
    </SidePanel>
    <DocumentPanel>
      <DocumentHeader>
        <div>
          <Button onClick={handleToggle}>
            {state.view === "EDIT" ? "VIEW" : "EDIT"}
          </Button>
        </div>
      </DocumentHeader>
      <DocumentContent>
        <Content view={state.view} />
      </DocumentContent>
    </DocumentPanel>
  </ChildContainer>
);
