const widgetProvider = "frichard5.near";
const refUrl = "https://api.stats.ref.finance/api/ft";

const daoId = props.daoId ?? "multi.sputnik-dao.near";

const WidgetsContainer = styled.div`

`;

// Fetch
const ftList = fetch(refUrl);

// Components

const Balances = (
  <Widget
    src={`${widgetProvider}/widget/account_balance`}
    props={{
      account: daoId,
      ftList: ftList.body && ftList.body,
      widgetProvider,
    }}
  />
);

const NearTransfers = (
  <Widget
    src={`${widgetProvider}/widget/near_transfers`}
    props={{
      account: daoId,
      widgetProvider,
    }}
  />
);

const FTransfers = (
  <Widget
    src={`${widgetProvider}/widget/ft_transfers`}
    props={{
      account: daoId,
      ftList: ftList.body && ftList.body,
      widgetProvider,
    }}
  />
);

const ContractMetrics = (
  <Widget
    src={`${widgetProvider}/widget/contract_metrics`}
    props={{
      account: daoId,
      widgetProvider,
    }}
  />
);

const ProposalStatus = (
  <Widget
    src={`${widgetProvider}/widget/proposals-status`}
    props={{
      account: daoId,
      widgetProvider,
    }}
  />
);

const ProposalsByMonth = (
  <Widget
    src={`${widgetProvider}/widget/proposal-by-month`}
    props={{
      account: daoId,
      widgetProvider,
    }}
  />
);

const Proposals = (
  <Widget
    src={`${widgetProvider}/widget/proposals`}
    props={{
      account: daoId,
      widgetProvider,
    }}
  />
);

const Policy = (
  <Widget
    src={`${widgetProvider}/widget/NDC-policy`}
    props={{
      account: daoId,
      widgetProvider,
    }}
  />
);

const VotersByProposal = (
  <Widget
    src={`${widgetProvider}/widget/NDC-members-voters`}
    props={{
      account: daoId,
      widgetProvider,
    }}
  />
);

const VoteHistory = (
  <Widget
    src={`${widgetProvider}/widget/NDC-vote-history`}
    props={{
      account: daoId,
      widgetProvider,
    }}
  />
);

const Tabs = (
  <Widget
    src="hack.near/widget/DAO.Menu"
    props={{
      tabs: [
        {
          value: "overview",
          label: "Overview",
          selected: true,
          components: (
            <WidgetsContainer>
              {ProposalsByMonth}
              {ProposalStatus}
            </WidgetsContainer>
          ),
        },
        {
          value: "proposals",
          label: "Proposals",
          components: <WidgetsContainer>{Proposals}</WidgetsContainer>,
        },
        {
          value: "treasury",
          label: "Treasury",
          components: (
            <WidgetsContainer>
              {Balances}
              {NearTransfers}
              {FTransfers}
            </WidgetsContainer>
          ),
        },
        {
          value: "members",
          label: "Members",
          components: (
            <WidgetsContainer>
              {VoteHistory}
              {VotersByProposal}
            </WidgetsContainer>
          ),
        },
        {
          value: "policy",
          label: "Policy",
          components: <WidgetsContainer>{Policy}</WidgetsContainer>,
        },
      ],
      widgetProvider,
    }}
  />
);

return <>{Tabs}</>;
