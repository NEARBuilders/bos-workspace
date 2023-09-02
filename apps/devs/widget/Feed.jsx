const index = props.index;
const buildPath = props.buildPath;
const Item = props.Item;
const Layout = props.Layout;

const renderItem = (item, i) => {
  return (
    <Item path={buildPath(item)} blockHeight={item.blockHeight} />
  );
};

return (
  <Widget
    src="devs.near/widget/PR.FilteredIndexFeed"
    props={{ index, renderItem, Layout: ({ children }) => <Layout>{children}</Layout>}}
  />
);
