const { Layout, Components } = props;

return (
  <Widget
    src={Layout.src}
    blockHeight={Layout.blockHeight}
    props={{
      items: ["item1", "item2", "item3"], 
      Item: () => <Widget src={Components.Item.src} blockHeight={Components.Item.blockHeight} />,
    }}
  />
);
