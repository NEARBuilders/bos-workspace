const accountId = context.accountId;
const daoId = props.daoId ?? "multi.sputnik-dao.near";
const vote_counts = props.proposal.vote_counts ?? {
  // yes, no, spam
  community: [3, 0, 2],
  council: [1, 6, 0],
};

const userVote = props.proposal.votes[accountId];
const isAllowedToVote = props.isAllowedToVote ?? [true, true, true];
const canVote =
  isAllowedToVote[0] &&
  isAllowedToVote[1] &&
  isAllowedToVote[2] &&
  !userVote &&
  props.proposal.statusName === "In Progress" &&
  accountId;
const yesWin = props.proposal.statusName === "Approved";
const noWin = props.proposal.statusName === "Rejected";

let totalYesVotes = 0;
let totalNoVotes = 0;
let totalSpamVotes = 0;
Object.keys(vote_counts).forEach((key) => {
  totalYesVotes += vote_counts[key][0];
  totalNoVotes += vote_counts[key][1];
  totalSpamVotes += vote_counts[key][2];
});
const totalVotes = totalYesVotes + totalNoVotes + totalSpamVotes;

// Functions

const handleApprove = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "act_proposal",
      args: {
        id: JSON.parse(props.proposal.id),
        action: "VoteApprove",
      },
      gas: 200000000000000,
    },
  ]);
};

const handleReject = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "act_proposal",
      args: {
        id: JSON.parse(props.proposal.id),
        action: "VoteReject",
      },
      gas: 200000000000000,
    },
  ]);
};

const handleSpam = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "act_proposal",
      args: {
        id: JSON.parse(props.proposal.id),
        action: "VoteRemove",
      },
      gas: 200000000000000,
    },
  ]);
};

const VoteButton = styled.button`
  border-radius: 20px;
  border: none;
  display: flex;
  padding: 0;
  position: relative;
  background: rgb(128 128 128 / 13%);
  width: 100%;
  margin-bottom: 14px;
  cursor: pointer;

  .button {
    border-radius: 20px;
    padding: 12px 20px;
    text-align: left;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.4s ease-in-out;
    text-align: center;
    display: flex;
    justify-content: center;
    min-width: 90px;
    width: 90px;

    @media (max-width: 600px) {
      justify-content: start;
    }
  }

  .vote {
    opacity: 0;
    transition: all 0.4s ease-in-out;
    max-width: 0;
    display: block;
    margin-right: 3px;
    position: relative;
    z-index: 1;
  }

  .votes {
    text-align: right;
    padding: 12px 16px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;
    color: rgb(27, 27, 24);
  }

  .preview {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 20px;
    transition: all 0.4s ease-in-out;
    z-index: 0;
  }

  &:hover {
    .button {
      width: 100%;
    }
    .vote {
      opacity: 1;
      max-width: 100px;
    }
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.8;

    .vote {
      opacity: 0;
      max-width: 0;
    }

    &.yes .button {
      width: ${(totalYesVotes / totalVotes) * 100 || 0}%;
    }
    &.no .button {
      width: ${(totalNoVotes / totalVotes) * 100 || 0}%;
    }
    &.spam .button {
      width: ${(totalSpamVotes / totalVotes) * 100 || 0}%;
    }
  }

  &.yes {
    .button {
      background-color: #59e692;
      color: #000;
    }
    .preview {
      background-color: #59e69220;
      width: ${(totalYesVotes / totalVotes) * 100 || 0}%;
    }
  }

  &.no {
    .button {
      background-color: #e5484d;
      color: #fff;
    }
    .preview {
      background-color: #e5484d20;
      width: ${(totalNoVotes / totalVotes) * 100 || 0}%;
    }
  }

  &.spam {
    .button {
      background-color: #ffda09;
      color: #000;
    }
    .preview {
      background-color: #ffda0920;
      width: ${(totalSpamVotes / totalVotes) * 100 || 0}%;
    }
  }
`;

return (
  <>
    <VoteButton onClick={handleApprove} disabled={!canVote} className="yes">
      <span className="button">
        <span className="vote">Vote </span> Yes
      </span>
      <span className="votes">
        <span className="preview" />
        {totalYesVotes} Votes (
        {Math.round((totalYesVotes / totalVotes) * 100 || 0)}%)
      </span>
    </VoteButton>
    <VoteButton onClick={handleReject} disabled={!canVote} className="no">
      <span className="button no">
        <span className="vote">Vote </span> No
      </span>
      <span className="votes">
        <span className="preview" />
        {totalNoVotes} Votes (
        {Math.round((totalNoVotes / totalVotes) * 100 || 0)}%)
      </span>
    </VoteButton>
    <VoteButton onClick={handleSpam} disabled={!canVote} className="spam">
      <span className="button spam">
        <span className="vote">Vote </span> Spam
      </span>
      <span className="votes">
        <span className="preview" />
        {totalSpamVotes} Votes (
        {Math.round((totalSpamVotes / totalVotes) * 100 || 0)}%)
      </span>
    </VoteButton>
  </>
);
