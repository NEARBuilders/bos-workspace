const { Router } = VM.require("${config_account}/widget/PR.Router") || {
  Router: () => <></>,
};

const { config, ...passProps } = props;

if (!config) {
  // TODO: get from settings (or default)
  config = {
    router: {
      param: "page",
      routes: {
        home: {
          default: true,
          path: "efiz.near/widget/Tree",
          blockHeight: "final",
          init: {
            name: "Home",
          },
        },
      },
    },
    blocks: {
      Header: () => <></>, // customize your header
      Footer: () => <></>, // customize your footer
    },
  };
} else {
  // config may be a VM require string
  if (typeof config !== "object") {
    config = VM.require(config) || {};
  }
}

console.log("config", config);

if (!config) {
  return (
    <p>
      unable to load config:{" "}
      {typeof config === object ? JSON.stringify(config) : config}
    </p>
  );
}

const { Layout } = VM.require(
  config.layout?.src ?? "devs.near/widget/Layout"
) || {
  Layout: () => <></>,
};

// While something like Theme should be in the parent...
const CSS = styled.div`
  .container {
    /* border: 1px solid red; */
  }

  .button {
  }

  .input {
  }

  .layout {
    /* border: 4px solid var(--main-color); */
  }

  .header {
    /* border: 1px solid blue; */
  }

  .content {
  }

  .footer {
  }
`;

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

// const Template = config.Template ?? (({children}) => <>{children}</>);

return (
  <CSS style={config.theme}>
    <Container className="window">
      <Layout
        {...(config.layout?.props ?? { variant: "standard" })}
        blocks={config.blocks}
      >
        <Content>
          <Router config={config.router} {...passProps} />
        </Content>
      </Layout>
    </Container>
  </CSS>
);