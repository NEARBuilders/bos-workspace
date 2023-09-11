const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
  width: 100%;
  overflow: auto;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (min-width: 600px) {
    gap: 20px;
  }
`;

const GridItem = styled.div`
  flex: 1 0 calc(33.333% - 10px); // Three per row by default

  @media (min-width: 600px) {
    flex: 1 0 calc(25% - 20px); // Four per row on wider screens
  }
`;

const Columns = styled.div`
  display: flex;
`;

const Column = styled.div`
  min-width: 200px;
  border-right: 1px solid #e0e0e0;
`;

const layout = props.layout || "LIST";
const setPath = props.setPath || (() => {});
const path = props.path || context.accountId;
const data = Social.getr(path, "final");

if (!data) return <p>Loading...</p>;

State.init({
  activePath: [],
});

function setActivePath(v) {
  State.update({ activePath: v });
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

const { ContextMenu } = VM.require("efiz.near/widget/Module.ContextMenu");

ContextMenu = ContextMenu || (() => <></>);


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
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        obj[key] = setLeavesToNull(obj[key]);
      } else {
        obj[key] = null;
      }
    });
    return obj;
  }

  function buildObjectWithPath(path, data) {
    const parts = path.split("/").slice(1);
    const value = parts.reduce((current, part) => (current && current[part] ? current[part] : undefined), data);
    let currentObj = {};
    let pointer = currentObj;

    parts.forEach((component, i) => {
      if (i === parts.length - 1) {
        pointer[component] = setLeavesToNull(value);
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

function RenderData({ data, layout }) {
  const handleColumnClick = (key) => {
    setActivePath([...state.activePath, key]);
  };

  switch (layout) {
    case "LIST":
      const dataList =
        state.activePath.length === 0 ? data : getNestedData(data, activePath);
        
      return (
        <>
          {Object.keys(dataList).map((key) => (
            <div key={key}>
              <Widget
                src="/*__@appAccount__*//widget/item"
                props={{
                  path: key,
                  data: dataList[key],
                  eFile: ({ key, data }) => (
                    <ContextMenu
                      Item={() => (
                        <FileContainer
                          onDoubleClick={() => setPath([path, key].join("/"))} // open folder
                        >
                          <span>{key}</span>
                          <FileInfo>
                            <span>{path}</span>
                          </FileInfo>
                        </FileContainer>
                      )}
                      passProps={{ delete: { path: [path, key].join("/"), data } }}
                      handlers={{
                        delete: ({ path }) => {
                          deleteFile(path);
                        },
                      }}
                    />
                  ),
                  eFolder: ({ toggleExpand, isExpanded, key }) => (
                    <ContextMenu
                      Item={() => (
                        <FolderContainer
                          onClick={toggleExpand}
                          onDoubleClick={() => setPath([path, key].join("/"))} // open folder
                        >
                          <ArrowIcon isExpanded={isExpanded} />
                          {key}
                          {path}
                        </FolderContainer>
                      )}
                      passProps={{ delete: { path: [path, key].join("/"), data } }}
                      handlers={{
                        delete: ({ path, data }) => {
                          // TODO: This is broken, I think because of the adjusted data object. 
                          deleteFolder(path, data);
                        },
                      }}
                    />
                  ),
                }}
              />
            </div>
          ))}
        </>
      );

    case "GRID":
      return (
        <Grid>
          {Object.keys(data).map((key) => (
            <GridItem key={key}>{key}</GridItem>
          ))}
        </Grid>
      );

    case "COLUMNS":
      return (
        <Columns>
          {state.activePath.map((pathKey, idx) => (
            <Column key={idx}>
              {Object.keys(
                getNestedData(data, state.activePath.slice(0, idx + 1))
              ).map((key) => (
                <div key={key} onClick={() => handleColumnClick(key)}>
                  {key}
                </div>
              ))}
            </Column>
          ))}
        </Columns>
      );

    default:
      return null;
  }
}

function getNestedData(data, pathArray) {
  return pathArray.reduce((currentData, key) => currentData[key] || {}, data);
}
return (
  <Content>
    <RenderData layout={layout} data={data} />
  </Content>
);
