const config = {
  theme: {
    // add key values to define colors
    // "--main-color": "blue",
    // "--secondary-color": "red",
    // background: "var(--main-color)",
    // color: "var(--secondary-color)",
  },
  layout: {
    src: "${config_account}/widget/layout",
    props: {
      variant: "sidebar",
    },
  },
  blocks: {
    // these get passed to the layout and children
    Header: () => (
      // customize your header
      <Widget
        src="${config_account}/widget/components.Header"
        props={{ routes: config.router.routes, ...passProps }}
      />
    ),
    Footer: () => <></>, // customize your footer
    Sidebar: () => (
      <Widget
        src="${config_account}/widget/components.Sidebar"
        props={{ routes: config.router.routes, ...passProps }}
      />
    ),
  },
  router: {
    param: "page",
    routes: {
      home: {
        path: "${config_account}/widget/home",
        blockHeight: "final",
        init: {
          name: "Home",
        },
        default: true,
      },
    },
  },
};

const Root = styled.div`
  .sidebar {
    min-width: 250px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .button {
    width: 100%;
    padding: 10px;
    border: "none";
    background-color: "#007bff";
    color: "#fff";
    border-radius: "5px";
    cursor: "pointer";
  }
  // you can override classnames here
`;

return (
  <Root>
    <Widget
      src="${config_account}/widget/PR.view"
      props={{ config, ...props }}
    />
  </Root>
);
