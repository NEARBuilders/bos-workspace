/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];
const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "create.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };
  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/ABC.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };
  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }
  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }
  if (props.referral) {
    linkProps.referral = props.referral;
  }
  const linkPropsQuery = Object.entries(linkProps)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `#/${nearDevGovGigsWidgetsAccountId}/widget/ABC.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

/* INCLUDE: "communities.jsx" */
const communities = {
  bodega: {
    icon: "https://pbs.twimg.com/profile_images/1633040448175366145/y0afLMb1_400x400.jpg",
    cover:
      "https://pbs.twimg.com/profile_banners/1591547314384035841/1678182210/1080x360",
    title: "Bodega",
    desc: "Dynamic NFT Launchpad & Trait Marketplace",
  },
  nearweek: {
    icon: "https://pbs.twimg.com/profile_images/1590659386132860928/msOLWbog_400x400.jpg",
    cover:
      "https://pbs.twimg.com/profile_banners/1377963859730911232/1668081831/1500x500",
    title: "NEARWEEK",
    desc: "Ecosystem News & Community Platform",
  },
  "mr-brown": {
    icon: "https://pbs.twimg.com/profile_images/1500252631704293376/WgOX5tCA_400x400.png",
    cover:
      "https://pbs.twimg.com/profile_banners/1443067475868860417/1640716128/1080x360",
    title: "Mr. Brown",
    desc: "Thousands of Mr. Brown's Imaginary Selves",
  },
  bluntdao: {
    icon: "https://pbs.twimg.com/profile_images/1533663210531958785/nMdK8_mg_400x400.jpg",
    cover:
      "https://pbs.twimg.com/profile_banners/1486451185804623875/1654488944/1080x360",
    title: "Blunt DAO",
    desc: "IRL Onboarding Movement with Proof of Sesh",
  },
};
/* END_INCLUDE: "communities.jsx" */

if (!props.label) {
  return (
    <div class="alert alert-danger" role="alert">
      Label is required!
    </div>
  );
}

const community = communities[props.label];

const guidePost = Near.view(nearDevGovGigsContractAccountId, "get_post", {
  post_id: community.overviewId,
});
if (!guidePost) {
  return <div>Loading ...</div>;
}

const onMention = (accountId) => (
  <span key={accountId} className="d-inline-flex" style={{ fontWeight: 500 }}>
    <Widget
      src="neardevgov.near/widget/ProfileLine"
      props={{
        accountId: accountId.toLowerCase(),
        hideAccountId: true,
        tooltip: true,
      }}
    />
  </span>
);

const Guide = (
  <div>
    <Markdown
      class="card-text"
      text={guidePost.snapshot.description}
      onMention={onMention}
    ></Markdown>
  </div>
);

return widget("widgets.community.Layout", {
  label: props.label,
  tab: "Guide",
  children: Guide,
});
