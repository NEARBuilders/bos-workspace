const accountId = props.accountId ?? context.accountId;
if (!accountId) {
  return "No account ID";
}

const profile = props.profile ?? Social.getr(`${accountId}/profile`);

if (profile === null) {
  return "Loading";
}

return (
  <div className="py-1 px-1">
    <div className="mx-auto">
      <Widget
        src="hack.near/widget/dev.profile"
        props={{
          accountId,
          profile,
          link: true,
          showEditButton: !props.profile,
        }}
      />

      <div className="mt-3 m-2">
        <Widget src="devs.near/widget/dev.feed" props={{ accountId }} />
      </div>
    </div>
  </div>
);
