/**
 * Project: Create
 * By: efiz.near, sking.near
 * Repository: https://github.com/near-everything/bos-workspace
 */

/*__@import:QoL/widget__*/
/*__@import:QoL/Url__*/

State.init({
  page: props.page ?? "projects",
  project: props.project ?? null,
});

const pages = [
  {
    id: "projects",
    title: "Projects",
    active: state.page === "projects",
    widget: "/*__@appAccount__*//widget/manager.index",
    provider: "/*__@appAccount__*//widget/Provider",
  },
  {
    id: "editor",
    title: "Editor",
    active: state.page === "editor",
    widget: "/*__@appAccount__*//widget/editor.index",
    provider: "/*__@appAccount__*//widget/Provider",
  },
  {
    id: "manage",
    title: "Manage",
    active: state.page === "manage",
    widget: "/*__@appAccount__*//widget/project.index",
    provider: "/*__@appAccount__*//widget/Provider",
  },
];
const activePage = pages.find((p) => p.active);

const navigate = (v, params) => {
  State.update({ page: v, project: params?.project });
  const url = Url.construct("#//*__@appAccount__*//widget/home", params);
  Storage.set("url", url);
};

return (
  <>
    <div className="row">
      {widget("/*__@appAccount__*//widget/ui.navbar", {
        template: "/*__@appAccount__*//widget/templates.ui.navbar.default",
        onPageChange: navigate,
        pages: ["projects"],
      })}
      <div className="col">
        {activePage.provider
          ? widget(activePage.provider, {
              Children: (p) => widget(activePage.widget, p),
              navigate,
              project,
              ...props,
              templates: {
                Folders: "/*__@appAccount__*//widget/editor.uiFolders",
              },
            })
          : widget(activePage.widget, { ...props, navigate, project })}
      </div>
    </div>
  </>
);
