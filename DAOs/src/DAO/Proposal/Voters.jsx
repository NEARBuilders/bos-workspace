const daoId = props.daoId ?? "multi.sputnik-dao.near";
const votes = props.votes;

const Wrapper = styled.ul`
  background: #f8f9fa;
  border-radius: 14px;
  overflow: hidden;
  padding: 24px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9rem;
    background: #fff;
    padding: 24px 16px;
    gap: 1em;
    border-radius: 14px;

    & > div:last-child {
      text-align: end;
    }
  }

  li.Approve {
    background-color: #59e69220;
    .vote {
      color: #0d562b;
    }
  }
  li.Reject {
    background-color: #e5484d20;
    .vote {
      color: #bf2c30;
    }
  }
  li.Remove {
    background-color: #ffda0920;
    .vote {
      color: #73692d;
    }
  }
`;

return (
  <Wrapper>
    {Object.keys(votes).length === 0 && (
      <span className="text-muted text-center">No votes yet</span>
    )}
    {Object.keys(votes).map((voterId) => {
      const vote = votes[voterId];
      return (
        <li className={vote}>
          <div>
            <Widget
              src="mob.near/widget/Profile.ShortInlineBlock"
              props={{
                accountId: voterId,
                tooltip: true,
              }}
            />
          </div>
          <div>
            voted
            <span className="vote">{vote}</span>
          </div>
        </li>
      );
    })}
  </Wrapper>
);
