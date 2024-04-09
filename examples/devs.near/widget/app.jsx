const { Router } = VM.require("devs.near/widget/Router") || {
  Router: () => <></>,
};

const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => "/",
};

const Root = styled.div``;

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

const App = ({
  routes,
  Layout,
  basePath,
  page,
  defaultPage,
  debug,
  depth,
  env,
  routerParam,
  ...passProps
}) => {
  if (!page) page = Object.keys(routes)[0] || defaultPage;

  function navigate({ param, to }) {
    if (!param) param = routerParam ?? "page";
    if (to === "/") to = defaultPage;

    return href({
      widgetSrc: basePath,
      params: {
        [param]: to,
        env: env ?? undefined,
      },
    });
  }

  return (
    <Root key={basePath}>
      <Container>
        <Layout
          page={page}
          routes={routes}
          navigate={navigate}
          {...routerProps}
          {...props}
          Outlet={(p) => (
            <Router
              debug={debug}
              basePath={basePath}
              active={passProps[routerParam ?? "page"] ?? page}
              routes={routes}
              passProps={p}
              routerParam={routerParam}
              depth={depth ?? 1}
              PageNotFound={() => <p>404 Not Found</p>} // routes[404]
            />
          )}
        />
      </Container>
    </Root>
  );
};

return { App };
path");

if (
  draft === null ||
  viewMode === null ||
  defaultPreview === null ||
  defaultEditor === null ||
  defaultLanguage === null ||
  defaultType === null ||
  defaultPath === null
) {
  return "";
}

const [content, setContent] = useState(draft);
const [viewMode, setViewMode] = useState(defaultViewMode || "single"); // 'single' or 'split'
const [showPreview, setShowPreview] = useState(defaultPreview || false);
const [type, setType] = useState(defaultType || "");
const [editor, setEditor] = useState(defaultEditor || "");
const [language, setLanguage] = useState(defaultLanguage || "md");
const [path, setPath] = useState(defaultPath || "");

const handleToggleViewMode = () => {
  const newMode = viewMode === "single" ? "split" : "single";
  set("viewMode", newMode);
  setViewMode(newMode);
  set("preview", false);
  setShowPreview(false);
};

const handleTogglePreview = () => {
  set("preview", !showPreview);
  setShowPreview(!showPreview);
};

const editors = [
  {
    value: "",
    label: "default textarea",
  },
  {
    value: "devs.near/widget/markdown.SimpleMDE",
    label: "SimpleMDE",
  },
  {
    value: "devs.near/widget/markdown.MarkdownEditorIframe",
    label: "MarkdownEditorIframe",
  },
];

const languages = [
  {
    value: "md",
    label: "Markdown",
  },
  {
    value: "json",
    label: "JSON",
  },
];

const types = [
  {
    value: "document",
    label: "Document",
  },
];

const DefaultEditor = ({ value, onChange, onBlur }) => (
  <EditorTextarea
    placeholder="Start typing..."
    value={value}
    onChange={onChange}
    onBlur={onBlur}
  />
);

