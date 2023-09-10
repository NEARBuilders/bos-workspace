State.init({
  accountId: context.accountId || "",
});

return (
  <div className="d-flex align-items-center gap-2">
    <Widget
      src="nearui.near/widget/Input.ExperimentalText"
      props={{
        placeholder: "Account Id",
        value: state.accountId,
        onChange: (v) => State.update({ accountId: v }),
        size: "sm",
        icon: <i className="bi bi-search" />,
      }}
    />
    <Widget
      src="nearui.near/widget/Input.Button"
      props={{
        children: <i className="bi bi-arrow-right" />,
        variant: "primary",
        size: "sm",
        onClick: () => props.setAccount(state.accountId),
      }}
    />
  </div>
);
