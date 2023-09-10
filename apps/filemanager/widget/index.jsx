// const { layout, provider, components } = props;

// function Component(key, props) {
//   const { src, blockHeight } = components[key];
//   return <Widget src={src} blockHeight={blockHeight} props={props} />;
// }

// return (
//   <Widget
//     src={layout.src}
//     blockHeight={layout.blockHeight}
//     props={{ Search: () => Component("Search", {}) }}
//   />
// );

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

State.init({
  accountId: context.accountId || "",
  selectedValue: {},
});

function setContent(key, value) {
  State.update({ selectedKey: key, selectedValue: value });
}

const FolderContainer = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ArrowIcon = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-top: 2px solid black;
  border-right: 2px solid black;
  transform: ${(props) =>
    props.isExpanded ? "rotate(135deg)" : "rotate(45deg)"};
  margin-right: 5px;
`;

// Styled components for eFile
const FileContainer = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileInfo = styled.span`
  display: flex;
  gap: 10px;
`;

function eFolder({ toggleExpand, isExpanded, key }) {
  return (
    <FolderContainer onClick={toggleExpand}>
      <ArrowIcon isExpanded={isExpanded} />
      {key}
    </FolderContainer>
  );
}

function eFile({ key, data, type, size }) {
  return (
    <FileContainer>
      <span>{key}</span>
      <FileInfo>
        <span>{type}</span>
        <span>{size}</span>
      </FileInfo>
    </FileContainer>
  );
}

return (
  <FileManagerContainer>
    <SidePanel>
      <Widget
        src="voyager.near/widget/sidebar.search"
        props={{ setAccount: (v) => State.update({ accountId: v }) }}
      />
      <Widget
        src="voyager.near/widget/sidebar.items"
        props={{ accountId: state.accountId, onSelect: setContent }}
      />
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
          src="voyager.near/widget/item"
          props={{ data: state.selectedValue, level: 0, eFolder, eFile }}
        />
      </Content>
    </MainContent>
  </FileManagerContainer>
);
