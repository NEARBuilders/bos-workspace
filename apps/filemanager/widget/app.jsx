const FileManagerContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const SidePanel = styled.div`
  width: 250px;
  background-color: #f7f7f7;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
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

return <Widget src="voyager.near/widget/provider" props={{
  layout: {
    src: "voyager.near/widget/layout",
    blockHeight: "final",
    components: {
      FileManagerContainer: FileManagerContainer,
      SidePanel: SidePanel,
      MainContent: MainContent,
      Header: Header,
      ButtonRow: ButtonRow,
      Content: Content,
      Button: Button
    }
  },
  providers: {
    Search: {
      src: "voyager.near/widget/sidebar.search",
      blockHeight: "final"
    },
    Items: {
      src: "voyager.near/widget/sidebar.items",
      blockHeight: "final"
    }
  }
}} />;
