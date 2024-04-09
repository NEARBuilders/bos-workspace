const accountId = context.accountId;

let project = Social.getr(`${accountId}/project`);

if (project === null) {
  return "Loading";
}

State.init({
  project,
});

return (
  <div className="row">
    <div className="mb-2">
      <h5>Project Page Widget Source</h5>
      <Widget
        src="gov.near/widget/MetadataEditor"
        props={{
          initialMetadata: project,
          onChange: (project) => State.update({ project }),
          options: {
            featuredWidget: {
              label: "Example: mob.near/widget/Applications",
            },
          },
        }}
      />
    </div>
    <div className="mb-2">
      <CommitButton data={{ project: state.project }}>
        Save Featured Widget
      </CommitButton>
    </div>
  </div>
);
