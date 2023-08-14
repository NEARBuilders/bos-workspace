/*__@import:QoL/classNames__*/

const folders = [
  {
    id: "1",
    name: "Folders",
    children: [
      {
        id: "a",
        name: "Inbox",
        icon: "inbox",
      },
      {
        id: "b",
        name: "Sent",
        icon: "send",
        active: true,
      },
    ],
  },
  {
    id: "2",
    name: "Labels",
    children: [
      {
        id: "c",
        name: "Work",
        icon: "briefcase",
      },
      {
        id: "d",
        name: "Family",
        icon: "people",
      },
      {
        id: "e",
        name: "Friends",
        icon: "person",
      },
    ],
  },
  {
    id: "3",
    name: "Filters",
    icon: "filter",
  },
];

State.init({
  folders,
});

const generateUUID = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const onCreateFolder = (new_name) => {
  console.log("clicked create folder");
  State.update({
    folders: [
      ...state.folders,
      {
        id: generateUUID(),
        name: new_name,
      },
    ],
  });
};

const onCreateFile = (folder_id, new_name) => {
  console.log("clicked create file");
  State.update({
    folders: state.folders.map((folder) => {
      if (folder.id === folder_id) {
        return {
          ...folder,
          children: [
            ...(folder.children || []),
            {
              name: new_name,
              id: generateUUID(),
            },
          ],
        };
      }
      return folder;
    }),
  });
};

const onOpen = (id) => {
  // remove active from all folders and files then set active to true for the clicked folder or file
  State.update({
    folders: state.folders.map((folder) => {
      if (folder.id === id) {
        return {
          ...folder,
          active: true,
          children: (folder.children || [])?.map((child) => ({
            ...child,
            active: false,
          })),
        };
      }
      return {
        ...folder,
        active: false,
        children: (folder.children || [])?.map((child) => ({
          ...child,
          active: id === child.id,
        })),
      };
    }),
  });
};

const onDelete = (id) => {
  State.update({
    folders: state.folders
      .filter((folder) => folder.id !== id)
      .map((folder) => {
        if (folder.children) {
          return {
            ...folder,
            children: folder.children.filter((child) => child.id !== id),
          };
        }
        return folder;
      }),
  });
};

const renderWithContextMenu = (id, renderTrigger) => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{renderTrigger()}</ContextMenu.Trigger>
      <ContextMenu.Content
        className="p-3 bg-white shadow rounded z-3"
        sideOffset={5}
        align="end"
      >
        <ContextMenu.Item
          onClick={() => {
            onDelete(id);
          }}
        >
          Delete
        </ContextMenu.Item>
        <ContextMenu.Item>Rename</ContextMenu.Item>
        <ContextMenu.Item>Move</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

const renderFolder = (folder) => {
  const { name, icon, children, id } = folder;
  return (
    <div className="folder" key={id}>
      {renderWithContextMenu(id, () => (
        <div
          className="folder__header"
          data-active={folder.active}
          role="button"
          tabIndex="0"
          title="Open folder"
          onClick={(e) => {
            if (e.target.id !== "create-file") onOpen(id);
          }}
        >
          <i
            className={classNames([
              "bi",
              "bi-" +
                (icon ??
                  (children && !!children.length ? "folder" : "file-earmark")),
            ])}
          ></i>
          <span>{name}</span>
          <i
            className="button bi bi-file-earmark-plus"
            id="create-file"
            onClick={() => {
              onCreateFile(id, "New file");
            }}
            role="button"
            tabIndex="0"
            title="New file"
          ></i>
        </div>
      ))}
      {children && !!children.length && (
        <div className="folder__children">
          {children.map((child) => (
            <div className="folder__child" key={child.id}>
              {renderWithContextMenu(child.id, () => (
                <div
                  className="folder__child__header"
                  data-active={child.active}
                  role="button"
                  tabIndex="0"
                  title="Open file"
                  onClick={() => {
                    onOpen(child.id);
                  }}
                >
                  <i
                    className={classNames([
                      "bi",
                      "bi-" + (child.icon || "file-earmark"),
                    ])}
                  ></i>
                  <span>{child.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Folders = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
  overflow: auto;

  .folder {
    padding: 0.2rem 0;
  }
  .folder__header,
  .folder__child__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.5rem 0.6rem;
    min-width: calc(100% - 1.5rem);
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1;
    border-radius: 10px;
    cursor: pointer;
    background-color: transparent;
    transition: background-color 0.2s ease-in-out;

    .bi {
      font-size: 16px;
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
      font-size: 1rem;
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
    gap: 1rem;
    position: relative;
    padding-left: 1.5rem;
    padding-top: 1rem;

    &::before {
      content: "";
      display: block;
      width: 2px;
      height: calc(100% - 1.5rem);
      background-color: #ccc;
      margin-left: 1.5rem;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .folder__child {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;
    height: 2rem;

    &::before {
      content: "";
      display: block;
      //   border-width: 2px 0px 0 2px;
      //   border-style: solid;
      //   border-color: rgb(255 0 0) transparent transparent;
      //   border-image: initial;
      //   border-radius: 53px 0px 0 0;
      //   width: 16px;
      //   height: 11px;
      //   transform: scaleY(-1);
      //   margin-left: -3px;
      //   margin-top: -3px;
      width: 20px;
      height: 20px;
      border-radius: 0 0 0 50%;
      margin-left: 2px;
      transform: translateY(-50%);
      box-shadow: -2px 2px 0 0 #ccc;
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

  .header__left {
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1;
  }
  .header__right {
    display: flex;
    gap: 1rem;
    align-items: center;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
    color: #000;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: #666;
    }
  }
`;

return (
  <div className="p-4">
    <Header>
      <div className="header__left">Folders</div>
      <div className="header__right">
        <i
          className="bi bi-folder-plus"
          role="button"
          onClick={() => {
            onCreateFolder("New folder");
          }}
          title="Create new folder"
          tabIndex="0"
        ></i>
      </div>
    </Header>
    <Folders>{state.folders.map(renderFolder)}</Folders>
  </div>
);
