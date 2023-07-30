const sizes = ["sm", "md", "lg"];

return (
  <div className="d-flex flex-column gap-4 py-4">
    <div className="d-flex flex-column gap-4">
      {sizes.map((size) => (
        <div className="d-flex flex-column gap-2">
          <Widget
            src="nui.sking.near/widget/Input.Text"
            props={{
              placeholder: "Input",
              type,
              size,
              label: "Label",
            }}
          />
          <div className="d-flex align-items-center gap-2">
            <Widget
              src="nui.sking.near/widget/Input.Text"
              props={{
                placeholder: "Input",
                type,
                size,
                icon: <i className="bi bi-search" />,
              }}
            />
            <Widget
              src="nui.sking.near/widget/Input.Button"
              props={{ children: "Button", variant: "primary", size }}
            />
          </div>
        </div>
      ))}
    </div>
    <div className="d-flex flex-column gap-4">
      {sizes.map((size) => (
        <div className="d-flex flex-column gap-2">
          <Widget
            src="nui.sking.near/widget/Input.Text"
            props={{
              placeholder: "Input",
              textarea: true,
              size,
              label: "Label",
            }}
          />
        </div>
      ))}
    </div>
  </div>
);
