const accountId = props.accountId ?? context.accountId;
const creatorId = props.creatorId ?? "devs.near";
const groupId = props.groupId ?? "builders";

const joined = Social.keys(`${creatorId}/graph/${groupId}/${accountId}/**`);

const requested = Social.keys(`${accountId}/graph/${groupId}/${accountId}/**`);
const numRequested = requested ? Object.keys(requested || {}).length : null;

const isMember = numRequested > 0;

const handleJoin = () => {
  Social.set({
    graph: { [groupId]: { [accountId]: "" } },
    index: {
      graph: JSON.stringify({
        key: groupId,
        value: {
          accountId,
        },
      }),
      notify: JSON.stringify({
        key: creatorId,
        value: {
          accountId,
          message: "membership request",
        },
      }),
    },
  });
};

return (
  <div>
    <div className="m-2 d-flex gap-2 flex-wrap">
      <button disabled={isMember} onClick={handleJoin}>
        Join Group
      </button>
      <a className="btn btn-outline-primary" href="/hack.near/widget/send">
        Learn More
      </a>
    </div>
    <div className="m-2 d-flex gap-2 flex-wrap">
      <a
        className="btn btn-outline-secondary border-0"
        href="/near/widget/ProfilePage?accountId=devs.near"
      >
        <i className="bi bi-person-circle"></i>
      </a>
      <a
        className="btn btn-outline-secondary border-0"
        href="https://www.nearbuilders.com"
      >
        <i className="bi bi-globe"></i>
      </a>
      <a
        className="btn btn-outline-secondary border-0"
        href="https://github.com/NEARbuilders"
      >
        <i className="bi bi-github"></i>
      </a>
      <a
        className="btn btn-outline-secondary border-0"
        href="https://calendar.google.com/calendar/u/0?cid=Y182NGYxNGNkMDFiMWY0MmU1OGE4MTY2MGYyOGVmOWFkZjE4NjdhMTJlNDJiM2UyZDNhMTc3ODczOTYwYjAyNTcwQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20"
      >
        <i className="bi bi-calendar3"></i>
      </a>
      <a
        className="btn btn-outline-secondary border-0"
        href="/hack.near/widget/widgets.rank"
      >
        <i className="bi bi-bookmark-heart"></i>
      </a>
    </div>
  </div>
);
