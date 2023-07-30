const widgetProvider = props.widgetProvider;
const account = props.account || "marketing.sputnik-dao.near";
const ftList = props.ftList;
const apiUrl = `https://api.pikespeak.ai/daos/proposals`;
const apiPolicyUrl = `https://api.pikespeak.ai/daos/policy`;
const publicApiKey = "36f2b87a-7ee6-40d8-80b9-5e68e587a5b5";
const daosList = [
  "marketing.sputnik-dao.near",
  "creativesdao.sputnik-dao.near",
  "neardevgov.sputnik-dao.near",
];

const forgeUrl = (apiUrl, params) =>
  apiUrl +
  Object.keys(params).reduce(
    (paramString, p) => paramString + `${p}=${params[p]}&`,
    "?"
  );

const ProposalContainer = styled.div`
  margin-top: 40px;
  min-height: 500px;
`;

const NoProposal = styled.div`
  text-align: center;
  margin-top: 100px;
`;

const resPerPage = 10;

State.init({
  offset: 0,
  lastProposalFetch: [],
  proposals: [],
  isLoading: false,
  types: [],
  account: account,
  status: [],
  fromDate: "",
  toDate: "",
  daos: [account],
});

const columns = [
  {
    id: "submission_time",
    label: "Submission time",
  },
  {
    id: "proposal_id",
    label: "Proposal Id",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "proposal_type",
    label: "type",
  },
];

const nextPage = () => {
  State.update({ offset: state.offset + resPerPage });
};

const previousPage = () => {
  State.update({ offset: state.offset - resPerPage });
};

const GenericTable = (
  <Widget
    src={`${widgetProvider}/widget/generic_table`}
    props={{
      title: `${account} proposals`,
      columns,
      data: state.proposals,
      nextPage,
      previousPage,
      offset: state.offset,
      resPerPage,
    }}
  />
);

const fetchPolicy = (params) => {
  asyncFetch(forgeUrl(apiPolicyUrl, params), {
    mode: "cors",
    headers: {
      "x-api-key": publicApiKey,
    },
  }).then(({ err, body, ok }) => {
    if (ok) {
      State.update({
        policy: body,
      });
    }
  });
};

const fetchProposal = (params) => {
  asyncFetch(forgeUrl(apiUrl, params), {
    mode: "cors",
    headers: {
      "x-api-key": publicApiKey,
    },
  }).then(({ err, body, ok }) => {
    if (ok) {
      const allProposals = [...state.proposals, ...body];
      State.update({
        lastProposalFetch: body,
        proposals: allProposals,
        isLoading: false,
      });
    }
  });
};

if (!state.proposals.length) {
  fetchProposal({
    limit: resPerPage,
    offset: 0,
    proposal_types: state.types,
    status: state.status,
    time_start: state.fromDate,
    time_end: state.toDate,
    daos: state.daos,
  });
  fetchPolicy({ daos: daosList });
}
if (state.account != account) {
  State.update({ proposals: [], account, offset: 0, daos: [account] });
}

const fetchMore = () => {
  if (!state.isLoading) {
    State.update({ offset: state.offset + resPerPage, isLoading: true });
    fetchProposal({
      limit: resPerPage,
      offset: state.offset,
      proposal_types: state.types,
      status: state.status,
      time_start: state.fromDate,
      time_end: state.toDate,
      daos: state.daos,
    });
  }
};

const ProposalCards = [];

state.proposals.forEach((proposal) => {
  ProposalCards.push(
    <Widget
      src={`${widgetProvider}/widget/NDC-proposal-card`}
      props={{
        proposal,
        widgetProvider,
        ftList,
        council:
          state.policy &&
          state.policy
            .filter((pol) => pol.dao_id === proposal.dao_id)
            .map((pol) => {
              return pol.state.policy.roles.find(
                (r) => r.name === "Council" || r.name === "council"
              ).kind;
            })[0],
        voteExpired:
          state.policy &&
          state.policy.filter((pol) => pol.dao_id === proposal.dao_id)[0].state
            .policy.proposal_period,
      }}
    />
  );
});

const selectType = (types) => {
  State.update({
    proposals: [],
    offset: 0,
    types: types,
  });
};

