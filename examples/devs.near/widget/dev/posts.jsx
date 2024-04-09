const accountId = context.accountId;
const daoId = "build.sputnik-dao.near";
const groupId = props.groupId ?? "community";

const policy = Near.view(daoId, "get_policy");

if (policy === null) {
  return "";
}

const groups = policy.roles
  .filter((role) => role.name === groupId)
  .map((role) => {
    const group = role.kind.Group;

    return group;
  });

const isMember = groups.map((group) => {
  return !group
    ? false
    : group.filter((address) => address === accountId).length > 0;
})?.[1];

const hashtags = [
  { name: "dev", required: true },
  { name: "bos", required: true },
];
return (
  <>
    <p>{group}</p>
    <Widget
      src="efiz.near/widget/Community.Posts.Compose"
      props={{
        embedHashtags: hashtags,
        communityDomain: "devs.near",
        isMember,
        exclusive: true,
        allowPublicPosting: true,
        key: "devs",
      }}
    />
    <Widget
      src="efiz.near/widget/Community.Posts"
      props={{
        communityHashtags: hashtags,
        communityDomain: "devs.near",
        communityMembers: group[1],
        exclusive: true,
        allowPublicPosting: true,
      }}
    />
  </>
);
