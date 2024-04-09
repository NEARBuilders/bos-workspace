const items = props.items;
const renderItem = props.renderItem;
const perPage = props.perPage || 10;

const jItems = JSON.stringify(items);
if (state.jItems !== jItems) {
  State.update({
    items: 0,
    jItems,
  });
}

const makeMoreItems = () => {
  State.update({
    items: state.items + perPage,
  });
};

const Layout = props.Layout;

const renderedItems = items.slice(0, state.items).map(renderItem);

return (
  <InfiniteScroll
    pageStart={0}
    loadMore={makeMoreItems}
    hasMore={state.items < items.length}
    loader={<div className="loader">Loading ...</div>}
  >
    {Layout ? <Layout>{renderedItems}</Layout> : <>{renderedItems}</>}
  </InfiniteScroll>
);
