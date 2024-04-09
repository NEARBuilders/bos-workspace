const accountId = props.accountId ?? context.accountId;

const project = props.project ?? Social.getr(`${accountId}/project`);

const name = project.name;
const image = project.image;

return (
  <div className="project d-inline-block">
    <a
      href={`#/create.near/widget/Page?accountId=${accountId}`}
      className="text-decoration-none link-dark"
    >
      <Widget
        src="gov.near/widget/ProjectImage"
        props={{
          project,
          accountId,
          className: "float-start d-inline-block me-2",
        }}
      />
      <div className="project-info d-inline-block" style={{ maxWidth: "16em" }}>
        <div className="project-name text-truncate">
          {name || "No-name project"}
        </div>
        <div className="project-links d-flex">
          <div className="d-inline-block project-account text-secondary text-truncate">
            @{accountId}
          </div>
        </div>
      </div>{" "}
    </a>
  </div>
);
