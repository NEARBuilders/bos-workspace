const Content = styled.div`
  flex: 1;
  margin: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  width: 97.5%;
  overflow: auto;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  background-color: #fff;
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

function flattenObject(obj, parentKey) {
  parentKey = parentKey ?? "";
  let paths = [];

  Object.keys(obj).forEach((key) => {
    const currentPath = parentKey ? `${parentKey}/${key}` : key;

    if (typeof obj[key] === "object") {
      paths = paths.concat(flattenObject(obj[key], currentPath));
    } else if (obj[key] === true) {
      paths.push(currentPath);
    }
  });

  return paths;
}

const layout = props.layout || "LIST";
const setPath = props.setPath || (() => {});
const path = props.path || props.src || "create.near/widget/GitBos";

let data;
const parts = path.split("/");
if (parts.length > 2) {
  parts.pop();
  parts.push("*");
  const newPath = parts.join("/");
  const keys = Social.keys(newPath, "final");
  const flattenedKeys = flattenObject(keys);
  const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = `^${escapedPath}(\\..+)?$`;
  const matchingKeys = flattenedKeys.filter((it) => it.match(regex));
  let rawData = Social.getr(matchingKeys, "final");

  function removeFirstTwoLevels(obj) {
    let result = {};

    Object.keys(obj).forEach((firstLevelKey) => {
      let firstLevelObj = obj[firstLevelKey];
      if (typeof firstLevelObj === "object" && firstLevelObj !== null) {
        Object.keys(firstLevelObj).forEach((secondLevelKey) => {
          let secondLevelObj = firstLevelObj[secondLevelKey];
          if (typeof secondLevelObj === "object" && secondLevelObj !== null) {
            result = { ...result, ...secondLevelObj };
          }
        });
      }
    });

    return result;
  }

  data = removeFirstTwoLevels(rawData);
} else {
  data = Social.getr(path, "final");
}

const showPreview = props.showPreview || false;
const setSelectedPath = props.setSelectedPath || (() => {});
const selectedPath = props.selectedPath || "";

console.log(selectedPath);

if (!data) {
  return "Loading...";
}

State.init({
  activePath: [],
  selectedPath: "",
});

function setActivePath(v) {
  State.update({ activePath: v });
}

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

const ItemContainer = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
`;

const ItemInfo = styled.span`
  display: flex;
  gap: 10px;
  width: 200px;
  justify-content: space-between;
`;

const ItemDetails = styled.span`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const IconDiv = styled.div`
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 5em;
  height: 5em;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
    background-color: #f0f0f0;
  }