return (
  <PageContainer>
    <Header>
      <div>
        {viewMode === "single" && (
          <Button onClick={handleTogglePreview}>
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        )}
        <Button onClick={handleToggleViewMode}>Toggle View Mode</Button>
      </div>
      <div>
        <Widget
          src="nui.sking.near/widget/Layout.Modal"
          props={{
            open: state.saveModalOpen,
            onOpenChange: (open) => {
              State.update({
                ...state,
                saveModalOpen: open,
              });
            },
            toggle: (
              <Button className="classic" disabled={!content}>
                <>
                  <i className={"bi bi-save"} />
                  save
                </>
              </Button>
            ),
            content: (
              <div className="w-100">
                <ModalBox>
                  <Widget
                    src={"devs.near/widget/modal.create"}
                    props={{
                      creatorId: context.accountId,
                      path: path,
                      setPath: (v) => {
                        setPath(v);
                        set("path", v);
                      },
                      data: JSON.stringify({ body: content }),
                      closeModal: () => {
                        State.update({
                          ...state,
                          saveModalOpen: false,
                        });
                      },
                    }}
                  />
                </ModalBox>
              </div>
            ),
          }}
        />
        <Widget
          src="nui.sking.near/widget/Layout.Modal"
          props={{
            open: state.postModalOpen,
            onOpenChange: (open) => {
              State.update({
                ...state,
                postModalOpen: open,
              });
            },
            toggle: (
              <Button
                className="classic"
                disabled={!path}
              >
                <>
                  <i className={"bi bi-send"} />
                  post
                </>
              </Button>
            ),
            content: (
              <div className="w-100">
                <ModalBox>
                  <Widget
                    src={"devs.near/widget/modal.post"}
                    props={{
                      creatorId: context.accountId,
                      path: path,
                      type: type,
                      closeModal: () => {
                        State.update({
                          ...state,
                          postModalOpen: false,
                        });
                      },
                    }}
                  />
                </ModalBox>
              </div>
            ),
          }}
        />
      </div>
    </Header>
    <div>
      <Label>type:</Label>
      <Select
        onChange={(e) => {
          set("type", e.target.value);
          setType(e.target.value);
        }}
      >
        {types &&
          types.map((it) => (
            <Option value={it.value} selected={it.value === type}>
              {it.label}
            </Option>
          ))}
      </Select>
      <Label>editor:</Label>
      <Select
        onChange={(e) => {
          set("editor", e.target.value);
          setEditor(e.target.value);
        }}
      >
        {editors &&
          editors.map((it) => (
            <Option value={it.value} selected={it.value === editor}>
              {it.label}
            </Option>
          ))}
      </Select>
      <Label>language:</Label>
      <Select
        onChange={(e) => {
          set("language", e.target.value);
          setLanguage(e.target.value);
        }}
      >
        {languages &&
          languages.map((it) => (
            <Option value={it.value} selected={it.value === language}>
              {it.label}
            </Option>
          ))}
      </Select>
    </div>
    {viewMode === "single" ? (
      <EditorWrapper key={editor}>
        {showPreview ? (
          <MarkdownViewer value={content} />
        ) : (
          <>
            {editor ? (
              <Widget
                src={editor}
                props={{
                  value: { content },
                  onChange: (v) => {
                    setContent(v);
                    set(draftKey, v);
                  },
                }}
              />
            ) : (
              <DefaultEditor
                value={content}
                onBlur={() => {
                  let v;
                  if (language === "json") {
                    v = JSON.stringify(JSON.parse(content), null, 2);
                    if (v !== "null") {
                      setContent(v);
                      set(draftKey, v);
                    }
                  }
                }}
                onChange={(e) => {
                  let v = e.target.value;
                  setContent(v);
                  Storage.privateSet(draftKey, v);
                }}
              />
            )}
          </>
        )}
      </EditorWrapper>
    ) : (
      <div style={{ display: "flex", height: "100%" }}>
        <EditorWrapper>
          {editor ? (
            <Widget
              src={editor}
              props={{
                value: { content },
                onChange: (v) => {
                  setContent(v);
                  set(draftKey, v);
                },
              }}
            />
          ) : (
            <DefaultEditor
              value={content}
              onBlur={() => {
                let v;
                if (language === "json") {
                  v = JSON.stringify(JSON.parse(content), null, 2);
                  if (v !== "null") {
                    setContent(v);
                    set(draftKey, v);
                  }
                }
              }}
              onChange={(e) => {
                let v = e.target.value;
                setContent(v);
                Storage.privateSet(draftKey, v);
              }}
            />
          )}
        </EditorWrapper>
        <EditorWrapper>
          <MarkdownViewer value={content} />
        </EditorWrapper>
      </div>
    )}
  </PageContainer>
);
