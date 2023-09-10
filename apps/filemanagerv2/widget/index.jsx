// I want this to be the main entry point for the widget
// you should be able to configure everything from this file
// so if you wanna fork this widget, you can just change this file
const Container = styled.div`
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

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
`;

return (
  <Widget
    src="voyager2.near/widget/layout"
    blockHeight="final"
    props={{
      Container,
      SidePanel: () => (
        <SidePanel>
          <Widget
            src="voyager2.near/widget/sidebar.provider"
            blockHeight="final"
            props={{
              Layout: {
                src: "voyager2.near/widget/sidebar.layout",
                blockHeight: "final",
              },
              Components: {
                Item: {
                  src: "voyager2.near/widget/sidebar.item",
                  blockHeight: "final",
                },
              },
            }}
          />
        </SidePanel>
      ),
      MainContent,
      Header,
      Content,
    }}
  />
);
