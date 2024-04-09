const ownerId = "hack.near";
const curatedComps = [
  {
    category: "Learn",
    id: "concepts",
    icon: "bi-mortarboard-fill",
    components: [
      {
        accountId: "hack.near",
        widgetName: "edu.library",
      },
    ],
  },
  {
    category: "Quickstart",
    icon: "bi-rocket-takeoff-fill",
    id: "quickstart",
    components: [
      {
        accountId: "gagdiez.near",
        widgetName: "Greeter",
      },
    ],
  },
  {
    category: "Discover",
    icon: "bi-stars",
    id: "social",
    components: [
      {
        accountId: "mob.near",
        widgetName: "Explorer",
      },
      {
        accountId: "efiz.near",
        widgetName: "Tree",
      },
      {
        accountId: "every.near",
        widgetName: "browser",
      },
    ],
  },
  {
    category: "Examples",
    id: "examples",
    icon: "bi-map-fill",
    components: [
      {
        accountId: "gagdiez.near",
        widgetName: "HelloNear",
      },
      {
        accountId: "ostolex.near",
        widgetName: "DiceWidgetDemo",
      },
      {
        accountId: "dorgon108.near",
        widgetName: "TypeAheadExample",
      },
      {
        accountId: "mob.near",
        widgetName: "MarkdownEditorIframe",
      },
    ],
  },
  {
    category: "Tools",
    id: "tools",
    icon: "bi-tools",
    components: [
      { accountId: "hack.near", widgetName: "docs.cli" },
      { accountId: "mob.near", widgetName: "Explorer" },
      { accountId: "dataplatform.near", widgetName: "QueryApi.App" },
      { accountId: "bozon.near", widgetName: "WidgetHistory" },
      { accountId: "hack.near", widgetName: "GitBos" },
      { accountId: "azbang.near", widgetName: "CallbackEditor" },
    ],
  },
  {
    category: "Standards",
    id: "standards",
    icon: "bi-rulers",
    components: [
      {
        accountId: "mob.near",
        widgetName: "MetadataEditor",
      },
      {
        accountId: "efiz.near",
        widgetName: "every.post",
      },
      {
        accountId: "efiz.near",
        widgetName: "every.post.view",
      },
      {
        accountId: "near",
        widgetName: "FollowButton",
      },
      {
        accountId: "mob.near",
        widgetName: "Welcome.RHS.Editor",
      },
      {
        accountId: "mob.near",
        widgetName: "WidgetSource",
      },
      {
        accountId: "mob.near",
        widgetName: "IndexFeed",
      },
      {
        accountId: "mob.near",
        widgetName: "Image",
      },
      {
        accountId: "manzanal.near",
        widgetName: "Badge",
      },
    ],
  },
];
const filterTag = props.commonComponentTag ?? "edu";
const debug = props.debug ?? false;

const searchComponents = () => {
  return (
    <div className="mb-3">
      <div className="mb-2">
        <Widget
          src="mob.near/widget/ComponentSearch"
          props={{
            boostedTag: "edu",
            placeholder: "🔍 Search Applications",
            limit: 10,
            onChange: ({ result }) => {
              State.update({ apps: result });
            },
          }}
        />
      </div>
      {state.apps && (
        <div className="mb-2">
          {state.apps.map((app, i) => (
            <div key={i}>
              <Widget
                src="mob.near/widget/ComponentSearch.Item"
                props={{
                  link: `#/${app.widgetSrc}`,
                  accountId: app.accountId,
                  widgetName: app.widgetName,
                  onHide: () => State.update({ apps: null }),
                  extraButtons: ({ widgetPath }) => (
                    <a
                      target="_blank"
                      className="btn btn-outline-secondary"
                      href={`#/mob.near/widget/WidgetSource?src=${widgetPath}`}
                    >
                      Source
                    </a>
                  ),
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const renderCategory = (categoryId) => {
  if (!categoryId || categoryId === "") return <></>;
  const item = curatedComps.find((i) => i.id == categoryId);
  return (
    <div class="mt-3">
      <div class="text fs-5 text-muted mb-1" id={item.id}>
        {item.category}
      </div>
      <div class="border border-2 mb-4 rounded"></div>
      <div class="container">
        <div className="row ">
          {item.components.map((comp, i) => (
            <div class="mb-3">
              <Widget
                key={i}
                src="hack.near/widget/docs.card"
                props={{
                  accountId: comp.accountId,
                  widgetPath: `${comp.accountId}/widget/${comp.widgetName}`,
                  expanded: false,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
State.init({
  tab: "home",
  id: "",
});

const renderHome = () => {
  return (
    <>
      {searchComponents()}

      <div class="mt-2">
        <h4>Resources</h4>
        <div className="mb-3">
          {curatedComps && (
            <div className="mb-3 m-3">
              {curatedComps.map((cat, i) => renderCategory(cat.id))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const onSelect = (selection) => {
  State.update({ tab: selection.tab, id: selection.id ? selection.id : "" });
};

const renderContent = {
  home: renderHome(),
  searchComponents: searchComponents(),
  category: renderCategory(state.id),
}[state.tab];

return (
  <>
    <div class="row">
      <div class="col-md-3">
        <Widget
          src={`hack.near/widget/edu.navbar`}
          props={{
            tab: state.tab,
            onSelect,
            navItems: curatedComps.map((i) => ({
              category: i.category,
              icon: i.icon,
              id: i.id,
            })),
          }}
        />
        <hr className="border-2" />
        <Widget
          src="miraclx.near/widget/Attribution"
          props={{ authors: [ownerId], dep: true }}
        />
      </div>
      <div class="col-md-9">
        <div className="d-flex flex-wrap justify-content-between mb-3">
          <div className="m-1">
            <h2>
              <b>#docs</b>
            </h2>
          </div>
          <div className="m-1">
            <a
              href={`#/near/widget/ProfilePage?accountId=every.near`}
              class="text-muted"
            >
              <Widget
                src="mob.near/widget/Profile"
                props={{ accountId: "build.sputnik-dao.near" }}
              />
            </a>
          </div>
        </div>
        <p class="text">
          Everyone can build the blockchain operating system together!
        </p>
        {renderContent}
      </div>
    </div>
  </>
);
