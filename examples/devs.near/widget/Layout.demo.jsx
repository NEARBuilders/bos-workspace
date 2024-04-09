const { Template } = VM.require("devs.near/widget/Template") || (() => <></>);

const variants = ["standard", "split", "sidebar"];

const [count, setCount] = useState(0);
const [selectedLayout, setSelectedLayout] = useState("standard");

const Container = styled.div`
  display: "flex";
  flex-direction: "column";
  justify-content: "space-between";
  align-items: "center";
  height: "100%";
`;

const Block = styled.div`
  flex: 1;
  border: "1px solid #ccc";
  background-color: "#f0f0f0";
  padding: "10px";
  text-align: "center";

  display: "flex";
  flex-direction: "column";
  justify-content: "space-between";
  align-items: "center";
  height: "100%";
`;

return (
  <>
    <select
      value={selectedLayout}
      onChange={(e) => setSelectedLayout(e.target.value)}
    >
      {variants.map((variant) => (
        <option key={variant} value={variant}>
          {variant}
        </option>
      ))}
    </select>
    <Template
      layout={{
        src: "devs.near/widget/Layout",
        initialProps: {
          variant: selectedLayout,
        },
      }}
      blocks={{
        Header: () => (
          <Block style={{ backgroundColor: "#AEC6CF" }}>
            Header{" "}
            <button className="" onClick={() => setCount(count + 1)}>{count} + 1</button>
          </Block>
        ),
        Footer: () => (
          <Block style={{ backgroundColor: "#F4CCCC" }}>
            Footer{" "}
            <button className="" onClick={() => setCount(count + 3)}>{count} + 3</button>
          </Block>
        ),
        Left: ({ children }) => (
          <Block style={{ backgroundColor: "#B6D7A8" }}>Left {children}</Block>
        ),
        Right: ({ children }) => (
          <Block style={{ backgroundColor: "#FFE599" }}>Right {children}</Block>
        ),
        Sidebar: () => (
          <Block style={{ backgroundColor: "#D9D2E9" }}>Sidebar</Block>
        ),
      }}
    >
      <Container>
        <Block>
          Child
          <button className="" onClick={() => setCount(count + 2)}>{count} + 2</button>
        </Block>
      </Container>
    </Template>
  </>
);
