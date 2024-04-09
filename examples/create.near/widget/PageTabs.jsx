const accountId = props.accountId ?? context.accountId;

const project = props.project ?? Social.getr(`${accountId}/project`);

const featuredWidget = project.featuredWidget || "hack.near/widget/Builders";

if (project === null) {
  return "Loading...";
}

return (
  <>
    <div className="mt-3">
      <div>
        <Widget src={featuredWidget} />
      </div>
    </div>
  </>
);
