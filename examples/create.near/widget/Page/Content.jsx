const accountId = props.accountId ?? context.accountId;

const content = accountId
  ? Social.get(`${accountId}/settings/near.social/page.content`)
  : undefined;

if (content === null) {
  return "Loading...";
}

return <Widget src="create.near/widget/ABC.Main" props={props} />;
