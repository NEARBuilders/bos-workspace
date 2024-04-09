const index = {
  action: "graph",
  key: "connect",
  options: {
    subscribe: true,
    limit: 50,
    order: "desc",
  },
};

const Item = styled.div`
  text-overflow: ellipsis;
  overflow-x: hidden;
`;

const renderItem = (a) => (
  <Item key={JSON.stringify(a)} className="mb-2">
    <Widget
      src="create.near/widget/Group"
      props={{ accountId: a.accountId, hideAccountId: true, tooltip: true }}
    />
    <span className="text-muted">
      {a.value.type === "connect" ? "joined" : "left"}
    </span>
    <Widget
      src="create.near/widget/GroupLine"
      props={{
        accountId: a.value.accountId,
        hideAccountId: true,
        tooltip: true,
      }}
    />
    <span className="text-muted">
      <Widget
        src="mob.near/widget/TimeAgo"
        props={{ blockHeight: a.blockHeight }}
      />
    </span>
  </Item>
);

return (
  <div>
    <Widget src="mob.near/widget/IndexFeed" props={{ index, renderItem }} />
  </div>
);
