const accountId = context.accountId;

if (!accountId) {
  return "Please log in with a NEAR account to edit your group.";
}

let group = Social.getr(`${accountId}/group`);

if (group === null) {
  return "Loading";
}

State.init({
  group,
});

return (
  <div className="row">
    <div className="col-lg-6">
      <div>
        <h2>Edit Group</h2>
      </div>
      <div className="mb-2">
        <Widget
          src="mob.near/widget/MetadataEditor"
          props={{
            initialMetadata: group,
            onChange: (profile) => State.update({ group }),
            options: {
              name: { label: "Group Name" },
              image: { label: "Group Image" },
              backgroundImage: { label: "Background Image" },
              description: { label: "About Your Group" },
              tags: {
                label: "Group Tags",
                tagsPattern: "*/group/tags/*",
                placeholder: "near, category, topic, project, event",
              },
              linktree: {
                links: [
                  {
                    label: "Twitter",
                    prefix: "https://twitter.com/",
                    name: "twitter",
                  },
                  {
                    label: "Github",
                    prefix: "https://github.com/",
                    name: "github",
                  },
                  {
                    label: "Telegram",
                    prefix: "https://t.me/",
                    name: "telegram",
                  },
                  {
                    label: "Website",
                    prefix: "https://",
                    name: "website",
                  },
                ],
              },
            },
          }}
        />
      </div>
      <div className="mb-2">
        <CommitButton data={{ group: state.group }}>Save group</CommitButton>
        <a
          className="btn btn-outline-primary ms-2"
          href={`#/create.near/widget/Group?accountId=${accountId}`}
        >
          View group
        </a>
      </div>
    </div>
    <div className="col-lg-6">
      <div>
        <Widget
          src="create.near/widget/Connect"
          props={{ accountId, group: state.group }}
        />
      </div>
    </div>
  </div>
);
