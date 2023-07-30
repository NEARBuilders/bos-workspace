const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "multi.sputnik-dao.near";

State.init({
  showCreateProposal: false,
});

const PopupWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  padding: 16px;

  @media (max-width: 600px) {
    padding: 0;
    & > * {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
  }
`;

return (
  <>
    <div className="d-flex justify-content-between flex-wrap mb-3 align-items-center gap-3 pb-3">
      <h3
        className="my-auto"
      >Bounties</h3>
      <Widget
        src="sking.near/widget/Common.Button"
        props={{
          children: (
            <>
              <i className="bi bi-16 bi-plus-lg"></i>
              Propose Bounty
            </>
          ),
          onClick: () => State.update({ ...state, showCreateProposal: true }),
          variant: "success",
        }}
      />
    </div>

    <Widget
      src="sking.near/widget/DAO.Bounty.Claim"
      props={{ daoId: daoId, accountId: accountId }}
    />

    {state.showCreateProposal && (
      <PopupWrapper
        id="create-proposal-popup"
        onClick={(e) => {
          if (e.target.id === "create-proposal-popup") {
            State.update({ ...state, showCreateProposal: false });
          }
        }}
      >
        <Widget
          src={"sking.near/widget/DAO.Bounty.Proposal"}
          props={{
            daoId: daoId,
            accountId: accountId,
            onClose: () =>
              State.update({ ...state, showCreateProposal: false }),
          }}
        />
      </PopupWrapper>
    )}
  </>
);
