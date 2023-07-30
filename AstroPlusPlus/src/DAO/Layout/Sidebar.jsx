const daoId = props.daoId ?? "";
const profile = daoId ? Social.get(`${daoId}/profile/**`, "final") : {};

const Sidebar = styled.div`
  position: relative;
  z-index: 5;
  margin-top: -55px;

  @media (max-width: 1024px) {
    margin-top: -40px;
  }
`;

return (
  <Sidebar>
    <Widget
      src="hack.near/widget/DAO.Page.Sidebar"
      props={{
        daoId,
        profile,
      }}
    />
  </Sidebar>
);
