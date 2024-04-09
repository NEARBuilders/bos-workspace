const data = props.data;
const typeWhitelist = JSON.stringify(data.typeWhitelist);
const key = data.key;
const domain = data.domain;
const hashtagFilter = JSON.stringify(data.hashtagFilter);
const daoId = data.daoId;

// Since we know the typeWhitelist, we could prefetch widgets
// and maybe write out a switch case?
//
// Or match with the name pattern? every.thing

if (
  typeWhitelist === JSON.stringify(["md", "social", "every.near/type/markdown"])
) {
  return (
    <>
      <Widget
        src="efiz.near/widget/Community.Posts.Compose"
        props={{
          key,
          communityDomain: domain,
          isMember: true,
          embedHashtags: data.hashtagFilter,
        }}
      />
      <p>{daoId}</p>
      <Widget
        src="every.near/widget/every.post"
        props={{
          typeWhitelist,
          key,
          domainFilter: JSON.stringify([domain]),
          hashtagFilter,
        }}
      />
    </>
  );
} else {
  return (
    <>
      <Widget
        src="every.near/widget/every.post.create"
        props={{ typeWhitelist, key }}
      />
      <Widget
        src="every.near/widget/every.post"
        props={{ typeWhitelist, key }}
      />
    </>
  );
}
