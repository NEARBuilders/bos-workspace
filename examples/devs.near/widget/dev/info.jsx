const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "build.sputnik-dao.near";
const role = props.role ?? "community";

let isBuilder = false;
let widgets = Social.get(`${accountId}/widget/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});
let widgetCount = 0;
if (widgets) {
  widgetCount = Object.keys(widgets).length;
}
if (widgetCount > 0) {
  isBuilder = true;
}

const policy = Near.view(daoId, "get_policy");

if (policy === null) {
  return "";
}

const groups = policy.roles
  .filter((role) => role.name === "community")
  .map((role) => {
    const group = role.kind.Group;

    return group;
  });

const isMember = groups.map((group) => {
  return !group
    ? false
    : group.filter((address) => address === accountId).length > 0;
})?.[0];

return (
  <div>
    <div className="m-2 d-flex gap-2 flex-wrap">
      {!isMember ? (
        <a
          className="btn btn-outline-primary"
          href="https://wallet.near.org/linkdrop/v2.keypom.near/4japszHTmC37t94Ep47d16DfPWx3A83BMExt26iH4YgnjDtHJGwpXokeZQoxuogKCvagzAF4DN2wW8ePZvwKKCyj"
        >
          Join Community
        </a>
      ) : (
        <a
          className="btn btn-outline-primary"
          href="#/devs.near/widget/dev.community"
        >
          View Page
        </a>
      )}
      <a className="btn btn-outline-primary" href="#/hack.near/widget/Academy">
        Learn More
      </a>
    </div>
    <div className="m-2 d-flex gap-2 flex-wrap">
      <a
        className="btn btn-outline-secondary border-0"
        href="#/mob.near/widget/ProfilePage?accountId=devs.near"
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
        href="#/devs.near/widget/dev.config"
      >
        <i className="bi bi-gear-fill"></i>
      </a>
    </div>
  </div>
);
