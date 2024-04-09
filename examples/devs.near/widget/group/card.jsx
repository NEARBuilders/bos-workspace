const creatorId = props.creatorId;
const groupId = props.groupId;

const groupInfo = Social.get(
  `${creatorId}/thing/${groupId}/metadata/**`,
  "final"
);

if (!groupInfo) {
  return "group details not found";
}

const canJoin = props.canJoin ?? true;

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #eceef0;
  box-shadow:
    0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);
  overflow: hidden;
  padding: 16px;
`;

const Bell = styled.div`
  .bell {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .bell-icon {
    font-size: 23px;
    color: #000;
    margin-left: 5px;
    text-decoration: none;
    transition: color 0.3s ease-in-out;
  }

  .bell-icon:hover {
    color: #000;
  }

  .bell-icon .bi-bell {
    display: inline;
  }

  .bell-icon .bi-bell-fill {
    display: none;
  }

  .bell-icon:hover .bi-bell {
    display: none;
  }

  .bell-icon:hover .bi-bell-fill {
    display: inline;
  }
`;

const CardLeft = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
  min-width: 0;

  > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
  }
`;

const TextLink = styled.a`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 18px;
  color: ${(p) => (p.bold ? "#11181C !important" : "#687076 !important")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "visible")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "unset")};
  white-space: nowrap;
  outline: none;

  &:focus,
  &:hover {
    text-decoration: underline;
  }
`;

const TagsWrapper = styled.div`
  padding-top: 4px;
`;

return (
  <Card>
    <a
      href={`/devs.near/widget/group.page?groupId=${groupId}&creatorId=${creatorId}`}
      style={{ textDecoration: "none" }}
    >
      <CardLeft>
        <Widget
          src="devs.near/widget/group.inline"
          props={{ group: groupInfo, groupId, accountId: creatorId }}
        />
      </CardLeft>
    </a>
    <Bell>
      <div className="ms-autome-md-2 d-flex align-items-center">
        <div className="bell">
          <a
            href={`/devs.near/widget/group.index?groupId=${groupId}`}
            className="bell-icon"
          >
            <i className="bi bi-bell"></i>
            <i className="bi bi-bell-fill"></i>
          </a>
        </div>
      </div>
    </Bell>
    {canJoin && context.accountId && (
      <>
        {groupKey === context.accountId && (
          <a
            className="btn btn-outline-dark"
            href={`/devs.near/widget/group.edit?groupId=${groupId}`}
          >
            edit
          </a>
        )}
        <Widget
          src="devs.near/widget/group.join"
          props={{ groupId, accountId, creatorId: props.creatorId }}
        />
      </>
    )}
  </Card>
);
