const daoId = props.daoId;

return (
  <>
    <div>
      <div className="d-flex justify-content-between flex-wrap mb-3 align-items-center gap-3 pb-3">
        <h2 className="my-auto">Proposals</h2>
        <Widget
          src="nui.sking.near/widget/Layout.Modal"
          props={{
            toggle: (
              <Widget
                src="nui.sking.near/widget/Input.Button"
                props={{
                  children: (
                    <>
                      Create Proposal
                      <i className="bi bi-16 bi-plus-lg"></i>
                    </>
                  ),
                  variant: "secondary",
                }}
              />
            ),
            content: (
              <div
                className="d-flex flex-column align-items-stretch"
                style={{
                  width: "800px",
                  maxWidth: "100vw",
                }}
              >
                <Widget
                  src={"sking.near/widget/DAO.Proposal.Create"}
                  props={{
                    daoId: daoId,
                  }}
                />
              </div>
            ),
          }}
        />
      </div>

      <Widget
        src="astro.sking.near/widget/DAO.Proposals.ProposalsPikespeak"
        props={{ daoId: daoId }}
      />
    </div>
  </>
);
