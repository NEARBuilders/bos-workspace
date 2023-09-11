const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

function Header({ path, goBack, goForward, setLayout}) {
  return (
    <Widget
      src="/*__@appAccount__*//widget/header.index"
      props={{
        path,
        goBack,
        goForward,
        setLayout,
      }}
    />
  );
}

function Content({ layout, path, setPath }) {
  return (
    <Widget
      src="/*__@appAccount__*//widget/content.index"
      props={{
        layout: layout,
        path: path,
        setPath
      }}
    />
  );
}

function Sidebar({ setPath, setHistory }) {
  return (
    <Widget
      src="/*__@appAccount__*//widget/sidebar.index"
      props={{
        setPath,
        setHistory,
      }}
    />
  );
}

return (
  <Widget
    src="/*__@appAccount__*//widget/provider"
    props={{
      Children: (p) => (
        <Container>
          <Sidebar {...p} />
          <MainContent>
            <Header {...p} />
            <Content {...p} />
          </MainContent>
        </Container>
      ),
    }}
  />
);
