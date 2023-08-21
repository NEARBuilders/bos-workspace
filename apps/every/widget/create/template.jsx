const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%;
`;

const Dropdown = styled.select`
  margin: 10px;
  padding: 10px;
`;

const RenderSelectedType = ({ selectedType }) => {
  const typeDef = JSON.parse(Social.get(selectedType) || "null");
  if (typeDef) {
    const params = typeDef.properties?.map((it) => it.name);

    return (
      <div style={{ width: "100%" }}>
        <Widget
          src="efiz.near/widget/MonacoEditor"
          props={{
            code: `function Template({ ${params.join(
              ", ",
            )} }) {\n // DO SOMETHING\n return <p>hello world</p>;\n }\nreturn { Template };\n`,
            language: "javascript",
          }}
        />
      </div>
    );
  } else {
    return <p>not a valid type</p>;
  }
};

const handleSelectChange = (event) => {
  State.update({ selectedType: event.target.value });
};

const types = Social.get(`efiz.near/type/**`, "final");
types = Object.keys(types)?.map((it) => `efiz.near/type/${it}`) || [];

return (
  <Container>
    <Dropdown onChange={handleSelectChange} value={state.selectedType}>
      <option value="">Select a type</option>
      {types?.map((it) => (
        <option value={it} key={it}>
          {it}
        </option>
      ))}
    </Dropdown>

    {state.selectedType && (
      <RenderSelectedType selectedType={state.selectedType} />
    )}
  </Container>
);
