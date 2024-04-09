const accountId = "borderlesscommunity.near";

let following = Social.keys(`${accountId}/graph/follow/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

if (following === null) {
  return "Loading";
}

following = Object.entries(following[accountId].graph.follow || {});
following.sort((a, b) => b[1] - a[1]);

const Wrapper = styled.div`
  display: grid;
  gap: 24px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
`;

if (following !== null && following.length === 0) {
  return <Text>This account isn&apos;t following anyone yet.</Text>;
}

return (
  <Wrapper>
    <h5>Following</h5>
    {following.map(([accountId], i) => (
      <Item key={i}>
        <Widget
          src="adminalpha.near/widget/AccountProfile"
          props={{ accountId }}
        />
        <Widget
          src="adminalpha.near/widget/FollowButton"
          props={{ accountId }}
        />
      </Item>
    ))}
  </Wrapper>
);
