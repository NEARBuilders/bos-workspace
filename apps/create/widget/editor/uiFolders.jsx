/*__@import:QoL/classNames__*/
/*__@import:QoL/widget__*/

// TODO: active document not showing
// TODO: should be able to hide/show children elements

const project = props.handle["project"].get(1) ?? {};
const folders = props.handle["document"].getAll(project.id) ?? {};

const handler = (action, path) => {
  switch (action) {
    case "delete":
      props.handle["document"].delete(project.id, path);
      break;
    case "rename":
      props.handleRenameDocument(path, "modal not implemented");
      break;
    case "move":
      props.handleMoveDocument(path, "modal not implemented");
      break;
    default:
      break;
  }
};

const renderFolderHeader = (folder) => {
  const { title, path, icon, isFile } = folder;

  return (
    <div
      className={path.length > 1 ? "folder__child__header" : "folder__header"}
      data-active={folder.active}
      role="button"
      tabIndex="0"
      title="Open folder"
      onClick={(e) => {
        if (e.target.id !== "create-file")
          props.handle["document"].open(project.id, path); 
      }}
    >
      <i
        className={classNames([
          "bi",
          "bi-" + (icon ?? (!isFile ? "folder" : "file-earmark")),
        ])}
      ></i>
      <span>
        {title === undefined || title === null || title === ""
          ? "Untitled"
          : title}
      </span>
      <i
        className="button bi bi-file-earmark-plus"
        id="create-file"
        onClick={() => {
          props.handle["document"].create(project.id, path);
        }}
        role="button"
        tabIndex="0"
        title="New file"
      ></i>
    </div>
  );
};

const renderFolder = (folder) => {
  const { path, value, index } = folder;
  const { children, title } = value;

  return (
    <div
      className={classNames([path.length > 1 ? "folder__child" : "folder"])}
      key={path}
    >
      {widget("/*__@appAccount__*//widget/editor.uiFoldersMenu", {
        path,
        handler,
        renderTrigger: () =>
          renderFolderHeader({
            title: props.handle["document"].get(project.id, path).title, // Hmmmm is there a better way to do this?
            path: path,
            isFile: !children || Object.keys(children).length === 0,
          }),
      })}

      {children && !!Object.keys(children).length && (
        <div className="folder__children">
          {Object.keys(children).map((k, i) => {
            return renderFolder({
              path: [...path, k],
              value: children[k],
              index: i,
            });
          })}
        </div>
      )}
    </div>
  );
};

const renderProject = (project) => {
  const { title, logo, id } = project;

  return (
    <div>
      <div className="mb-2">
        <a
          href={`/#//*__@appAccount__*//widget/home?page=projects`}
          className="text-decoration-none"
        >
          <i className="bi bi-arrow-left"></i>
          Back to projects
        </a>
      </div>
      <a
        href={`/#//*__@appAccount__*//widget/home?page=project&project=${id}`}
        className="d-flex justify-content-center gap-3 align-items-center mb-auto w-100"
        title="Open project settings"
      >
        {logo && <img src={logo} alt={title} height={55} width={55} />}
        <h5
          className="h6 m-0 flex-fill"
          style={{
            lineHeight: 1.5,
          }}
        >
          {title}
        </h5>
      </a>
    </div>
  );
};

const Folders = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 1rem 0;
  overflow: auto;

  .folder__header {
  }
  .folder__header,
  .folder__child__header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    min-width: calc(100% - 1.5rem);
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    border-radius: 10px;
    cursor: pointer;
    background-color: transparent;
    transition: background-color 0.2s ease-in-out;
    margin-left: -4px;

    .bi {
      font-size: 13px;
      transform: translateX(-50%);
    }

    &[data-active="true"] {
      background-color: #00ec9730 !important;
    }
    &:hover,
    &:active {
      background-color: #00ec9710;
    }

    .button {
      font-size: 14px;
      font-weight: 600;
      background-color: transparent;
      transition: all 0.2s ease-in-out;
      margin-left: auto;
      padding: 3px;
      border-radius: 6px;
      transform: translateX(50%);

      &:hover {
        background-color: #00000010;
      }
    }
  }
  .folder__children {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-left: 8px;
    padding-top: 8px;
    gap: 4px;

    &::before {
      content: "";
      display: block;
      width: 2px;
      height: calc(100% - 1.5rem);
      background-color: #ccc;
      margin-left: 8px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .folder__child {
    position: relative;
    padding-left: 14px;

    &::before {
      content: "";
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 0 0 0 50%;
      margin-left: 2px;
      box-shadow: -2px 2px 0 0 #ccc;
      position: absolute;
      left: 0;
    }
  }

  [data-radix-popper-content-wrapper] {
    z-index: 1 !important;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 9px;

  .header__right {
    display: flex;
    gap: 1rem;
    align-items: center;
    font-size: 1.15rem;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
    color: #000;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: #666;
    }
  }

  .header__subtitle {
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1;
    color: #666;
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 120px auto;
`;

return (
  <Wrapper className="py-4 ps-3 pe-1">
    {renderProject(project)}

    <div>
      <Header>
        <span className="header__subtitle">Documents</span>
        <div className="header__right">
          <i
            className="bi bi-file-earmark-plus"
            role="button"
            onClick={() => {
              props.handle["document"].create(project.id, path);
            }}
            title="Create new folder"
            tabIndex="0"
            style={{ fontSize: "16px" }}
          ></i>
        </div>
      </Header>
      <Folders>
        {folders &&
          Object.keys(folders).map((f, i) => {
            return renderFolder({
              path: [f],
              value: folders[f],
              index: i,
            });
          })}
      </Folders>
    </div>
  </Wrapper>
);
