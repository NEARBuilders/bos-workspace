const index = {
  action: "every",
  key: "video",
  options: {
    limit: 10,
    order: "desc",
  },
};

const renderItem = (item, i) => {
  const path = `${item.accountId}/thing/${item.value.id}`;
  return (
    <Widget
      src="livepeer.near/widget/Video"
      props={{ path, blockHeight: item.blockHeight, handleExpandVideo: props.handleExpandVideo }}
    />
  );
};

return (
  <Widget
    src="mob.near/widget/FilteredIndexFeed"
    props={{ index, renderItem }}
  />
);
