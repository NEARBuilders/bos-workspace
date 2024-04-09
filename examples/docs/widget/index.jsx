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
  * {
    box-sizing: border-box;
    font-weight: 400;
  }

  .window {
    /* -webkit-font-smoothing: none; */
    letter-spacing: 0.025em;

    background-color: #fff;
    height: 100vh;
    width: 100% !important;

    border-radius: 5px;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .sidebar {
    padding: 20px;
    width: 250px;
  }

  .nested-section {
    margin-bottom: 10px;
  }

  .parent-section {
    margin-bottom: 5px;
  }

  .child-section {
    margin-left: 20px; /* Adjust as needed for indentation */
  }

  .button {
    display: block;
    width: 100%;
    padding: 8px;
    margin: 0;
    border: none;
    /* background-color: transparent; */
    text-align: left;

    -moz-appearance: none;
    appearance: none;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0.45em 0.75em;
    border-left: 2px solid #ededed;
    border-top: 2px solid #ededed;
    border-right: 2px solid #404040;
    border-bottom: 2px solid #404040;

    color: #000;
    background-color: silver;
    position: relative;
    z-index: 10;
  }

  .button:hover {
    background-color: #f0f0f0;
  }

  .separator {
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }

  .link {
    text-decoration: "none";
    color: inherit;
  }

  .header {
    width: 100%;
    position: relative;
    color: #fff;
    padding: 0.25em 0.75em;
    line-height: 1.4;
    border-left: 2px solid #ededed;
    border-top: 2px solid #ededed;
    border-right: 2px solid #404040;
    border-bottom: 2px solid #404040;
    background: navy;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    color: white;

    .branding {
      margin-right: 24px;
    }

    .nav {
      display: flex;
      flex-direction: row;
      gap: 20px;

      padding: 0 20px;
    }

    .end {
      margin-left: auto;
    }
  }

  .left-branding {
    margin-right: auto; /* Pushes the branding to the left */
  }

  .routes {
    display: flex;
    gap: 20px;
  }

  .settings {
    margin-left: auto; /* Pushes the settings to the right */
  }

  .link {
    text-decoration: none;
    color: white;
  }

  .link:hover {
    text-decoration: underline;
  }

  .content {
    padding: 20px;
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
