const Header = styled.div`
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button``;

const Wrapper = styled.div`
  padding: 6px;
  min-width: 200px;
  width: 200px;
  border-radius: 6px;
  box-shadow: 0 3px 15px -3px rgba(13, 20, 33, 0.13);
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e8eb;
  background-color: #fff;
  gap: 1px;
  z-index: 2000;

  .menu__item {
    padding: 3px;
    display: flex;
    color: #000;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background-color: #eff2f5;
    }
  }
  .menu__item__icon {
    font-size: 14px;
    border-radius: 5px;
    box-shadow: 0 0 0 1px rgba(201, 201, 204, 0.48);
    background: #fff;
    color: #000;
    height: 26px;
    width: 26px;
    display: flex;
    margin-right: 10px;
    justify-content: center;
    align-items: center;
  }
`;

const path = props.path || "";
const goBack = props.goBack || (() => {});
const goForward = props.goForward || (() => {});
const setLayout = props.setLayout || (() => {});
const togglePreview = props.togglePreview || (() => {});

const { DropdownMenu } = VM.require("efiz.near/widget/Module.DropdownMenu");

DropdownMenu = DropdownMenu || (() => <></>);

return (
  <Header>
    <ButtonRow>
      <Button onClick={goBack}>
        <i className="bi bi-arrow-left"></i>
      </Button>
      <Button onClick={goForward}>
        <i className="bi bi-arrow-right"></i>
      </Button>
      <span>{path}</span>
    </ButtonRow>
    <ButtonRow>
      <Button onClick={() => setLayout("LIST")}>
        <i className="bi bi-list"></i>
      </Button>
      <Button onClick={() => setLayout("GRID")}>
        <i className="bi bi-grid-3x3-gap"></i>
      </Button>
      <Button onClick={() => setLayout("COLUMNS")}>
        <i className="bi bi-columns-gap"></i>
      </Button>
      <Button onClick={togglePreview}>
        <i className="bi bi-eye"></i>
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger as={Button}>
          <i className="bi bi-three-dots-vertical"></i>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <Wrapper>
            <DropdownMenu.Item
              className="menu__item"
              onSelect={() => {
                console.log("hey 1");
              }}
            >
              Option 1
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="menu__item"
              onSelect={() => {
                console.log("hey 2");
              }}
            >
              Option 2
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="menu__item"
              onSelect={() => {
                console.log("hey 3");
              }}
            >
              Option 3
            </DropdownMenu.Item>
          </Wrapper>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </ButtonRow>
  </Header>
);
