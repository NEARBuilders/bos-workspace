const { id, typeName, proposer, description, kind, statusName } =
  props.proposal;
const { daoId, isAllowedToVote, multiSelectMode, proposal } = props;

const statusColor =
  statusName === "Approved"
    ? "#28a930"
    : statusName === "In Progress"
    ? "#58a1ff"
    : statusName === "Failed"
    ? "#dc3545"
    : "#6c757d";

const statusBackgroundColor =
  statusName === "Approved"
    ? "#ecf7ef"
    : statusName === "Failed" || statusName === "Rejected"
    ? "#fdf4f4"
    : "#fff";

const Wrapper = styled.div`
  background-color: ${statusBackgroundColor};
  margin: 16px auto;
  max-width: 900px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 500px;

  p {
    line-height: 1.4;
    font-weight: 400;
    font-size: 15px;
    color: #868682;
    margin: 0;
  }

  h3 {
    font-weight: 600;
    font-size: 24px;
    color: #1b1b18;
  }

  h5 {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    color: #6c757d;
  }

  .status {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    color: ${statusColor};
  }
`;

const MarkdownContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 24px;
  background-color: #f8f9fa;
  color: #1b1b18;
  border-radius: 14px;
  max-height: 700px;
  overflow-y: auto;
  color: #333;
  line-height: 1.6;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;

  h1 {
    font-size: 2em;
    color: #111;
    border-bottom: 1px solid #ccc;
    padding-bottom: 0.3em;
    margin-bottom: 1em;
  }

  h2 {
    font-size: 1.5em;
    color: #222;
    margin-bottom: 0.75em;
  }

  h3 {
    font-size: 1.3em;
    color: #333;
    margin-bottom: 0.6em;
  }

  h4 {
    font-size: 1.2em;
    color: #444;
    margin-bottom: 0.5em;
  }

  h5 {
    font-size: 1.1em;
    color: #555;
    margin-bottom: 0.4em;
  }

  p {
    font-size: 1em;
    margin-bottom: 1em;
  }

  a {
    color: #0645ad;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

return (
  <Wrapper>
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <h5>Proposal ID: {id}</h5>
        <h3>
          {typeName}
          <a href={proposalURL} target="_blank" rel="noreferrer">
            <i className="bi bi-link-45deg"></i>
          </a>
        </h3>
      </div>
      <div className="d-flex flex-column align-items-end">
        <h5>Status</h5>
        <span className="status">{statusName}</span>
      </div>
    </div>
    <div>
      <h5>Proposer</h5>
      <Widget
        src="mob.near/widget/Profile.ShortInlineBlock"
        props={{ accountId: proposer, tooltip: true }}
      />
    </div>
    <div>
      <h5>Description</h5>
      {typeName === "Vote" || typeName === "Bounty Done" ? (
        <MarkdownContainer>
          <Markdown text={description} />
        </MarkdownContainer>
      ) : (
        <p>{description}</p>
      )}
    </div>
    <div
      className="d-flex flex-wrap align-items-start"
      style={{
        rowGap: "16px",
        columnGap: "48px",
      }}
    >
      <Widget
        src="astro.sking.near/widget/DAO.Proposals.Card.Arguments"
        props={{
          kind,
          daoId,
        }}
      />
    </div>

    <div className="w-100">
      <h5>Votes</h5>
      {multiSelectMode ? (
        <Widget
          src="astro.sking.near/widget/DAO.Proposals.Card.MultiVote"
          props={{
            daoId,
            proposal,
            isAllowedToVote,
            canVote:
              context.accountId &&
              !proposal.votes[context.accountId || ""] &&
              proposal.statusName === "In Progress",
          }}
        />
      ) : (
        <Widget
          src="astro.sking.near/widget/DAO.Proposals.Card.Vote"
          props={{
            daoId: daoId,
            proposal,
            isAllowedToVote,
          }}
        />
      )}
    </div>

    <Widget
      src="sking.near/widget/DAO.Proposal.Additional"
      props={{
        daoId: daoId,
        proposal: proposal,
      }}
    />
  </Wrapper>
);
