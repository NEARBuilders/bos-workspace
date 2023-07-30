const accountId = props.accountId ?? context.accountId;

const page = accountId
  ? Social.get(`${accountId}/settings/dao/page`)
  : undefined;

if (page === null) {
  return "Loading...";
}

return <Widget src={page ?? "hack.near/widget/DAO.Profile"} props={props} />;
