const accountId = "borderlesscommunity.near";

let supporters = Social.keys(`*/graph/follow/${accountId}`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

if (supporters === null) {
  return "Loading";
}

supporters = Object.entries(supporters || {});
supporters.sort(
  (a, b) => b.graph.follow[accountId][1] - a.graph.follow[accountId][1]
);

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

if (supporters !== null && supporters.length === 0) {
  return <Text>This account doesn&apos;t have any supporters yet.</Text>;
}

return (
  <Wrapper>
    <h5>Supporters</h5>
    {supporters.map(([accountId], i) => (
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
