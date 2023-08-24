const { handleCreateProject, projects, navigate } = props;

function renderProject({ title, tags, logo, id }) {
  return (
    <a
      className="rounded-2 overflow-hidden w-100 text-decoration-none"
      onClick={() => {
        navigate("editor", { project: id });
      }}
      style={{
        width: "calc( 20% - 20px )",
        maxWidth: "100%",
        backgroundColor: "#f9fbfe",
        border: "1px solid #d1d5db",
        cursor: "pointer",
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
        content: widget("/*__@appAccount__*//widget/project.form", {
          handleCreateProject,
        }),
      })}
    </div>
  );
}

/*__@import:QoL/widget__*/

const Projects = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  list-style: none;
  grid-gap: 36px;
  margin-bottom: 36px;
`;

return (
  <>
    {renderHeader({
      handleCreateProject,
    })}
    {!!projects && !!projects.length && (
      <Projects>{projects.map(renderProject)}</Projects>
    )}
    {(!projects || !projects.length) && (
      <div className="text-center">You don't have any projects yet</div>
    )}
  </>
);
