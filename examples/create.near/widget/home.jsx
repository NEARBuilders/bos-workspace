/**
 * Project: Create
 * By: efiz.near, sking.near
 * Repository: https://github.com/near-everything/bos-workspace
 */

const Url = {
  construct: (url, params) => {
    let query = "";
    Object.keys(params || {}).forEach((key) => {
      if (params.hasOwnProperty(key)) {
        query += Url.encode(key) + "=" + Url.encode(params[key]);
        if (key !== Object.keys(params || {}).slice(-1)[0]) {
          query += "&";
        }
      }
    });
    return url + "?" + query;
  },
  // Alternative to encodeURIComponent
  encode: (str) => {
    return `${str}`
      .replace(/[!'()*]/g, (c) => {
        return "%" + c.charCodeAt(0).toString(16);
      })
      .replace(/[^!'\(\)~\*A-Za-z0-9\-_\.~]/g, (c) => {
        return "%" + c.charCodeAt(0).toString(16);
      });
  },
};


State.init({
  page: props.page ?? "projects",
  project: props.project ?? null,
});

const pages = [
  {
    id: "projects",
    title: "Projects",
    active: state.page === "projects",
    widget: "create.near/widget/manager.index",
    provider: "create.near/widget/Provider",
  },
  {
    id: "editor",
    title: "Editor",
    active: state.page === "editor",
    widget: "create.near/widget/editor.index",
    provider: "create.near/widget/Provider",
  },
  {
    id: "manage",
    title: "Manage",
    active: state.page === "manage",
    widget: "create.near/widget/project.index",
    provider: "create.near/widget/Provider",
  },
];
const activePage = pages.find((p) => p.active);

const navigate = (v, params) => {
  State.update({ page: v, project: params?.project });
  const url = Url.construct("#/create.near/widget/home", params);
  Storage.set("url", url);
};

return (
  <>
    <div className="row">
      <Widget
        src={"create.near/widget/ui.navbar"}
        props={{
          template: "create.near/widget/templates.ui.navbar.default",
          onPageChange: navigate,
          pages: ["projects"],
        }}
      />
      <div className="col">
        {activePage.provider ? (
          <Widget
            src={activePage.provider}
            props={{
              Children: (p) => <Widget src={activePage.widget} props={p} />,
              navigate,
              project,
              ...props,
              templates: {
                Folders: "create.near/widget/editor.uiFolders",
              },
            }}
          />
        ) : (
          <Widget
            src={activePage.widget}
            props={{ ...props, navigate, project }}
          />
        )}
      </div>
    </div>
  </>
);
