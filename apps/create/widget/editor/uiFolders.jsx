/*__@import:QoL/classNames__*/
/*__@import:QoL/Url__*/

// TODO: should be able to hide/show children elements

const { project: projectId, navigate } = props;

// This should be in editor.index but let it be here for now
const project = props.handle["project"].get(projectId) ?? {};
const flatFolders = props.handle["document"].getAll(projectId) ?? {};

// Also unflattenDocuments should be removed, it's just extra processing, the widget should be able to handle the flat structure
const folders = props.handle["utils"].unflattenDocuments(flatFolders);

const activeDoc = props.handle["document"].getSelected(projectId);
const { DOC_SEPARATOR } = props.handle["other"];

const isActive = (path) => path.join(DOC_SEPARATOR) === activeDoc;

const handler = (action, path) => {
  switch (action) {
    case "delete":
      props.handle["document"].delete(projectId, path.join(DOC_SEPARATOR));
      break;
    case "create":
      props.handle["document"].create(projectId, path.join(DOC_SEPARATOR));
      break;
    case "open":
      props.handle["document"].open(projectId, path.join(DOC_SEPARATOR));
      break;
    case "refresh":
      props.handle["project"].init(projectId, true);
      break;
    case "rename":
      // props.handleRenameDocument(path, "modal not implemented");
      break;
    case "move":
      // props.handleMoveDocument(path, "modal not implemented");
      break;
    default:
      break;
  }
};

const renderFolderHeader = (folder) => {
  const { title, path, icon, isFile, inBuffer } = folder;

  return (
    <div
      className={path.length > 1 ? "folder__child__header" : "folder__header"}
      data-active={isActive(path)}
      role="button"
      tabIndex="0"
      title="Open folder"
      onClick={(e) => {
        if (e.target.id !== "create-file") handler("open", path);
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
      {inBuffer && (
        <i
          className="bi bi-asterisk ms-1"
          title="unsaved changes"
          style={{ color: "red" }}
        ></i>
      )}
      <i
        className="button bi bi-file-earmark-plus"
        id="create-file"
        onClick={() => {
          handler("create", path);
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
  const {
    children,
    data: { title },
    _: { inBuffer },
  } = value;

  return (
    <div
      className={classNames([path.length > 1 ? "folder__child" : "folder"])}
      key={path}
    >
      <Widget src="/*__@appAccount__*//widget/editor.uiFoldersMenu" props={{
        path,
        handler,
        renderTrigger: () =>
          renderFolderHeader({
            title: title,
            path: path,
            isFile: !children || Object.keys(children).length === 0,
            inBuffer,
          }),
      }} />

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

const Project = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 2.4rem;
  padding: 12px;

  a {
    text-decoration: none;
    color: #000;
    transition: opacity 0.2s ease-in-out;

    &:hover {
      opacity: 0.9;
    }
  }

  img {
    max-width: 80px;
  }
`;

const renderProject = (project) => {
  const { title, logo } = project.metadata;
  return (
    <Project>
      <a
        target="_blank"
        href={Url.construct("#//*__@appAccount__*//widget/p", {
          id: projectId,
          by: context.accountId,
        })}
        className="d-flex align-items-center mb-4 justify-content-between gap-1"
      >
        {logo && <img src={logo} alt={title} height={40} />}
        <span className="h6 m-0 flex-fill ms-2">{title}</span>
        <i className="ms-1 bi bi-box-arrow-up-right"></i>
      </a>
      <div>
        <a
          title="Open project settings"
          onClick={() => {
            navigate("manage", { project: projectId });
          }}
          href={Url.construct("#//*__@appAccount__*//widget/home", {
            page: "manage",
            project: projectId,
          })}
        >
          <i className="bi bi-gear"></i>
          <span className="ms-1">Settings</span>
        </a>
      </div>
    </Project>
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
    user-select: none;
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
  grid-template-rows: auto auto;
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
              handler("create", []);
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

    <div>
      {/* TODO: The markdown editor doesn't refresh even if data is fresh */}
      <Widget
        src="/*__@replace:nui__*//widget/Input.Button"
        props={{
          children: "Refresh",
          onClick: () => {
            handler("refresh");
          },
        }}
      />
    </div>
  </Wrapper>
);
