

State.init({
  accountId: context.accountId || "",
  selectedValue: {}
});

function setContent(key, value) {
  State.update({ selectedKey: key, selectedValue: value });
}

const { Search, Items, Item } = props;

return (
  <FileManagerContainer>
    <SidePanel>
      <Search />
      <Items />
    </SidePanel>
    <MainContent>
      <Header>
        <div>{state.selectedKey}</div>
        <ButtonRow>
          <Button>delete</Button>
        </ButtonRow>
      </Header>
      <Content>
        <Widget
          src="/*__@appAccount__*//widget/item"
          props={{ data: state.selectedValue, level: 0 }}
        />
      </Content>
    </MainContent>
  </FileManagerContainer>
);
