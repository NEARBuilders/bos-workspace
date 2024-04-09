return (
  <Widget
    loading={props.children}
    src="mob.near/widget/N.Common.OverlayTrigger"
    props={{
      popup: (
        <Widget
          src="mob.near/widget/group.overlay"
          props={{ groupId: props.groupId, accountId: props.accountId }}
        />
      ),
      ...props,
    }}
  />
);