function Feed({ index, Item, Layout, typeWhitelist }) {
  Item = Item || ((props) => <div>{JSON.stringify(props)}</div>);
  Layout = Layout || (({ children }) => children);

  const renderItem = (item, i) => {
    if (typeWhitelist && !typeWhitelist.includes(item.value.type)) {
      return false;
    }
    return (
      <div key={JSON.stringify(item)}>
        <Item {...item} />
      </div>
    );
  };

  if (Array.isArray(index)) {
    return (
      <Widget
        src="devs.near/widget/PR.MergedIndexFeed"
        props={{
          index,
          renderItem,
          Layout: ({ children }) => <Layout>{children}</Layout>,
        }}
      />
    );
  } else {
    return (
      <Widget
        src="devs.near/widget/PR.FilteredIndexFeed"
        props={{
          index,
          renderItem,
          Layout: ({ children }) => <Layout>{children}</Layout>,
        }}
      />
    );
  }
}

return { Feed };
