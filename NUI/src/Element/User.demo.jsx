return (
  <div className="d-flex flex-column gap-5">
    <div className="d-flex gap-5">
      <Widget
        src="nui.sking.near/widget/Element.User"
        props={{
          options: {
            size: "md",
            showSocialName: true,
            showImage: true,
            showHumanBadge: true,
          },
        }}
      />
      <Widget
        src="nui.sking.near/widget/Element.User"
        props={{
          options: {
            size: "sm",
            showSocialName: true,
            showImage: true,
            showHumanBadge: true,
          },
        }}
      />
    </div>
    <div className="d-flex gap-5">
      <Widget
        src="nui.sking.near/widget/Element.User"
        props={{
          options: {
            size: "md",
            showSocialName: false,
            showImage: true,
            showHumanBadge: true,
          },
        }}
      />
      <Widget
        src="nui.sking.near/widget/Element.User"
        props={{
          options: {
            size: "sm",
            showSocialName: false,
            showImage: true,
            showHumanBadge: true,
          },
        }}
      />
    </div>
    <div className="d-flex gap-5">
      <Widget
        src="nui.sking.near/widget/Element.User"
        props={{
          options: {
            size: "md",
            showSocialName: true,
            showImage: false,
            showHumanBadge: true,
          },
        }}
      />
      <Widget
        src="nui.sking.near/widget/Element.User"
        props={{
          options: {
            size: "sm",
            showSocialName: true,
            showImage: false,
            showHumanBadge: true,
          },
        }}
      />
    </div>
    <div className="d-flex gap-5">
      <Widget
        src="nui.sking.near/widget/Element.User"
        props={{
          options: {
            size: "md",
            showSocialName: false,
            showImage: false,
            showHumanBadge: true,
          },
        }}
      />
      <Widget
        src="nui.sking.near/widget/Element.User"
        props={{
          options: {
            size: "sm",
            showSocialName: false,
            showImage: false,
            showHumanBadge: true,
          },
        }}
      />
    </div>
  </div>
);
