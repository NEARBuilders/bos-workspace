const path = props.path;
const defaultValue = props.defaultValue || "";
const language = props.language || "javascript";
const onChange = props.onChange || (() => {});

const height = props.height || "100vh";

const Container = styled.div`
  height: ${height};
  width: 100%;
`;

return (
  <Container>
    <MonacoEditor
      path={path}
      language={language}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  </Container>
);
