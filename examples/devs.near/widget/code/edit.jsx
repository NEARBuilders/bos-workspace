const { value, onChange, onSubmit, onCancel } = props;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  width: 100%;
  background-color: #f0f0f0;
`;

const EditorContainer = styled.div`
  flex-grow: 1;
  width: 100%;
`;

const Footer = styled.div`
  height: 120px;
  width: 100%;
  background-color: #f0f0f0;
`;

const defaultValue = value;
const language = "json";
const [path, setPath] = useState(props.path || "");

const [code, setCode] = useState(defaultValue);

useEffect(() => {
  onChange && onChange(code);
}, [code]);

return (
  <Container>
    <EditorContainer>
      <Widget
        src="devs.near/widget/MonacoEditor"
        props={{
          path: path, // this can be any string
          onChange: setCode, // this is a function that will be called when the code changes
          language, // javascript or json
          height: "70vh",
          defaultValue, // do not pass a state variable here.
        }}
      />
    </EditorContainer>
  </Container>
);
