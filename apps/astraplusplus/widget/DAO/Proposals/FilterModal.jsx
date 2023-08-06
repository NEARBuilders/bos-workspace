const applyFilters = props.applyFilters;
const cancel = props.cancel;
const filters = props.filters ?? {
  proposal_types: [],
  status: "",
  time_start: "",
  time_end: "",
};

State.init({
  filters,
});

const setFilters = (f) => {
  State.update({
    filters: f,
  });
};

const type = {
  operations: [
    {
      title: "Transfer funds",
      value: "Transfer",
    },
    {
      title: "Voting proposal",
      value: "Vote",
    },
    {
      title: "Custom function",
      value: "FunctionCall",
    },
    {
      title: "Issue a new bounty",
      value: "AddBounty",
    },
    {
      title: "Request pay for bounty",
      value: "BountyDone",
    },
    {
      title: "Set staking contract",
      value: "SetStakingContract",
    },
  ],
  policy: [
    {
      title: "Change Policy",
      value: "ChangePolicy",
    },
    {
      title: "Add or Update Role",
      value: "ChangePolicyAddOrUpdateRole",
    },
    {
      title: "Remove Role",
      value: "ChangePolicyRemoveRole",
    },
    {
      title: "ChangePolicyUpdateParameters",
      value: "ChangePolicyUpdateParameters",
    },
    {
      title: "ChangePolicyUpdateDefaultVotePolicy",
      value: "ChangePolicyUpdateDefaultVotePolicy",
    },
  ],
  "Membership & Config": [
    {
      title: "Add member to role",
      value: "AddMemberToRole",
    },
    {
      title: "Remove member from role",
      value: "RemoveMemberFromRole",
    },
    {
      title: "Change Config",
      value: "ChangeConfig",
    },
    {
      title: "Factory Info Update",
      value: "FactoryInfoUpdate",
    },
    {
      title: "Upgrade Remote",
      value: "UpgradeRemote",
    },
    {
      title: "Upgrade Self",
      value: "UpgradeSelf",
    },
  ],
};

const statuss = [
  {
    title: "Approved",
    value: "Approved",
  },
  {
    title: "Rejected",
    value: "Rejected",
  },
  {
    title: "In Progress",
    value: "InProgress",
  },
  {
    title: "Expired",
    value: "Expired",
  },
];

const Wrapper = styled.div`
  .check-subtitle {
    font-size: 12px;
    font-weight: 500;
    color: #999;
    padding: 0 !important;
  }

  .category-title {
    margin: 0px;
    font-size: 14px;
    font-weight: 500;
    color: #999;
    text-transform: capitalize;
    margin-bottom: 6px;
  }

  .filter-title {
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 1.25em;
    color: #222;
    margin-bottom: 12px;
  }
`;

return (
  <Wrapper className="ndc-card p-5 pb-4">
    <h4 className="filter-title">Type</h4>
    <div className="d-flex flex-wrap">
      {Object.keys(type).map((key) => {
        return (
          <div className="d-flex flex-column">
            <h5 className="category-title">{key}</h5>
            {type[key].map((item) => {
              return (
                <Widget
                  src="nearui.near/widget/Input.Checkbox"
                  props={{
                    checked:
                      state.filters.proposal_types.includes(item.value) ||
                      false,
                    onChange: (checked) => {
                      setFilters({
                        ...state.filters,
                        proposal_types: checked
                          ? [...state.filters.proposal_types, item.value]
                          : state.filters.proposal_types.filter(
                              (x) => x !== item.value
                            ),
                      });
                    },
                    label: (
                      <>
                        {item.title}
                        <br />
                        <span className="check-subtitle">
                          {"{" + item.value + "}"}
                        </span>
                      </>
                    ),
                    id: item.value,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
    <h4 className="filter-title mt-4">Status</h4>
    <div className="d-flex flex-wrap">
      {statuss.map((item) => {
        return (
          <Widget
            src="nearui.near/widget/Input.Checkbox"
            props={{
              checked: state.filters.status.includes(item.value) || false,
              onChange: (checked) => {
                setFilters({
                  ...state.filters,
                  status: checked
                    ? [...state.filters.status, item.value]
                    : state.filters.status.filter((x) => x !== item.value),
                });
              },
              label: item.title,
            }}
          />
        );
      })}
    </div>
    <div className="d-flex gap-3 mt-4  flex-wrap">
      <Widget
        src="nearui.near/widget/Input.Text"
        props={{
          value: state.filters.time_start,
          onChange: (value) => {
            setFilters({
              ...state.filters,
              time_start: value,
            });
          },
          label: "From Date",
          inputProps: {
            type: "date",
          },
        }}
      />
      <Widget
        src="nearui.near/widget/Input.Text"
        props={{
          value: state.filters.time_end,
          onChange: (value) => {
            setFilters({
              ...state.filters,
              time_end: value,
            });
          },
          label: "To Date",
          inputProps: {
            type: "date",
          },
        }}
      />
    </div>
    <div className="d-flex justify-content-end mt-5 gap-3">
      <Widget
        src="nearui.near/widget/Input.Button"
        props={{
          children: "Cancel",
          onClick: () => {
            cancel();
          },
          variant: "secondary outline",
          className: "me-auto",
        }}
      />
      <Widget
        src="nearui.near/widget/Input.Button"
        props={{
          children: "Clear",
          onClick: () => {
            setFilters({
              proposal_types: [],
              status: [],
              time_start: "",
              time_end: "",
            });
          },
          variant: "secondary outline",
        }}
      />
      <Widget
        src="nearui.near/widget/Input.Button"
        props={{
          children: "Apply",
          onClick: () => {
            applyFilters(state.filters);
          },
          variant: "secondary",
        }}
      />
    </div>
  </Wrapper>
);
