const indexVersion = props.indexVersion ?? "4.0.0";
const filterByUser = props.filterByUser;
const skipHumanVericationFor = props.skipHumanVericationFor;
const onlyVerifiedHumans = props.onlyVerifiedHumans ?? true;
const onlyOfficialNDCPolls = props.onlyOfficialNDCPolls ?? true;
const blackList = props.blackList;
const tabs = props.tabs;
const customKeys = props.customKeys;
const type = props.type ?? "poll"; // draft, poll, official

const INITIAL_PAGE = 0;
const PAGE_SIZE = 15;
const widgetOwner = "easypoll-v0.ndc-widgets.near";

State.init({
  currentPage: INITIAL_PAGE,
});

const onPageChange = (pageNumber) => {
  pageNumber = pageNumber - 1;
  if (pageNumber === state.currentPage) {
    console.log(`Selected the same page number as before: ${pageNumber}`);
    return;
  }
  State.update({
    currentPage: pageNumber,
  });
};

const getFirstSBTToken = (accountId) => {
  const view = Near.view("registry.i-am-human.near", "sbt_tokens_by_owner", {
    account: accountId,
    issuer: "fractal.i-am-human.near",
  });
  return view?.[0]?.[1]?.[0];
};

const shouldDisplayUserQuestions = (accountId) => {
  if (blackList) {
    return !blackList.includes(accountId);
  }
  if (onlyVerifiedHumans) {
    return (
      getFirstSBTToken(accountId) !== undefined ||
      skipHumanVericationFor.includes(accountId)
    );
  }
  return true;
};

let keys = `*/easypoll-${indexVersion}/${type}/*`;

if (filterByUser) {
  keys = filterByUser.map((v) => {
    return `${v}/easypoll-${indexVersion}/${type}/*`;
  });
}

if (customKeys) {
  keys = customKeys;
}

let results = Social.keys(keys, "final", {
  return_type: "BlockHeight",
});
console.log("results", results);
if (!results) {
  return "Loading...";
}

const polls_keys = [];

// TODO: should cache the logic bellow in state, polls_keys can be huge
Object.keys(results).forEach((accountId) => {
  return Object.keys(results[accountId][`easypoll-${indexVersion}`]).forEach(
    (poll_type) => {
      return Object.keys(
        results[accountId][`easypoll-${indexVersion}`][poll_type]
      ).forEach((pollId) => {
        polls_keys.push({
          accountId,
          pollId,
          blockHeight:
            results[accountId][`easypoll-${indexVersion}`][poll_type][pollId],
          type: poll_type,
        });
      });
    }
  );
});
polls_keys = polls_keys.sort((a, b) => b.blockHeight - a.blockHeight); // desc
polls_keys = polls_keys.filter((p) => shouldDisplayUserQuestions(p.accountId));

const start = state.currentPage * PAGE_SIZE;
const end = start + PAGE_SIZE;
const paginated_polls_keys = polls_keys.slice(start, end);

return (
  <>
    <div className="d-flex flex-column gap-4 mb-3">
      {paginated_polls_keys.map((p) => {
        const src = `${p.accountId}/easypoll-${indexVersion}/${p.type}/${p.pollId}`;
        return (
          <Widget
            src={`${widgetOwner}/widget/EasyPoll.PollCard`}
            props={{
              src: src,
              blockHeight: p.blockHeight,
              href: tabs.VIEW_POLL.href(src, p.blockHeight),
              editHref: tabs.EDIT_POLL.href(src, p.blockHeight),
              deleteHref: tabs.DELETE_POLL.href(src, p.blockHeight),
              indexVersion,
              onlyOfficialNDCPolls,
              topLabel: p.type === "draft" ? "Draft" : undefined,
            }}
          />
        );
      })}
    </div>
    {paginated_polls_keys.length < 1 && (
      <div>Looks like there are no polls to show.</div>
    )}
    {polls_keys.length > PAGE_SIZE && (
      <Widget
        src={`${widgetOwner}/widget/Common.Paginate`}
        props={{
          totalCount: polls_keys.length,
          pageSize: PAGE_SIZE,
          onPageChange,
          currentPage: state.currentPage + 1,
        }}
      />
    )}
  </>
);
