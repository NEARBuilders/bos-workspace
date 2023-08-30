const index = {
  action: "every",
  key: "every.near/type/event",
  options: {
    limit: 10,
    order: "desc",
  },
};

const renderItem = (item, i) => {
  const path = `${item.accountId}/thing/${item.value.id}`;
  return (
    <Widget
      src="livepeer.near/widget/EventItem"
      props={{ path, blockHeight: item.blockHeight }}
    />
  );
};

return (
  <Widget
    src="mob.near/widget/FilteredIndexFeed"
    props={{ index, renderItem }}
  />
);
