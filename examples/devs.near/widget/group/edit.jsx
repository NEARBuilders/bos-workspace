const { handleClose } = props;

const creatorId = props.creatorId ?? context.accountId;

if (!creatorId) {
  return "Please connect your NEAR account :)";
}

const groupId = props.groupId ?? "526fb256e74eelmf0nw3n5909bc189c13d";

const groupData =
  props.group ?? Social.get(`${creatorId}/thing/${groupId}/**`, "final");

if (!groupData) {
  return "";
}

const groupKey = Object.keys(groupData)[0];

const initMembers =
  props.members ?? Social.get(`${creatorId}/graph/${groupId}/**`, "final");

if (!initMembers) {
  return "";
}

State.init({
  group: groupData,
  members: initMembers,
  newMember: "",
  isDao: false,
});

function addMember(newMember) {
  State.update({
    members: { ...state.members, [newMember]: "" },
  });
}

function removeMember(memberKey) {
  const updatedMembers = { ...state.members };
  delete updatedMembers[memberKey];

  State.update({
    members: updatedMembers,
  });
}

function isNearAddress(address) {
  if (typeof address !== "string") {
    return false;
  }
  if (!address.endsWith(".near")) {
    return false;
  }
  const parts = address.split(".");
  if (parts.length !== 2) {
    return false;
  }
  if (parts[0].length < 2 || parts[0].length > 32) {
    return false;
  }
  if (!/^[a-z0-9_-]+$/i.test(parts[0])) {
    return false;
  }
  return true;
}

const memberId = props.memberId ?? state.newMember;

const isValid = isNearAddress(memberId);

const handleSave = () => {
  Social.set({
    thing: {
      [groupId]: {
        "": JSON.stringify(state.group),
        metadata: {
          ...state.group,
          type: {
            group: {
              src: "every.near/type/group",
              blockHeight: "final",
            },
          },
        },
      },
    },

    graph: {
      [groupId]: {
        ...state.members,
      },
    },
    index: {
      every: JSON.stringify({
        key: "group",
        value: {
          id: groupId,
        },
      }),
      graph: JSON.stringify(
        Object.keys(state.members).map((account) => ({
          key: groupId,
          value: {
            type: "add",
            accountId: account,
          },
        }))
      ),
      notify: JSON.stringify(
        Object.keys(state.members)
          .filter((it) => initMembers.includes(it))
          .map((account) => ({
            key: account,
            value: {
              type: "add",
            },
          }))
      ),
    },
  });
};

return (
  <>
    <p>{JSON.stringify(group)}</p>
    {groupData && (
      <div className="row">
        <div className="col-lg-6">
          <h5 className="mb-3">Details</h5>
          <Widget
            src="devs.near/widget/group.card"
            props={{ groupId, canJoin: false }}
          />
          <div className="mb-2 mt-3">
            <Widget
              src="near/widget/MetadataEditor"
              props={{
                initialMetadata: group,
                onChange: (group) => State.update({ group }),
                options: {
                  name: {
                    label: "Name",
                    placeholder: `${group[groupKey].thing[groupId].metadata.name}`,
                  },
                  image: { label: "Logo" },
                  description: { label: "About" },
                  tags: {
                    label: "Tags",
                    tagsPattern: `*/${groupId}/tags/*`,
                    placeholder: "art, gov, edu, dev, com, nft, ai, social",
                  },
                  linktree: {
                    links: [
                      {
                        label: "Twitter",
                        prefix: "https://twitter.com/",
                        name: "twitter",
                      },
                      {
                        label: "Github",
                        prefix: "https://github.com/",
                        name: "github",
                      },
                      {
                        label: "Telegram",
                        prefix: "https://t.me/",
                        name: "telegram",
                      },
                      {
                        label: "Website",
                        prefix: "https://",
                        name: "website",
                      },
                    ],
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="col-lg-6">
          <h5 className="mb-3">Members</h5>
          <div>
            Account ID
            <input
              label="input each member's account ID here, then click `add` below"
              placeholder="<example>.near"
              onChange={(e) => State.update({ newMember: e.target.value })}
            />
            <div className="d-flex align-items-center mt-2">
              <button
                className="btn btn-primary m-2"
                onClick={() => addMember(state.newMember)}
              >
                add
              </button>
              <button className="btn btn-success m-2" onClick={handleSave}>
                save
              </button>
            </div>
          </div>
          <div>
            {Object.keys(state.members).map((a) => {
              return (
                <div className="d-flex m-2 p-2 justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Widget
                      src="mob.near/widget/Profile"
                      props={{ accountId: a }}
                    />
                  </div>
                  <button
                    className="btn btn-danger m-1"
                    onClick={() => removeMember(a)}
                  >
                    remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}
  </>
);
