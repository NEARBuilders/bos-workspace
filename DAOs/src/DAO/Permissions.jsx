const roles = ["all", "council", "dev"];

const rights = {
  AddMemberToRole: {
    title: "Add Member To Role",
    description:
      "Add member to given role in the policy. This is short cut to updating the whole policy.",
  },
  RemoveMemberFromRole: {
    title: "Remove Member From Role",
    description:
      "Remove member to given role in the policy. This is short cut to updating the whole policy.",
  },
  Vote: {
    title: "Text Vote",
    description: "Just a text vote, with no outcome execution.",
  },
  FunctionCall: {
    title: "Function Call",
    description:
      "Calls a smart contract with list of method names in a single promise.",
  },
  Transfer: {
    title: "Transfer",
    description: "Transfer NEAR or a fungible token to another account.",
  },
  AddBounty: {
    title: "Create a Bounty",
    description: "Add new bounty.",
  },
  BountyDone: {
    title: "Bounty Done",
    description: "Indicates that given bounty is done by given user.",
  },
  ChangeConfig: {
    title: "Change Config",
    description: "Change the DAO config",
  },
  ChangePolicy: {
    title: "Change Policy",
    description: "Change the DAO policy",
  },
  ChangePolicyAddOrUpdateRole: {
    title: "Add Or Update Role",
    description:
      "Add new role to the policy. If the role already exists, update it. This is short cut to updating the whole policy.",
  },
  ChangePolicyRemoveRole: {
    title: "Remove Role",
    description:
      "Remove role from the policy. This is short cut to updating the whole policy.",
  },
  ChangePolicyUpdateDefaultVotePolicy: {
    title: "Update Default Vote Policy",
    description:
      "Update the default vote policy from the policy. This is short cut to updating the whole policy.",
  },
  ChangePolicyUpdateParameters: {
    title: "Update DAO Parameters",
    description:
      "Update the parameters from the policy. This is short cut to updating the whole policy.",
  },
  UpgradeSelf: {
    title: "Upgrade Self",
    description: "Upgrade the DAO smart contract code.",
  },
  UpgradeRemote: {
    title: "Upgrade Remote",
    description: "Upgrade another smart contract.",
  },
  SetStakingContract: {
    title: "Set Staking Contract",
    description:
      "Set the staking contract. Can only be proposed if staking contract is not set yet",
  },
  FactoryInfoUpdate: {
    title: "Factory Info Update",
    description: "Change information about factory and auto update.",
  },
};

// Generate default permisisons
// note: if you want different default permissions, you can change them here, they will not be overwritten
// note 2: if you want to disable changing a right for a role, you can set disable to true

let defaultPermissions = {
  council: {
    ChangeConfig: {
      value: true,
      disabled: true,
    },
    ChangePolicy: {
      value: true,
      disabled: true,
    },
    RemoveMemberFromRole: {
      value: true,
      disabled: true,
    },
    AddMemberToRole: {
      value: true,
      disabled: true,
    },
  },
};

roles.forEach((role) => {
  if (defaultPermissions[role] === undefined) defaultPermissions[role] = {};
  Object.keys(rights).forEach((right) => {
    if (defaultPermissions[role][right] !== undefined) return;
    defaultPermissions[role][right] = {
      value: false,
    };
  });
});

State.init({
  permissions: defaultPermissions,
});

const handleChange = (role, right, value) => {
  console.log(role, right, value);
  State.update({
    permissions: {
      ...state.permissions,
      [role]: {
        ...state.permissions[role],
        [right]: {
          ...state.permissions[role][right],
          value,
        },
      },
    },
  });
};

const Wrapper = styled.div`
  border-radius: 4px;
  max-width: 1200px;
  width: 100%;

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  li {
    flex: 1;
    display: grid;
    grid-template-columns: minmax(100px, 2fr) repeat(
        auto-fit,
        minmax(40px, 1fr)
      );
    padding: 1rem;
    min-height: 90px;
    align-items: center;

    &:nth-child(odd) {
      background: #f5f5f5;
    }
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }

  h3 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
  }

  p {
    font-size: 0.8rem;
    color: #666;
    margin: 0;
  }

  .roles {
    padding: 0;
    margin: auto;
    text-align: center;
  }

  li label {
    display: none;
  }

  @media (max-width: 600px) {
    li {
      display: flex;
      flex-wrap: wrap;
    }
    li > div:first-child {
      margin-bottom: 1rem;
      flex: 1;
      min-width: 100%;
    }
    li label {
      display: block;
    }
    .roles {
      padding: 8px;
    }
    .hide-on-mobile {
      display: none;
    }
  }
`;

const Row = ({ right, roles, key }) => (
  <li>
    <div>
      <h3>{right.title}</h3>
      <p>{right.description}</p>
    </div>
    {roles.map((role) => (
      <div className="roles">
        <Widget
          src="sking.near/widget/Common.Inputs.Checkbox"
          props={{
            label: role,
            onChange: (checked) => {
              handleChange(role, key, checked);
            },
            defaultChecked: defaultPermissions[role][key].value,
            disabled: defaultPermissions[role][key].disabled,
          }}
        />
      </div>
    ))}
  </li>
);

return (
  <Wrapper>
    <ul>
      <li>
        <div>
          <h2>Permissions</h2>
        </div>
        {roles.map((role) => (
          <h3 className="roles hide-on-mobile">{role}</h3>
        ))}
      </li>
      {Object.keys(rights).map((key) => (
        <Row roles={roles} right={rights[key]} key={key} />
      ))}
    </ul>
  </Wrapper>
);
