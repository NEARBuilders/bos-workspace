const groupId = props.groupId ?? "526fb256e74eelmf0nw3n5909bc189c13d";

const updates = Social.index("graph", `${groupId}`, {
  limit: 10,
  order: "desc",
  subscribe: true,
});

const index = {
  action: "graph",
  key: groupId,
  options: {
    limit: 10,
    order: "desc",
  },
};

const ItemWrapper = styled.div`
  margin-bottom: 12px;
`;

State.init({
  showDetails: false,
});

const renderItem = (item) => {
  function NotificationButton({ item }) {
    switch (item.value.type) {
      case "add": {
        return (
          <div className="text-truncate col-auto float-right mt-2">
            {context.accountId === item.value.accountId && ( // Context check?
              <Widget
                src="hack.near/widget/accept"
                props={{ groupId, accountId: item.value.accountId }}
              />
            )}
          </div>
        );
      }
      case "join": {
        return (
          <div className="text-truncate col-auto float-right mt-2">
            {item.accountId !== context.accountId && (
              <Widget
                src="hack.near/widget/approve"
                props={{ groupId, accountId: item.accountId }}
              />
            )}
          </div>
        );
      }
      case "create": {
        return (
          <div className="col-auto m-1">
            <Widget
              src="devs.near/widget/group.info"
              props={{
                groupId,
                accountId: item.accountId,
                tooltip: true,
              }}
            />
          </div>
        );
      }
    }
  }

  return (
    <ItemWrapper>
      <div className="d-flex justify-content-between row text-truncate text-muted">
        <div className="text-truncate col-auto">
          <div className="row">
            <div className="col-auto m-1">
              <Widget
                src="mob.near/widget/Profile"
                props={{ accountId: item.accountId, tooltip: true }}
              />
            </div>
            <div className="col-auto m-1 mt-3">
              {item.value.type === "add" && `added`}
              <Widget
                src="mob.near/widget/TimeAgo"
                props={{ blockHeight: item.blockHeight }}
              />
            </div>
            <div className="col-auto m-1">
              <Widget
                src="mob.near/widget/Profile"
                props={{ accountId: item.value.accountId, tooltip: true }}
              />
            </div>
          </div>
        </div>
        <NotificationButton item={item} />
      </div>
    </ItemWrapper>
  );
};

return (
  <div className="m-2">
    <Widget
      src="mob.near/widget/FilteredIndexFeed"
      props={{ index, renderItem }}
    />
  </div>
);