`;

const { ContextMenu } = VM.require("efiz.near/widget/Module.ContextMenu");

ContextMenu = ContextMenu || (() => <></>);

function deleteFile(path) {
  function buildObjectWithLastNull(path) {
    const parts = path.split("/").slice(1);
    let currentObj = {};
    let pointer = currentObj;

    parts.forEach((component, i) => {
      if (i === parts.length - 1) {
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
    Object.keys(obj).forEach((key) => {
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
    const value = parts.reduce(
      (current, part) => (current && current[part] ? current[part] : undefined),
      data
    );
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

function calculateSize(data) {
  const str = typeof data === "object" ? JSON.stringify(data) : data;
  let sizeInBytes = 0;

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode <= 0x7f) {
      sizeInBytes += 1;
    } else if (charCode <= 0x7ff) {
      sizeInBytes += 2;
    } else if (charCode <= 0xffff) {
      sizeInBytes += 3;
    } else {
      sizeInBytes += 4;
    }
  }

  if (sizeInBytes < 1024) {
    return sizeInBytes + " Bytes";
  } else if (sizeInBytes < 1024 * 1024) {
    return (sizeInBytes / 1024).toFixed(2) + " KB";
  } else {
    return (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
  }
}

function determineType(path, data) {
  const parts = path.split("/");
  if (parts.length === 1) {
    return "account";
  } else {
    const v = parts[1];
    return v;
  }
}

const iconMap = {
  nametag: "bi bi-person-badge",
  profile: "bi bi-person-circle",
  index: "bi bi-list-ol",
  graph: "bi bi-graph-up",
  widget: "bi bi-layout-text-sidebar-reverse",
  post: "bi bi-file-post",
  thing: "bi bi-box",
  type: "bi bi-type",
  settings: "bi bi-gear",
};

const handleColumnClick = (key) => {
  setActivePath([...state.activePath, key]);
};

const things = Object.keys(data); //this

if (!things) {
  return "Loading...";
}

function organizeData(data) {
  const result = {};

  data.forEach((path) => {
    if (path.includes(".")) {
      const parts = path.split(".");
      let current = result;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = path;
        } else {
          if (!current[part] || typeof current[part] === "string") {
            current[part] = {};
          }
          current = current[part];
        }
      });
    } else {
      if (!result[path]) {
        result[path] = {};
      }
      result[path][path] = path;
    }
  });

  return result;
}

const organizedData = organizeData(things);
// return <p>{JSON.stringify(organizedData)}</p>;

function RenderData({ data, layout }) {
  switch (layout) {
    case "LIST":
      const dataList =
        state.activePath.length === 0 ? data : getNestedData(data, activePath);

      return (
        <>
          {Object.keys(dataList).map(
            (
              key // this
            ) => (
              <div key={key}>
                <Widget
                  src="create.near/widget/repository.file"
                  loading={<></>}
                  props={{
                    path: key,
                    data: dataList[key],
                    level: 0,
                    eFile: ({ key, data, level }) => {
                      const updatedPath = [path, key].join("/");
                      return (
                        <ContextMenu
                          Item={() => (
                            // TODO: Honestly, eFile and eFolder should be the same component.
                            <ItemContainer
                              onDoubleClick={() => setPath(updatedPath)} // open file
                              onClick={() => setSelectedPath(updatedPath)}
                              style={{
                                marginLeft: level * 20,
                                backgroundColor:
                                  selectedPath === updatedPath
                                    ? "#f0f0f0"
                                    : "transparent",
                              }}
                            >
                              <ItemDetails>
                                <i className="bi bi-file-earmark"></i>
                                <span>{key.split(".").pop()}</span>{" "}
                              </ItemDetails>
                              <ItemInfo>
                                <span>{calculateSize(data)}</span>
                                <span>{determineType(updatedPath, data)}</span>
                                <span />
                              </ItemInfo>
                            </ItemContainer>
                          )}
                          passProps={{
                            delete: { path: updatedPath, data },
                          }}
                          handlers={{
                            delete: ({ path }) => {
                              deleteFile(path);
                            },
                          }}
                          items={{
                            delete: () => (
                              <>
                                <i className="menu__item__icon bi bi-x-lg" />
                                Delete
                              </>
                            ),
                          }}
                        />
                      );
                    },
                    eFolder: ({ toggleExpand, isExpanded, key, level }) => {
                      const updatedPath = [path, key].join("/");
                      return (
                        <ContextMenu
                          Item={() => (
                            <ItemContainer
                              onDoubleClick={() => setPath(updatedPath)} // open folder
                              onClick={() => {
                                toggleExpand();
                              }}
                              style={{
                                marginLeft: level * 20,
                              }}
                            >
                              <ItemDetails>
                                <ArrowIcon isExpanded={isExpanded} />
                                <i className="bi bi-folder"></i>
                                <span>{key.split("/").pop()}</span>{" "}
                              </ItemDetails>
                              <ItemInfo>
                                <span>--</span>
                                <span>Folder</span>
                                <span />
                              </ItemInfo>
                            </ItemContainer>
                          )}
                          passProps={{
                            delete: { path: updatedPath, data },
                          }}
                          handlers={{
                            delete: ({ path, data }) => {
                              // TODO: This is broken, I think because of the adjusted data object.
                              deleteFolder(path, data);
                            },
                          }}
                          items={{
                            delete: () => (
                              <>
                                <i className="menu__item__icon bi bi-x-lg" />
                                Delete
                              </>
                            ),
                          }}
                        />
                      );
                    },
                  }}
                />
              </div>
            )
          )}
        </>
      );

    case "GRID":
      return (
        <Grid>
          {Object.keys(data).map((key) => {
            const updatedPath = [path, key].join("/");
            return (
              <GridItem key={key}>
                <ContextMenu
                  Item={() => (
                    <IconDiv onClick={() => setPath(updatedPath)}>
                      <i className={`${iconMap[key] || "bi bi-file"}`} />
                      {key}
                    </IconDiv>
                  )}
                  passProps={{
                    delete: { path: updatedPath },
                  }}
                  handlers={{
                    delete: ({ path }) => {
                      deleteFile(path);
                    },
                  }}
                  items={{
                    delete: () => (
                      <>
                        <i className="menu__item__icon bi bi-x-lg" />
                        Delete
                      </>
                    ),
                  }}
                />
              </GridItem>
            );
          })}
        </Grid>
      );

    case "COLUMNS":
      return (
        <p>TBD</p>
        // <Columns>
        //   {state.activePath.map((pathKey, idx) => (
        //     <Column key={idx}>
        //       {Object.keys(
        //         getNestedData(data, state.activePath.slice(0, idx + 1))
        //       ).map((key) => (
        //         <div key={key} onClick={() => handleColumnClick(key)}>
        //           {key}
        //         </div>
        //       ))}
        //     </Column>
        //   ))}
        // </Columns>
      );

    default:
      return null;
  }
}

const [expandedFolder, setExpandedFolder] = useState(null);

function toggleFolder(key) {
  if (expandedFolder === key) {
    setExpandedFolder(null);
  } else {
    setExpandedFolder(key);
  }
}

return (
  <Content>
    <RenderData layout={layout} data={organizedData} />
  </Content>
);
