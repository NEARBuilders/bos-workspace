/*__@import:QoL/widget__*/

State.init({
  page: props.page ?? "projects",
});

console.log("home", props);

return (
  <div>
    {widget("/*__@appAccount__*//widget/ui.navbar", {
      onPageChange: (v) => State.update({ page: v }),
      pages: ["projects", "list", "editor"],
    })}
    {state.page === "projects" ? (
      <Widget src="create.near/widget/manager.index" props={props} />
    ) : state.page === "list" ? (
      <Widget src="create.near/widget/list.index" props={props} />
    ) : state.page === "editor" ? (
      <Widget src="create.near/widget/editor" props={props} />
    ) : state.page === "project" ? (
      <Widget src="create.near/widget/project.index" props={props} />
    ) : (
      "404"
    )}
  </div>
);
