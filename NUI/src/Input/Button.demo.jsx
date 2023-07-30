const sizes = ["sm", "md", "lg"];

return (
  <div className="d-flex flex-column gap-4 py-4">
    <div className="d-flex flex-column gap-2">
      {sizes.map((size) => (
        <div className="d-flex flex-row gap-1">
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{ children: "Button", variant: "", size }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{ children: "Button", variant: "outline", size }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "icon rounded",
              size,
            }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "outline icon rounded",
              size,
            }}
          />
        </div>
      ))}
    </div>
    <div className="d-flex flex-column gap-2">
      {sizes.map((size) => (
        <div className="d-flex flex-row gap-1">
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{ children: "Button", variant: "primary", size }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{ children: "Button", variant: "primary outline", size }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "primary icon rounded",
              size,
            }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "primary outline icon rounded",
              size,
            }}
          />
        </div>
      ))}
    </div>
    <div className="d-flex flex-column gap-2">
      {sizes.map((size) => (
        <div className="d-flex flex-row gap-1">
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{ children: "Button", variant: "secondary", size }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: "Button",
              variant: "secondary outline",
              size,
            }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "secondary icon rounded",
              size,
            }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "secondary outline icon rounded",
              size,
            }}
          />
        </div>
      ))}
    </div>
    <div className="d-flex flex-column gap-2">
      {sizes.map((size) => (
        <div className="d-flex flex-row gap-1">
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{ children: "Button", variant: "success", size }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{ children: "Button", variant: "success outline", size }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "success icon rounded",
              size,
            }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "success outline icon rounded",
              size,
            }}
          />
        </div>
      ))}
    </div>
    <div className="d-flex flex-column gap-2">
      {sizes.map((size) => (
        <div className="d-flex flex-row gap-1">
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{ children: "Button", variant: "info", size }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{ children: "Button", variant: "info outline", size }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "info icon rounded",
              size,
            }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "info outline icon rounded",
              size,
            }}
          />
        </div>
      ))}
    </div>
    <div className="d-flex flex-column gap-2">
      {sizes.map((size) => (
        <div className="d-flex flex-row gap-1">
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{ children: "Button", variant: "danger", size }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{ children: "Button", variant: "danger outline", size }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "danger icon rounded",
              size,
            }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "danger outline icon rounded",
              size,
            }}
          />
        </div>
      ))}
    </div>
    <div className="d-flex flex-column gap-2">
      {sizes.map((size) => (
        <div className="d-flex flex-row gap-1">
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: "Button",
              variant: "disabled",
              size,
              disabled: true,
            }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: "Button",
              variant: "disabled outline",
              disabled: true,
              size,
            }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "disabled icon rounded",
              size,
              disabled: true,
            }}
          />
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-arrow-right" />,
              variant: "disabled outline icon rounded",
              size,
              disabled: true,
            }}
          />
        </div>
      ))}
    </div>
  </div>
);
