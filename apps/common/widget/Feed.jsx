// this can come from a thing

const index = JSON.parse(Social.get(props.path, props.blockHeight) || "null");
const index = {
  action: "every",
  key: "event",
  options: {
    limit: 10,
    order: "desc",
  },
};

if (!index) {
  return <p>Loading...</p>;
}

const renderItem = (item, i) => {
  const path = `${item.accountId}/thing/${item.value.id}`;
  const Item = props.Item;
  return (
    <Item path={path} blockHeight={item.blockHeight} />
  );
};

return (
  <Widget
    src="mob.near/widget/FilteredIndexFeed"
    props={{ index, renderItem }}
  />
);


<Widget src="common.near/widget/Feed" props={{ path: "livepeer.near/feed", Item: () => <Widget src={"livepeer.near/widget/EventItem"} /> }} />