const poll = props.poll;
const pollAnswers = props.pollAnswers;
const alreadyVoted = props.alreadyVoted;
const showVoteButton = props.showVoteButton ?? true;

function isActive(poll) {
  return poll.startTimestamp < Date.now() && Date.now() < poll.endTimestamp;
}

function isUpcoming(poll) {
  return poll.startTimestamp > Date.now();
}

const Label = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #000;
  background-color: #ebedee;
  padding: 4px 10px;
  border-radius: 6px;
  margin-top: auto;
  margin-bottom: auto;
`;

const VoteButton = styled.button`
  font-size: 15px;
  font-weight: 600;
  padding: 6px 18px;
  border-radius: 6px;
  border: none;
  transition: 200ms ease;
  width: 100%;

  @media screen and (min-width: 769px) {
    width: auto;
  }

  i {
    margin-right: 4px;
  }

  ${({ voted, view }) => {
    if (voted) {
      return `
        color: #239F28;
        background-color: #ddefeb;
        `;
    }
    if (view) {
      return `
        color: #000;
        background-color: #ffd50d;
        `;
    }
    return `
    color: #fff;
    background-color: #4f46e5;
    background: linear-gradient(90deg, #9333ea 0%, #4f46e5 100%);
    :hover {
        background: linear-gradient(90deg, #792ac0 0%, #423abd 100%);
    }
    :active {
        background: linear-gradient(90deg, #5d2193 0%, #2f2a87 100%);
    }
    `;
  }}
`;

return (
  <div className="d-flex gap-3 flex-wrap">
    <Label>{pollAnswers.length} votes</Label>
    <Label>
      {Date.now() < poll.startTimestamp ||
      (Date.now() > poll.startTimestamp && Date.now() < poll.endTimestamp) ? (
        <span>Ends in</span>
      ) : (
        <span>Ended</span>
      )}
      <Widget
        src={`silkking.near/widget/timeAgo`}
        props={{
          reduced: true,
          timeInFuture: poll.endTimestamp,
        }}
      />
    </Label>
    <Label
      style={{
        backgroundColor: isUpcoming(poll)
          ? "#FFF3B4"
          : isActive(poll)
          ? "#D9FCEF"
          : "#FFE5E5",
        color: isUpcoming(poll)
          ? "#000"
          : isActive(poll)
          ? "#00B37D"
          : "#FF4747",
      }}
    >
      {isUpcoming(poll) ? "Upcoming" : isActive(poll) ? "Active" : "Closed"}
    </Label>

    {!showVoteButton ? null : isUpcoming(poll) || !isActive(poll) ? (
      <VoteButton className="ms-auto" view={true}>
        <i className="bi bi-eye-fill"></i>
        View
      </VoteButton>
    ) : alreadyVoted === true ? (
      <VoteButton className="ms-auto" voted={true}>
        <i className="bi bi-check-lg"></i>
        Voted
      </VoteButton>
    ) : alreadyVoted === false ? (
      <VoteButton className="ms-auto">
        <i className="bi bi-ui-checks-grid"></i>
        Vote
      </VoteButton>
    ) : null}
  </div>
);
