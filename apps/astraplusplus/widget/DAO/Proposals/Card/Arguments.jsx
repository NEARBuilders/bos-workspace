const daoId = props.daoId;
const kind = props.kind;

const proposal_type = typeof kind === "string" ? kind : Object.keys(kind)[0];

if (proposal_type === "Vote") return "";

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

if (proposal_type === "Transfer")
  return (
    <>
      <div>
        <h5>Amount</h5>
        <Widget
          src="sking.near/widget/Common.TokenAmount"
          props={{
            amountWithoutDecimals: kind.Transfer.amount,
            address: kind.Transfer.token_id,
          }}
        />
      </div>
      <div>
        <h5>Receiver</h5>
        <Widget
          src="mob.near/widget/Profile.ShortInlineBlock"
          props={{
            accountId: kind.Transfer.receiver_id,
            tooltip: true,
          }}
        />
      </div>
    </>
  );

if (proposal_type === "FunctionCall") {
  return (
    <>
      {kind.FunctionCall.actions.reduce(
        (acc, { method_name, args, deposit }) => {
          return acc.concat(
            <div
              className="d-flex flex-wrap align-items-start w-100"
              style={{
                columnGap: "48px",
                rowGap: "16px",
              }}
            >
              <div>
                <h5>Smart Contract Address</h5>
                <p>{kind.FunctionCall.receiver_id}</p>
              </div>
              <div>
                <h5>Method Name</h5>
                <p>{method_name}</p>
              </div>
              <div>
                <h5>Deposit</h5>
                <Widget
                  src="sking.near/widget/Common.TokenAmount"
                  props={{
                    amountWithoutDecimals: deposit,
                    address: "",
                  }}
                />
              </div>
              <div className="w-100">
                <h5>Arguments</h5>
                <Markdown
                  // Decode the args (Base64) to String then Parse the Json then format it and display it as markdown code
                  text={
                    "```json\n" +
                    JSON.stringify(
                      JSON.parse(Buffer.from(args, "base64").toString("utf8")),
                      null,
                      2,
                    ) +
                    "\n```"
                  }
                />
              </div>
            </div>,
          );
        },
        [],
      )}
    </>
  );
}

if (
  proposal_type === "AddMemberToRole" ||
  proposal_type === "RemoveMemberFromRole"
)
  return (
    <>
      <div>
        <h5>Member</h5>
        <Widget
          src="mob.near/widget/Profile.ShortInlineBlock"
          props={{
            accountId: kind[proposal_type].member_id,
            tooltip: true,
          }}
        />
      </div>
      <div>
        <h5>Role</h5>
        <p>{kind[proposal_type].role}</p>
      </div>
    </>
  );

if (proposal_type === "AddBounty")
  return (
    <>
      <div>
        <h5>Amount</h5>
        <Widget
          src="sking.near/widget/Common.TokenAmount"
          props={{
            amountWithoutDecimals: kind.AddBounty.bounty.amount,
            address: kind.AddBounty.bounty.token,
          }}
        />
      </div>
      <div>
        <h5>Times</h5>
        <p>{kind.AddBounty.bounty.times}</p>
      </div>
      <div>
        <h5>Deadline</h5>
        <p>{new Date(kind.AddBounty.bounty.max_deadline).toLocaleString()}</p>
      </div>
      <div className="w-100">
        <h5>Bounty Description</h5>
        <MarkdownContainer>
          <Markdown text={kind.AddBounty.bounty.description} />
        </MarkdownContainer>
      </div>
    </>
  );

if (proposal_type === "BountyDone")
  return (
    <>
      <div>
        <h5>Receiver</h5>
        <Widget
          src="mob.near/widget/Profile.ShortInlineBlock"
          props={{
            accountId: kind.BountyDone.receiver_id,
            tooltip: true,
          }}
        />
      </div>
      <div>
        <h5>Bounty ID</h5>
        <p>{kind.BountyDone.bounty_id}</p>
      </div>
    </>
  );

function deepSortObject(obj) {
  if (typeof obj !== "object" || obj === null) {
    // Return non-object values as is
    return obj;
  }

  if (Array.isArray(obj)) {
    // If the input is an array, recursively sort each element
    return obj.map(deepSortObject).sort();
  }

  const sortedObject = {};
  const sortedKeys = Object.keys(obj).sort((keyA, keyB) => {
    // Compare keys in a case-insensitive manner
    return keyA.toLowerCase().localeCompare(keyB.toLowerCase());
  });

  for (const key of sortedKeys) {
    sortedObject[key] = deepSortObject(obj[key]);
  }

  return sortedObject;
}

// TODO: ChangePolicy component need some UI improvements to be more readable
if (proposal_type === "ChangePolicy") {
  const old_policy = Near.view(daoId, "get_policy");
  if (old_policy === null) return "";
  return (
    <>
      <div className="w-100">
        <h5>Policy Changes</h5>
        <div
          className="w-100"
          style={{
            maxHeight: "400px",
            overflow: "auto",
          }}
        >
          <Widget
            src="bozon.near/widget/CodeDiff"
            props={{
              prevCode: JSON.stringify(deepSortObject(old_policy), null, 2),
              currentCode: JSON.stringify(
                deepSortObject(kind.ChangePolicy.policy),
                null,
                2,
              ),
            }}
          />
        </div>
      </div>
    </>
  );
}
