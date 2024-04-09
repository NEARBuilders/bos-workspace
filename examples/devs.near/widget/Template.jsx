const Container = styled.div`
  display: flex;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

const Template = ({ layout, theme, blocks, children }) => {
  const Layout = VM.require(layout?.src ?? "devs.near/widget/Layout") || (() => <></>);

  return (
    <Container style={theme}>
      <Layout
        {...(layout?.initialProps ?? { variant: "standard" })}
        blocks={blocks}
      >
        {children}
      </Layout>
    </Container>
  );
};

return { Template };
