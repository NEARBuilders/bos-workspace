const index = {
  action: "every",
  key: "every.near/type/event",
  options: {
    limit: 10,
    order: "desc",
  },
};

console.log(index);

const renderItem = (item, i) => {
  const path = `${item.accountId}/thing/${item.value.id}`;

  console.log(path);
  console.log(item.blockHeight);
  return (
    <Widget
      src="itexpert120-contra.near/widget/EventItem"
      props={{ path, blockHeight: item.blockHeight }}
    />
  );
};

return (
  <div className="container">
    <h2 className="mb-3">Events Feed</h2>
    <Widget
      src="mob.near/widget/FilteredIndexFeed"
      props={{ index, renderItem }}
    />
  </div>
);
