const accountId = props.accountId ?? context.accountId ?? "devs.near";

const profile = props.profile ?? Social.getr(`${accountId}/profile`);

const name = profile.name;
const description = profile.description;
const tags = Object.keys(profile.tags ?? {});

return (
  <div className="d-flex flex-row">
    <Widget
      src="mob.near/widget/ProfileImage"
      props={{
        metadata,
        accountId,
        widgetName,
        style: { height: "3em", width: "3em", minWidth: "3em" },
        className: "me-2",
      }}
    />
    <div className="text-truncate">
      <div className="text-truncate">
        <span className="fw-bold">{name}</span>{" "}
        <small>
          <span className="font-monospace">@{accountId}</span>
        </small>
      </div>
      <div className="text-truncate text-muted">
        {tags.length > 0 && (
          <>
            {tags.map((tag, i) => (
              <span
                key={i}
                className="me-1 fw-light badge border border-secondary text-bg-light"
              >
                #{tag}
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  </div>
);
