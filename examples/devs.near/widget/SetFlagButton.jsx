const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 1rem;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

if (!props.setFlags) {
  return <pre>this component requires a setFlags function</pre>;
}

return (
  <Container>
    <Form>
      <InputGrid>
        <input
          className="form-control"
          placeholder="e.g. http://127.0.0.1:3030/, https://my-loader.ngrok.io"
          id="bosLoaderUrl"
          onChange={(e) => State.update({ url: e.target.value })}
        />
      </InputGrid>

      <button
        onClick={() => props.setFlags({ bosLoaderUrl: state.url })}
        style={{ marginLeft: "auto" }}
      >
        Save
      </button>
    </Form>
  </Container>
);
