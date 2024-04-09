const groupId = props.groupId ?? "526fb256e74eelmf0nw3n5909bc189c13d";
const creatorId = props.creatorId ?? "*";

const group =
  props.group ?? Social.get(`${creatorId}/*/${groupId}/**`, "final");

if (!group) {
  return "";
}

const Container = styled.div`
  background: #fbfbfb;
  padding: 23px;
`;

return (
  <Container>
    <div className="mx-auto">
      <br />
      <div className="m-2">
        <h3 className="mb-3">Members</h3>
        <Widget
          src="devs.near/widget/group.members"
          props={{ groupId, group }}
        />
      </div>
    </div>
  </Container>
);