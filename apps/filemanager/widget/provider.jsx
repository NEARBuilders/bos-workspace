const { layout } = props;
const { components } = layout;

function Component(key, props) {
  const { src, blockHeight } = components[key];
  return <Widget src={src} blockHeight={blockHeight} props={props} />;
}

State.init({
  accountId: context.accountId || "",
  selectedValue: {},
});

function setContent(key, value) {
  State.update({ selectedKey: key, selectedValue: value });
}

return (
  <Widget
    src={layout.src}
    blockHeight={layout.blockHeight}
    props={{
      Search: () =>
        Component("Search", {
          setAccount: (v) => State.update({ accountId: v }),
        }),
      Items: () =>
        Component("Items", {
          accountId: state.accountId,
          onSelect: setContent,
        }),
    }}
  />
);
