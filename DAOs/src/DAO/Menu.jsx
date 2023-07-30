const tabs = props.tabs || [
  {
    value: "tab1",
    label: "data",
    selected: true,
    components: <>data content</>,
  },
  { value: "tab2", label: "time", components: <>time content</> },
];

State.init({
  selectedTab: tabs.find((t) => t.selected).value || tabs[0].value,
});

const tabSelect = (selectedTab) => {
  return () => {
    State.update({ selectedTab });
  };
};
const TabsContainer = styled.div``;
const Content = styled.div``;
const TabButton = styled.button`
    background: ${(props) =>
      props.selected ? "#C2EAFC" : "transparent"} !important;
    border: none; 
    border-radius: 4px;
    margin: 10px 10px;
    &:hover {
      background:rgba(255, 213, 13, 0.5);
    }
`;

let tabList = [];

tabs.forEach((tab) => {
  tabList.push(
    <TabButton
      onClick={tabSelect(tab.value)}
      selected={tab.value === state.selectedTab}
    >
      {tab.label}
    </TabButton>
  );
});

return (
  <TabsContainer>
    <div>{tabList}</div>
    <div className="m-2">
      DAO Stats{" "}
      <Widget
        src="miraclx.near/widget/Attribution"
        props={{
          dep: true,
          authors: ["frichard2.near"],
        }}
      />
    </div>
    <Content>
      {tabs.find((t) => t.value === state.selectedTab).components}
    </Content>
  </TabsContainer>
);
