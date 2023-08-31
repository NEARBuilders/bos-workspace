const BG = styled.div`
  background-color: #4cc38a;
  background-image: linear-gradient(180deg, #c5ecdb 0%, #a5e1c6 100%);
  height: 100vh;
`;

return (
  <BG>
    <Widget
      src="devs.near/widget/Router"
      blockHeight={"final"}
      props={{
        Navigator: {
          // template for your navbar
          src: {
            path: "livepeer.near/widget/App.Header",
            blockHeight: "final",
          },
          theme: "", // TODO: add theme
        },
        routes: {
          browse: {
            src: {
              path: "livepeer.near/widget/App.Video.browse",
              blockHeight: "final",
            },
          },
          view: {
            src: {
              path: "livepeer.near/widget/App.Video.view",
              blockHeight: "final",
            },
          },
          create: {
            src: {
              path: "livepeer.near/widget/App.Video.create",
              blockHeight: "final",
            },
          },
          library: {
            src: {
              path: "livepeer.near/widget/Library.index",
              blockHeight: "final",
            },
          },
        },
      }}
    />
  </BG>
);

// I feel like the provider should surround the router.
