State.init({ profile: {} });

const size = props.size ?? "md";

let profile = Social.getr(`${props.accountId}/profile`);
if (JSON.stringify(profile) != JSON.stringify(state.profile)) {
  State.update({ profile: profile });
}
if (state.profile == {}) {
  return "Loading";
}

if (!profile) {
  profile = {
    image:
      "https://i.near.social/thumbnail/https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm",
    name: props.accountId,
  };
}

const A = styled.a`
  :hover p.hoverLink {
    color: #4f46e5 !important;
  }

  img {
    vertical-align: baseline;
  }
`;

function makeAccountIdShorter(accountId) {
  if (accountId.length > 50) {
    return accountId.slice(0, 50) + "...";
  }
  return accountId;
}

return (
  <A
    className="d-flex text-decoration-none align-items-center"
    href={`#/mob.near/widget/ProfilePage?accountId=${props.accountId}`}
    target="_blank"
  >
    <Widget
      src="mob.near/widget/ProfileImage"
      props={{
        profile,
        accountId: props.accountId,
        className: "float-start d-inline-block me-2",
        imageClassName: "rounded-circle w-100 h-100",
        style: {
          width: size === "sm" ? 20 : 36,
          height: size === "sm" ? 20 : 36,
        },
      }}
    />
    <div>
      <p
        style={{
          margin: "0",
          fontWeight: "700",
          fontSize: size === "sm" ? 12 : 15,
          textDecotarion: "none",
          color: "#000",
        }}
        className="hoverLink"
      >
        {profile == {}
          ? "Loading"
          : profile != undefined
          ? makeAccountIdShorter(profile.name)
          : makeAccountIdShorter(props.accountId)}
      </p>
      {size !== "sm" && (
        <p
          style={{
            margin: "0",
            fontWeight: "500",
            textDecoration: "none",
            fontSize: "15px",
            color: "#828688",
            opacity: 0.8,
            lineHeight: 0.85,
          }}
        >
          {makeAccountIdShorter(props.accountId)}
        </p>
      )}
    </div>
  </A>
);
