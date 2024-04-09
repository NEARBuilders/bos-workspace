const Container = styled.div`
  padding: 20px;
  height: auto;
  overflow: auto;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Button = styled.button`
  background-color: #ed7d31;
  color: #f6f1ee;
  padding: 10px 20px;
  border: 2px solid #6c5f5b;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;

  &:hover {
    background-color: #6c5f5b;
    box-shadow: outset 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    background-color: #4f4a45;
    box-shadow: outset 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(2px);
  }
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  padding-bottom: 40px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ImageWrapper = styled.div`
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const Name = styled.div`
  flex: 1;
  align-self: center;
  font-size: 2em;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const { selectedItem } = props;

const [activeView, setActiveView] = useState("post");

function PostContent({ data }) {
  return (
    <div key={JSON.stringify(data)}>
      <Widget
        src="mob.near/widget/MainPage.N.Post.Page"
        props={{ accountId: data.accountId, blockHeight: data.blockHeight }}
        loading={<div style={{ height: "200px" }} />}
      />
    </div>
  );
}

if (!selectedItem) {
  return <></>;
}

return (
  <Container>
    <Header>
      <Logo>
        <ImageWrapper>
          <Image
            src={selectedItem.metadata.image.href}
            alt={selectedItem.metadata.name}
          />
        </ImageWrapper>
        <Name>{selectedItem.metadata.name}</Name>
      </Logo>
      <ButtonRow>
        <Button
          onClick={() => setActiveView("post")}
          className={activeView === "post" ? "active" : ""}
        >
          Post
        </Button>
        <Button
          onClick={() => setActiveView("demo")}
          className={activeView === "demo" ? "active" : ""}
        >
          Demo
        </Button>
        <Button
          onClick={() => setActiveView("data")}
          className={activeView === "data" ? "active" : ""}
        >
          Data
        </Button>
      </ButtonRow>
    </Header>
    <Content>
      {activeView === "post" && (
        <PostContent data={JSON.parse(selectedItem.data).post} />
      )}
      {activeView === "demo" && (
        <Widget src={JSON.parse(selectedItem.data).demo} />
      )}
      {activeView === "data" && (
        <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
      )}
    </Content>
  </Container>
);
