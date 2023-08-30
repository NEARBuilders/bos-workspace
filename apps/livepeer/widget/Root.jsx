function Root() {
  return (
    <div>
      {/* Initialize State */}
      <StateManager src="livepeer.near/widget/StateManager" blockHeight="final" />

      {/* Router Widget */}
      <Widget
        src="devs.near/widget/Router"
        blockHeight="final"
        props={{
          routes: {
            home: { src: "devs.near/widget/Home", blockHeight: "final" },
            view: { src: "devs.near/widget/Video.view", blockHeight: "final" },
            create: { src: "devs.near/widget/Video.create", blockHeight: "final" },
          },
        }}
      />

      {/* Layout Widget */}
      <Widget
        src="devs.near/widget/Layout"
        blockHeight="final"
        props={{
          components: {
            Header: { src: "livepeer.near/widget/Header", blockHeight: "final" },
            Footer: { src: "livepeer.near/widget/Footer", blockHeight: "final" },
            MainContent: { src: "livepeer.near/widget/MainContent", blockHeight: "final" },
          },
        }}
      />

      {/* Provider Widget */}
      <Widget
        src="devs.near/widget/Provider"
        blockHeight="final"
        props={{
          handlers: {
            createVideo: { src: "livepeer.near/widget/Livepeer.Creator", blockHeight: "final" },
            viewVideo: { src: "livepeer.near/widget/Livepeer.Player", blockHeight: "final" },
            listVideos: { src: "livepeer.near/widget/Livepeer.VideoList", blockHeight: "final" },
          },
          types: {
            Video: { src: "every.near/type/video", blockHeight: "final" },
          },
        }}
      />
    </div>
  );
}