const typeOptions = [
  "Transfer",
  "Vote",
  "FunctionCall",
  "AddBounty",
  "BountyDone",
  "AddMemberToRole",
  "RemoveMemberFromRole",
  "ChangeConfig",
  "ChangePolicy",
  "ChangePolicyUpdateParameters",
  "ChangePolicyUpdateDefaultVotePolicy",
  "ChangePolicyRemoveRole",
  "ChangePolicyAddOrUpdateRole",
  "FactoryInfoUpdate",
  "SetStakingContract",
  "UpgradeRemote",
  "UpgradeSelf",
].map((t) => {
  return {
    value: t,
    label: t,
  };
});
const SelectType = (
  <Widget
    src={`${widgetProvider}/widget/NDC-checkbox-list`}
    props={{
      widgetProvider,
      checkboxes: typeOptions,
      selectedBoxes: state.types,
      onChange: selectType,
      label: "Type",
      id: "proposal-type-selector",
    }}
  />
);

const selectStatus = (status) => {
  State.update({
    status,
    proposals: [],
    offset: 0,
  });
};

const selectDaos = (daos) => {
  State.update({
    daos,
    proposals: [],
    offset: 0,
  });
};

const statusOptions = ["Approved", "Rejected", "InProgress", "Expired"].map(
  (t) => {
    return {
      value: t,
      label: t,
    };
  }
);

const SelectStatus = (
  <Widget
    src={`${widgetProvider}/widget/NDC-checkbox-list`}
    props={{
      widgetProvider,
      checkboxes: statusOptions,
      selectedBoxes: state.status,
      onChange: selectStatus,
      label: "Status",
      id: "proposal-status-selector",
    }}
  />
);

const daosOptions = daosList.map((t) => {
  return {
    value: t,
    label: t.split(".")[0],
  };
});

const SelectDaos = (
  <Widget
    src={`${widgetProvider}/widget/NDC-checkbox-list`}
    props={{
      widgetProvider,
      checkboxes: daosOptions,
      selectedBoxes: state.daos,
      onChange: selectDaos,
      label: "Daos",
      id: "proposal-daos-selector",
    }}
  />
);

const SelectFromDate = (
  <Widget
    src={`${widgetProvider}/widget/NDC-input`}
    props={{
      widgetProvider,
      validate: "date",
      sendInput: (fromDate) => {
        State.update({
          fromDate,
          proposals: [],
          offset: 0,
        });
      },
      placeholder: "yyyy/mm/dd",
      label: "From Date",
    }}
  />
);
const SelectToDate = (
  <Widget
    src={`${widgetProvider}/widget/NDC-input`}
    props={{
      widgetProvider,
      validate: "date",
      sendInput: (toDate) => {
        State.update({
          toDate,
          proposals: [],
          offset: 0,
        });
      },
      placeholder: "yyyy/mm/dd",
      label: "To Date",
    }}
  />
);

const ProposalInfiniteScroll = (
  <Widget
    src={`${widgetProvider}/widget/proposals_scroll`}
    props={{
      cards: ProposalCards,
      fetchMore: fetchMore,
      hasMore: state.lastProposalFetch.length === resPerPage,
    }}
  />
);

const getFilters = () => {
  let filters = [...state.status, ...state.types, ...state.daos];
  if (state.fromDate.length) {
    filters.push(`From: ${state.fromDate}`);
  }
  if (state.toDate.length) {
    filters.push(`From: ${state.toDate}`);
  }
  return filters;
};

const ProposalFilters = (
  <Widget
    src={`${widgetProvider}/widget/NDC-filter-menu`}
    props={{
      widgetProvider,
      comps: [
        SelectDaos,
        SelectType,
        SelectStatus,
        SelectFromDate,
        SelectToDate,
      ],
      filters: getFilters(),
      removeFilter: (filter) => {
        State.update({
          types: [...state.types.filter((t) => t != filter)],
          status: [...state.status.filter((s) => s != filter)],
          daos: [...state.daos.filter((d) => d != filter)],
          fromDate: filter.includes(state.fromDate) ? "" : state.fromDate,
          proposals: [],
          offset: 0,
          limit: resPerPage,
        });
      },
      resetFilters: () => {
        State.update({
          types: [],
          status: [],
          proposals: [],
          offset: 0,
          daos: [state.account],
          limit: resPerPage,
        });
      },
    }}
  />
);

return (
  <ProposalContainer>
    {ProposalFilters}
    {state.proposals.length && state.lastProposalFetch ? (
      ProposalInfiniteScroll
    ) : (
      <NoProposal>No proposal found.</NoProposal>
    )}
  </ProposalContainer>
);
