const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "build.sputnik-dao.near";

const profile = props.profile ?? Social.getr(`${accountId}/profile`);

if (profile === null) {
  return "Loading...";
}

const Text = styled.p`
  font-family: "Courier", sans-serif;
  font-size: ${(p) => p.size ?? "16px"};
  line-height: ${(p) => p.lineHeight ?? "1.5"};
  font-weight: ${(p) => p.weight ?? "400"};
  color: ${(p) => p.color ?? "#000"};
  margin-bottom: 23px;
  max-width: 670px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

return (
  <>
    <div className="m-2">
      <div className="tab-content">
        <Text>
          <h3>Build Community</h3>
        </Text>
        <div className="tab-pane fade in show active" role="tabpanel">
          <Widget
            src="near/widget/FollowersList"
            props={{ accountId: daoId }}
          />
        </div>
      </div>
    </div>
  </>
);
