return (
  <Widget
    src="devs.near/widget/Router"
    blockHeight={"final"}
    props={{
      Navigator: {
        // template for your navbar
        src: {
          path: "/*__@appAccount__*//widget/App.Header",
          blockHeight: "final",
        },
        theme: "", // TODO: add theme
      },
      routes: {
        browse: {
          src: {
            path: "/*__@appAccount__*//widget/App.Video.browse",
            blockHeight: "final",
          },
        },
        view: {
          src: {
            path: "/*__@appAccount__*//widget/App.Video.view",
            blockHeight: "final",
          },
        },
        create: {
          src: {
            path: "/*__@appAccount__*//widget/App.Video.create",
            blockHeight: "final",
          },
        },
        library: {
          src: {
            path: "/*__@appAccount__*//widget/Library.index",
            blockHeight: "final",
          },
        },
      },
    }}
  />
);

// I feel like the provider should surround the router.
