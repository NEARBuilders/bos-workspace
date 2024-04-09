const accountId = props.accountId ?? context.accountId;
const groupId = props.groupId ?? "526fb256e74eelmf0nw3n5909bc189c13d";

const group =
  props.group ?? Social.get(`${accountId}/thing/${groupId}/metadata/**`);

const name = group.name;
const description = group.description;
const tags = Object.keys(group.tags ?? {});

const Tag = styled.a`
  color: black;
  text-decoration: none;

  &:hover {
    color: blue;
    text-decoration: none;
  }
`;


return (
  <div className="d-flex flex-row">
    <Widget
      src="devs.near/widget/group.image"
      props={{
        group,
        widgetName,
        style: { height: "3.4em", width: "3.4em", minWidth: "3.4em" },
        className: "me-3",
      }}
    />
    <div className="text-truncate">
      <div className="text-truncate">
        <span className="fw-bold" style={{ color: "black" }}>
          {group.name}
        </span>
      </div>
      <div className="text-truncate text-muted">
        {tags.length > 0 && (
          <>
            {tags.map((tag, i) => (
              <span
                key={i}
                className="me-1 fw-light badge border border-secondary text-bg-light"
              >
                <a
                  href={`/devs.near/widget/every.group?tag=${tag}`}
                  style={{ textDecoration: "none" }}
                  className="no-text-decoration"
                >
                  <Tag>#{tag}</Tag>
                </a>
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  </div>
);
