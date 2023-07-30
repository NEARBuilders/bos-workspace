const accountId = context.accountId;
const daoId = props.daoId ?? "onboarddao.sputnik-dao.near";
const role = props.role ?? "council";

if (!accountId) {
  return "Please connect your NEAR wallet :)";
}

const handleProposal = () => {
  const gas = 200000000000000;
  const deposit = 100000000000000000000000;
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: "potential member",
          kind: {
            AddMemberToRole: {
              member_id: accountId,
              role: role,
            },
          },
        },
      },
      gas: gas,
      deposit: deposit,
    },
  ]);
};

const Wrapper = styled.div`
  .join-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    height: 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    cursor: pointer;
    background: #FBFCFD;
    border: 1px solid #D7DBDF;
    color: ${props.primary ? "#006ADC" : "#11181C"} !important;
    white-space: nowrap;

    &:hover,
    &:focus {
      background: #ECEDEE;
      text-decoration: none;
      outline: none;
    }

    i {
      display: inline-block;
      transform: rotate(90deg);
      color: #7E868C;
    }
  }
`;

return (
  <Wrapper>
    <button className="join-button" onClick={handleProposal}>
      Ask to Join
    </button>
  </Wrapper>
);
