const accountId = props.debugAccountId ?? context.accountId;

if (!accountId) {
  return (
    <div className="alert alert-warning rounded-4 mb-3">
      <div className="text-end">
        <div className="fw-bold">
          Start by clicking here
          <Widget
            src="gov.near/widget/ProjectImage"
            props={{ accountId: "" }}
          />
          <i class="fs-1 align-middle bi bi-arrow-up-right" />
        </div>
      </div>
    </div>
  );
}

const project = Social.getr(`${accountId}/project`);

if (project === null) {
  return "";
}

const name = project.name;
const image = project.image;
const widget = project.featuredWidget;

const editProjectButton = (
  <div>
    <h2>Welcome to Near Social!</h2>
    <p>
      Everything about this platform is customizable, including Project Pages.
    </p>
    <Widget src="create.near/widget/ProjectEditor" />
  </div>
);

if (!widget) {
  return (
    <div className="alert alert-warning rounded-4 mb-3">
      {editProjectButton}
    </div>
  );
}

return <></>;
