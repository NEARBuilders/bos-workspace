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

const Button = styled.button`
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

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
      {/* Bootstrap Dropdown */}
      <div className="dropdown show">
        <Button
          className="dropdown-toggle"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i className="bi bi-three-dots-vertical"></i>
        </Button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="#">
            Option 1
          </a>
          <a className="dropdown-item" href="#">
            Option 2
          </a>
          <a className="dropdown-item" href="#">
            Option 3
          </a>
        </div>
      </div>
    </ButtonRow>
  </Header>
);
