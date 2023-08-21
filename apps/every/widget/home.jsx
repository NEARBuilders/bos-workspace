const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px;
`;

const Button = styled.button`
  margin: 0 10px;
  padding: 10px 20px;
  cursor: pointer;
`;

const handleButtonClick = (type) => {
  State.update({ selected: type });
};

const RenderSelectedType = ({ selectedType }) => {
  switch (selectedType) {
    case "Thing": {
      return <Widget src="every.near/widget/create.thing" />;
    }
    case "Type": {
      return <Widget src="every.near/widget/create.type" />;
      break;
    }
    case "Plugin": {
      return <Widget src="every.near/widget/create.plugin" />;
      break;
    }
    case "Template": {
      return <Widget src="every.near/widget/create.template" />;
      break;
    }
  }
};

return (
  <Container>
    <div>Create</div>
    <ButtonRow>
      <Button onClick={() => handleButtonClick("Thing")}>Thing</Button>
      <Button onClick={() => handleButtonClick("Type")}>Type</Button>
      <Button onClick={() => handleButtonClick("Template")}>Template</Button>
      <Button onClick={() => handleButtonClick("Plugin")}>Plugin</Button>
    </ButtonRow>
    {state.selected && <RenderSelectedType selectedType={state.selected} />}
  </Container>
);
