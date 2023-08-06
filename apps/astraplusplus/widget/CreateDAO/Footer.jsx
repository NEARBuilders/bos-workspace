const nextChildren = props.isLast ? (
  <>
    Create new DAO <i className="bi bi-check2" />
  </>
) : (
  <>
    Next step <i className="bi bi-chevron-right" />
  </>
);
const hasPrevious = props.hasPrevious;
const onReset = props.onReset ?? (() => {});
const onNext = props.onNext ?? (() => {});
const onPrevious = props.onPrevious ?? (() => {});

return (
  <div className="d-flex align-items-center gap-2 mt-5">
    <Widget
      src="nearui.near/widget/Input.Button"
      props={{
        children: "Reset steps",
        variant: "danger outline",
        size: "lg",
        className: "me-auto",
        onClick: onReset,
      }}
    />
    <Widget
      src="nearui.near/widget/Input.Button"
      props={{
        children: (
          <>
            <i className="bi bi-chevron-left" /> Previous step
          </>
        ),
        variant: "info outline",
        size: "lg",
        onClick: onPrevious,
        className: hasPrevious ? undefined : "d-none",
      }}
    />
    <Widget
      src="nearui.near/widget/Input.Button"
      props={{
        children: nextChildren,
        variant: "info",
        size: "lg",
        onClick: onNext,
        buttonProps: {
          type: "submit",
        },
      }}
    />
  </div>
);
