const Sidebar = styled.div`
  width: 250px;
  background-color: #f7f7f7;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 15px;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 10px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const setPath = props.setPath || (() => {});

return (
  <Sidebar>
    <Button onClick={() => setPath(`${context.accountId}`)}>Profile</Button>
    <Button onClick={() => setPath(`${context.accountId}/widget`)}>
      Widgets
    </Button>
    <Button onClick={() => setPath(`${context.accountId}/thing`)}>
      Things
    </Button>
    <Button onClick={() => setPath(`${context.accountId}/type`)}>Types</Button>
  </Sidebar>
);
