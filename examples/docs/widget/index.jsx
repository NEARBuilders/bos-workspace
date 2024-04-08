/**
 * We can get some data from the project itself
 * metadata, name, description, tags, etc.
 * We want the document paths... We want to be able to add or remove them...
 *
 * What would be ideal for this? It can be a post or a page
 * If it is a post, then we got comments on it directly.
 *
 * If you'd like to leave any questions, feel free to comment directly on the page.
 *
 * I want to be able to render some embeddings
 */

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
        props={{
          routes: config.router.routes,
          basePath: "${config_account}/widget/index",
          param: "page",
          ...passProps,
        }}
      />
    ),
    Footer: () => <></>, // customize your footer
    Sidebar: () => (
      <Widget
        src="${config_account}/widget/components.Sidebar"
        props={{
          routes: config.router.routes,
          basePath: "${config_account}/widget/index",
          param: "page",
          ...passProps,
        }}
      />
    ),
  },
  router: {
    param: "page",
    routes: [
      {
        path: "/",
        element: {
          src: "${config_account}/widget/home",
          initialProps: {},
        },
      },
      {
        path: "/settings",
        element: {
          src: "${config_account}/widget/settings",
          initialProps: {},
        },
      },
      {
        path: "/:path*",
        element: {
          src: "${config_account}/widget/document",
        },
      },
    ],
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
  }

  .link {
    text-decoration: "none";
    color: inherit;
  }
`;

return (
  <Root>
    <Widget
      src="${config_account}/widget/PR.view"
      props={{ config, ...props }}
    />
  </Root>
);
