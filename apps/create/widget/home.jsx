/*__@import:QoL/widget__*/

State.init({
  page: props.page ?? "projects",
});

// function init() {
//   if (!state.page) {
//     Storage.get()
//   }
// }

console.log("home", props);

return (
  <div>
    {widget("/*__@appAccount__*//widget/ui.navbar", {
      onPageChange: (v) => {
        // we navigate pages in state so it's smooth
        State.update({ page: v });
        // but we set the url in storage so can share link
        Storage.set("url", "#//*__@appAccount__*//widget/home?page=" + v)
      },
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
