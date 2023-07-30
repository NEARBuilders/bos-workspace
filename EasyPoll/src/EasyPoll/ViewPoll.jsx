const widgetOwner = props.widgetOwner ?? "easypoll-v0.ndc-widgets.near";
const src = props.src;
const href = props.href;
const editHref = props.editHref;
const accountId = props.accountId ?? context.accountId;
const tabs = props.tabs;
const indexVersion = props.indexVersion ?? "4.0.0";
const isHuman = props.isHuman;
const blockHeight = props.blockHeight ?? "final";
const showDraft = props.showDraft ?? false;
const isLoggedIn = accountId ? true : false;

if (!src) {
  return "Please provide poll src";
}

const poll = Social.get(`${src}`, blockHeight);
if (poll === null) {
  return "Loading...";
}
if (poll === undefined) {
  return "404 Poll not found";
}

// pretify
console.log("poll", poll);

poll = JSON.parse(poll);
poll.accountId = src.split("/")[0];

let userAnswers = isLoggedIn
  ? Social.index(`easypoll-${indexVersion}-answer`, `${src}`, {
      accountId: accountId,
    })
  : [];
if (!userAnswers) return "";

return (
  <>
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.PollDetails`}
      props={{
        href: tabs.VIEW_POLL.href(src, blockHeight),
        editHref: tabs.EDIT_POLL.href(src, blockHeight),
        resultsHref: tabs.RESULTS.href(src, blockHeight),
        deleteHref: tabs.DELETE_POLL.href(src, blockHeight),
        widgetOwner,
        blockHeight: blockHeight,
        isHuman,
        poll: poll,
        userAnswers: userAnswers,
        indexVersion,
        src,
      }}
    />
  </>
);
