const accountId = props.accountId ?? context.accountId;
const groupId = props.groupId ?? "526fb256e74eelmf0nw3n5909bc189c13d";
const creatorId = props.creatorId ?? "devs.near";

const groupData =
  props.groupData ?? Social.get(`${accountId}/thing/${groupId}/metadata/**`);

const groupName = groupData["name"];
const image = group.image;

return (
  <div className="group d-inline-block">
    <a
      href={`#/mob.near/widget/group?groupId=${groupId}`}
      className="text-decoration-none link-dark"
    >
      <Widget
        src="devs.near/widget/group.image"
        props={{
          profile,
          accountId,
          groupId,
          className: "float-start d-inline-block me-2",
        }}
      />
      <div className="profile-info d-inline-block" style={{ maxWidth: "16em" }}>
        <div className="profile-name text-truncate">
          {groupName || "nameless group"}
        </div>
        <div className="profile-links d-flex">
          <div className="d-inline-block profile-account text-secondary">
            {groupId}
          </div>
        </div>
      </div>
    </a>
  </div>
);