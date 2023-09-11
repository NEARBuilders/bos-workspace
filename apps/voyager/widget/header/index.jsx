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

const path = props.path || "";
const goBack = props.goBack || (() => {});
const goForward = props.goForward || (() => {});
const setLayout = props.setLayout || (() => {});

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
      <DropdownMenu.Root>
        <DropdownMenu.Trigger as={Button}>
          <i className="bi bi-three-dots-vertical"></i>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            onSelect={() => {
              console.log("hey 1")
            }}
          >
            Option 1
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => {
              console.log("hey 2")
            }}
          >
            Option 2
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => {
              console.log("hey 3")
            }}
          >
            Option 3
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </ButtonRow>
  </Header>
);