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

function Header({ goBack, goForward, setLayout}) {
  return (
    <Widget
      src="voyager3.near/widget/header.index"
      props={{
        path,
        goBack,
        goForward,
        setLayout,
      }}
    />
  );
}

function Content({ layout, path }) {
  return (
    <Widget
      src="voyager3.near/widget/content.index"
      props={{
        layout: layout,
        path: path,
      }}
    />
  );
}

function Sidebar({ setPath, setHistory }) {
  return (
    <Widget
      src="voyager3.near/widget/sidebar.index"
      props={{
        setPath,
        setHistory,
      }}
    />
  );
}

return (
  <Widget
    src="voyager3.near/widget/provider"
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
