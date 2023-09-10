const { path } = props;

State.init({
  path,
});

function setPath(v) {
  State.update({
    path: v,
  });
}

function init() {
  if (state.path === undefined) {
    setPath(context.accountId);
  }
}

init();

return <Widget src="common.near/widget/List" props={{ items: ["item1", "item2", "item3"]}} />;
// return <Widget src="voyager2.near/widget/sidebar.layout" props={{ layout: }}
