const { Layout, Components } = props;

return (
  <Widget
    src={"common.near/widget/List"}
    blockHeight={"final"}
    props={{
      items: [{ key: "item1" }, { key: "item2" }, { key: "item3" }],
      Item: (p) => (
        <Widget
          src={"voyager2.near/widget/sidebar.item"}
          blockHeight={"final"}
          props={p}
        />
      ),
    }}
  />
);