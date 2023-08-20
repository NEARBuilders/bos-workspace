const { handleCreateProject } = props;
const projects = props.projects ?? [
  {
    title: "Project 1",
    tags: ["tag", "docs"],
    logo: "https://ipfs.near.social/ipfs/bafkreifjxdfynw6icgtagcgyhsgq5ounl7u45i2pa2xadiax2bpg7kt3hu",
  },
  {
    title: "Project 2 NEAR BOS NDC EVERYTHING",
    tags: ["near", "bos"],
    logo: "https://near.org/_next/static/media/logo-black.2e682d59.svg",
  },
  {
    title: "Project 2 NEAR BOS NDC EVERYTHING",
    tags: ["near", "bos"],
    logo: "https://near.org/_next/static/media/logo-black.2e682d59.svg",
  },
  {
    title: "Project 2 NEAR BOS NDC EVERYTHING",
    tags: ["near", "bos"],
    logo: "https://near.org/_next/static/media/logo-black.2e682d59.svg",
  },
  {
    title: "Project 2 NEAR BOS NDC EVERYTHING",
    tags: ["near", "bos"],
    logo: "https://near.org/_next/static/media/logo-black.2e682d59.svg",
  },
  {
    title: "Project 2 NEAR BOS NDC EVERYTHING",
    tags: ["near", "bos"],
    logo: "https://near.org/_next/static/media/logo-black.2e682d59.svg",
  },
];

function renderProject({ title, tags, logo, id }) {
  return (
    <a
      className="rounded-2 overflow-hidden"
      href={"#//*__@appAccount__*//widget/editor?project=" + id}
      style={{
        width: "calc( 20% - 20px )",
        maxWidth: "100%",
        backgroundColor: "#f9fbfe",
        border: "1px solid #d1d5db",
      }}
    >
      <div className="ratio ratio-4x3">
        <div className="d-flex justify-content-center align-items-center bg-white">
          {logo && <img src={logo} alt={title} height={55} width={55} />}
        </div>
      </div>
      <div className="p-3">
        <h5
          className="h6 m-0"
          style={{
            lineHeight: 1.5,
          }}
        >
          {title}
        </h5>
      </div>
    </a>
  );
}

function renderHeader({ handleCreateProject }) {
  return (
    <div className="d-flex gap-4 justify-content-between py-4">
      <h4>All my projects</h4>
      {widget("/*__@replace:nui__*//widget/Layout.Modal", {
        toggle: widget("/*__@replace:nui__*//widget/Input.Button", {
          variant: "success",
          size: "lg",
          children: "New project",
        }),
        content: widget("/*__@appAccount__*//widget/manager.form", {
          handleCreateProject,
        }),
      })}
    </div>
  );
}

/*__@import:QoL/widget__*/

return (
  <>
    {widget("/*__@appAccount__*//widget/ui.navbar")}
    {renderHeader({
      handleCreateProject,
    })}
    {!!projects && !!projects.length && (
      <div className="d-flex gap-4 flex-wrap">
        {projects.map(renderProject)}
      </div>
    )}
    {(!projects || !projects.length) && (
      <div className="text-center">You don't have any projects yet</div>
    )}
  </>
);
