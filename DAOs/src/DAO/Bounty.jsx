const accountId = props.accountId ?? context.accountId;

const daoId = props.daoId ?? "multi.sputnik-dao.near";

const bountyId = props.bountyId;

let bounty = props.bounty && JSON.parse(JSON.stringify(props.bounty));

// if bounty is not provided and bountyId and daoId are provided then fetch bounty
if (!bounty && bountyId && daoId) {
  let new_bounty = Near.view(daoId, "get_bounty", {
    id: Number(bountyId),
  });
  if (new_bounty) {
    bounty = new_bounty;
  } else if (new_bounty === null) {
    return "Loading...";
  } else {
    return "bounty not found, check console for details.";
  }
} else if (!bounty) {
  return "Please provide a bounty or bountyId.";
}

State.init({
  showSubmitPopup: false,
});

// ==============================
// Functions
// ==============================

const handleClaim = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "bounty_claim",
      args: {
        id: JSON.parse(bounty.id),
        deadline: bounty.max_deadline,
      },
      deposit: 100000000000000000000000,
      gas: 150000000000000,
    },
  ]);
};

const handleUnclaim = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "bounty_giveup",
      args: {
        id: JSON.parse(bounty.id),
      },
      gas: 150000000000000,
    },
  ]);
};

// ==============================
// Styled Components
// ==============================

const Wrapper = styled.div`
  margin: 16px auto;
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  display: flex;
  flex-direction: column;
  gap: 24px;

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
    font-size: 16px;
    font-weight: 500;
    line-height: 1.2;
    color: #6c757d;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
  }

  .status {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    color: ${statusColor};
  }
`;

const CardFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #eceef0;
`;

const Button = styled.div`
  width: 100%;
`;

const MarkdownContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 24px;
  background-color: #f8f9fa;
  color: #1b1b18;
  border-radius: 16px;
  max-height: 800px;
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
    font-size: 1em !important;
    margin-bottom: 1em !important;
  }

  a {
    color: #0645ad;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

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

const claims = Near.view(daoId, "get_bounty_claims", {
  account_id: accountId,
});

const number_of_claims = Near.view(daoId, "get_bounty_number_of_claims", {
  id: JSON.parse(bounty.id),
});

function humanReadableTime(timestamp) {
  let seconds = Math.floor(timestamp / 1000000000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  minutes = minutes % 60;
  hours = hours % 24;

  let result = "";
  if (days > 0) {
    result += `${days} days `;
  }
  if (hours > 0) {
    result += `${hours} hrs `;
  }
  if (minutes > 0) {
    result += `${minutes} mins`;
  }

  return result;
}

const bountyURL = `/#/sking.near/widget/DAO.Page?daoId=${daoId}&tab=bounty&bountyId=${bounty.id}`;

return (
  <Wrapper>
    <div className="w-100">
      <h5>
        Bounty ID: {bounty.id}{" "}
        <a
          href={bountyURL}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: "1.3rem",
          }}
        >
          <i className="bi bi-link-45deg"></i>
        </a>
      </h5>
      <MarkdownContainer>
        <Markdown text={bounty.description} />
      </MarkdownContainer>
    </div>
    <div className="d-flex flex-wrap gap-5">
      <div>
        <h5>Amount</h5>
        <Widget
          src="sking.near/widget/Common.TokenAmount"
          props={{
            amountWithoutDecimals: bounty.amount,
            address: bounty.token,
          }}
        />
      </div>
      <div>
        <h5>Maximum Time to Complete</h5>
        <p>{humanReadableTime(bounty.max_deadline)}</p>
      </div>
    </div>
    <CardFooter>
      {!claims.length > 0 && (
        <Widget
          src="sking.near/widget/Common.Button"
          props={{
            children: (
              <>
                Claim ({bounty.times - number_of_claims}/{bounty.times} left)
              </>
            ),
            onClick: handleClaim,
            disabled: number_of_claims >= bounty.times,
          }}
        />
      )}
      {claims.length > 0 && (
        <Widget
          src="sking.near/widget/Common.Button"
          props={{
            children: <>Submit</>,
            onClick: () => {
              State.update({
                ...state,
                showSubmitPopup: true,
              });
            },
          }}
        />
      )}
      {claims.length > 0 && (
        <Widget
          src="sking.near/widget/Common.Button"
          props={{
            children: <>Unclaim</>,
            onClick: handleUnclaim,
          }}
        />
      )}
    </CardFooter>

    {state.showSubmitPopup && (
      <PopupWrapper
        id="submit-work-popup"
        onClick={(e) => {
          if (e.target.id === "submit-work-popup") {
            State.update({ ...state, showSubmitPopup: false });
          }
        }}
      >
        <Widget
          src={"sking.near/widget/DAO.Bounty.SubmitWork"}
          props={{
            daoId: daoId,
            accountId: accountId,
            bountyId: bounty.id,
            onClose: () => State.update({ ...state, showSubmitPopup: false }),
          }}
        />
      </PopupWrapper>
    )}
  </Wrapper>
);
