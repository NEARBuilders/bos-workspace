const accountId = props.accountId ?? context.accountId;
if (!accountId) {
  return "Please log in with NEAR :)";
}

const link =
  props.link &&
  (props.link === true
    ? `#/create.near/widget/Group?accountId=${accountId}`
    : props.link);

const group = props.group ?? Social.getr(`${accountId}/group`);

if (group === null) {
  return "Loading";
}

const showEditButton =
  group !== undefined &&
  (!props.group || props.showEditButton) &&
  accountId &&
  accountId === context.accountId;

const name = group.name || "Nameless Group";
const image = group.image;
const backgroundImage = group.backgroundImage;
const tags = Object.keys(group.tags ?? {});

const nameHeader = <h4 className="mt-0 mb-0 text-truncate">{name}</h4>;

return (
  <div className="bg-white shadow rounded overflow-hidden">
    <div className="px-4 pt-0 pb-5 bg-dark position-relative">
      {backgroundImage && (
        <Widget
          src="mob.near/widget/Image"
          props={{
            image: backgroundImage,
            alt: "profile background",
            className: "position-absolute w-100 h-100",
            style: { objectFit: "cover", left: 0, top: 0 },
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm",
          }}
        />
      )}
      {showEditButton && (
        <a
          href="#/create.near/widget/GroupEditor"
          className="btn mt-4 btn-outline-light float-end position-relative"
          style={{ zIndex: 1 }}
        >
          Edit group
        </a>
      )}
      <div
        className="profile-picture d-inline-block"
        style={{ transform: "translateY(7rem)" }}
      >
        <Widget
          src="create.near/widget/GroupImage"
          props={{
            profile,
            accountId,
            style: { width: "10rem", height: "10rem" },
            className: "mb-2",
            imageClassName: "rounded-circle w-100 h-100 img-thumbnail d-block",
            thumbnail: false,
          }}
        />
      </div>
    </div>
    <div className="bg-light px-4 pb-4">
      <div className="d-md-flex justify-content-between pt-3 mb-2">
        <div style={{ paddingTop: "3rem" }}>
          <div className="me-2 d-sm-flex gap-1 flex-row align-items-center">
            <div className="me-2 position-relative">
              {link ? (
                <a
                  className="text-truncate text-dark stretched-link"
                  href={link}
                >
                  {nameHeader}
                </a>
              ) : (
                nameHeader
              )}
              <div className="small text-truncate">
                <Widget
                  src="create.near/widget/MemberBadge"
                  props={{ accountId }}
                />
              </div>
            </div>
            <div>
              <Widget
                src="create.near/widget/JoinButton"
                props={{ accountId }}
              />
            </div>
          </div>
          <div>
            <Widget src="create.near/widget/GroupStats" props={{ accountId }} />
          </div>
        </div>
      </div>
    </div>
  </div>
);
