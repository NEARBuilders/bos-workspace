const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const Dropdown = styled.select`
  margin: 10px;
  padding: 10px;
`;

const RenderSelectedType = ({ selectedType }) => {
  return (
    <>
      <p>{selectedType}</p>
      <Widget
        src="efiz.near/widget/MonacoEditor"
        props={{ code: {}, language: "javascript" }}
      />
    </>
  );
};

const handleSelectChange = (event) => {
  State.update({ selectedType: event.target.value });
};

return (
  <Container>
    <Dropdown onChange={handleSelectChange} value={state.selectedType}>
      <option value="" disabled>
        Select a Type
      </option>
      <option value="Thing">Thing</option>
      <option value="Type">Type</option>
      <option value="Template">Template</option>
      <option value="Plugin">Plugin</option>
    </Dropdown>

    {state.selectedType && <RenderSelectedType selectedType={state.selectedType} />}
  </Container>
);
