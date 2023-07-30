const proposal = props.proposal;
const isAllowedToVote = props.isAllowedToVote;
const daoId = props.daoId;
const canVote = props.canVote;

const STORAGE_KEY = "proposalsMultiVote";
const STORAGE = Storage.get(STORAGE_KEY);
const selectedVote = STORAGE[daoId][proposal.id];

const handleClick = (e) => {
  const [proposalId, vote] = e.target.value.split(",");

  // using Storage.privateSet instead of State to avoid re-rendering everything
  // using daoId as key so that the storage doesn't grow indefinitely
  Storage.set(STORAGE_KEY, {
    [daoId]: {
      ...STORAGE[daoId],
      [proposalId]: vote,
    },
  });
};

const Wrapper = styled.div`
  .form-check {
    padding: 6px 14px;
    border-radius: 16px;
    color: #000;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    cursor: pointer;

    &.disabled {
      cursor: not-allowed !important;
      opacity: 0.7;

      label {
        cursor: not-allowed !important;
      }
    }

    input {
      margin: 0 !important;
    }

    label {
      flex: 1;
      font-weight: 600;
      cursor: pointer;
    }

    &:first-child {
      background-color: #82e29930;

      &.active {
        background-color: #82e299;
      }
    }
    &:nth-child(2) {
      background-color: #ff646430;

      &.active {
        background-color: #ff6464;
      }
    }
    &:nth-child(3) {
      background-color: #ffd50d30;

      &.active {
        background-color: #ffd50d;
      }
    }
  }
`;

return (
  <Wrapper>
    {["Yes", "No", "Spam"].map((option, index) => {
      return (
        <div
          key={index}
          className={`form-check ${
            Number(selectedVote) === index ? "active" : ""
          } ${!isAllowedToVote[index] ? "disabled" : ""} ${
            canVote ? "" : "disabled"
          }`}
        >
          <input
            className="form-check-input"
            type="radio"
            value={[proposal.id, index]}
            id={`vote-p-${proposal.id}-${index}`}
            checked={Number(selectedVote) === index}
            onClick={handleClick}
            disabled={!isAllowedToVote[index] || !canVote}
          />
          <label
            className="form-check-label"
            htmlFor={`vote-p-${proposal.id}-${index}`}
          >
            {option}
          </label>
        </div>
      );
    })}
  </Wrapper>
);
