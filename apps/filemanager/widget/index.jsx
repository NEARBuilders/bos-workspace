const FileManagerContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const SidePanel = styled.div`
  width: 250px;
  background-color: #f7f7f7;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
`;

const Button = styled.button`
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

State.init({
  accountId: context.accountId || "",
  selectedValue: {},
});

function setContent(key, value) {
  State.update({ selectedKey: key, selectedValue: value });
}

const FolderContainer = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ArrowIcon = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-top: 2px solid black;
  border-right: 2px solid black;
  transform: ${(props) =>
    props.isExpanded ? "rotate(135deg)" : "rotate(45deg)"};
  margin-right: 5px;
`;

// Styled components for eFile
const FileContainer = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileInfo = styled.span`
  display: flex;
  gap: 10px;
`;

function Menu({ handler, passProps, Item }) {
  return (
    <Widget
      src="/*__@appAccount__*//widget/item.menu"
      props={{
        passProps,
        handler,
        Item,
      }}
      loading={<></>}
    />
  );
}

function deleteFile(path) {
  function buildObjectWithLastNull(path) {
    const pathComponents = path.split("/").slice(1); // Remove the first part of the path
    let currentObj = {};
    let pointer = currentObj;

    pathComponents.forEach((component, i) => {
      if (i === pathComponents.length - 1) {
        pointer[component] = null;
      } else {
        pointer[component] = {};
        pointer = pointer[component];
      }
    });

    return currentObj;
  }

  const result = buildObjectWithLastNull(path);
  Social.set(result);
}

function deleteFolder(path, data) {
  function setLeavesToNull(obj) {
    const newObj = {};

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        newObj[key] = setLeavesToNull(obj[key]);
      } else {
        newObj[key] = null;
      }
    });

    return newObj;
  }

  function buildObjectWithPath(path, data) {
    const pathComponents = path.split("/").slice(1); // Remove the first part of the path
    let currentObj = {};
    let pointer = currentObj;

    pathComponents.forEach((component, i) => {
      if (i === pathComponents.length - 1) {
        pointer[component] = setLeavesToNull(data);
      } else {
        pointer[component] = {};
        pointer = pointer[component];
      }
    });

    return currentObj;
  }

  const newData = buildObjectWithPath(path, data);
  Social.set(newData);
}

function eFolder({ toggleExpand, isExpanded, key, path, data }) {
  return (
    <Menu
      passProps={{ delete: { path, data } }}
      handler={{
        delete: ({ path, data }) => {
          deleteFolder(path, data);
        },
      }}
      Item={() => (
        <FolderContainer
          onClick={toggleExpand}
          onDoubleClick={() => console.log("double click")} // open folder
        >
          <ArrowIcon isExpanded={isExpanded} />
          {key}
          {path}
        </FolderContainer>
      )}
    />
  );
}

function eFile({ key, path, data }) {
  return (
    <Menu
      passProps={{ delete: { path, data } }}
      handler={{
        delete: ({ path }) => {
          deleteFile(path);
        },
      }}
      Item={() => (
        <FileContainer
          onDoubleClick={() => console.log("double click")} // open file
        >
          <span>{key}</span>
          <FileInfo>
            <span>{path}</span>
          </FileInfo>
        </FileContainer>
      )}
    />
  );
}

return (
  <FileManagerContainer>
    <SidePanel>
      <Widget
        src="/*__@appAccount__*//widget/sidebar.search"
        props={{ setAccount: (v) => State.update({ accountId: v }) }}
      />
      <Widget
        src="/*__@appAccount__*//widget/sidebar.items"
        props={{ accountId: state.accountId, onSelect: setContent }}
      />
    </SidePanel>
    <MainContent>
      <Header>
        <div>{state.selectedKey}</div>
        <ButtonRow>
          <Button>create</Button>
        </ButtonRow>
      </Header>
      <Content>
        <Widget
          src="/*__@appAccount__*//widget/item"
          props={{
            data: state.selectedValue,
            level: 0,
            path: [state.accountId, state.selectedKey],
            eFolder,
            eFile,
          }}
        />
      </Content>
    </MainContent>
  </FileManagerContainer>
);
