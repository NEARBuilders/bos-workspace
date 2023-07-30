const src = props.src;
const blocking = props.blocking ?? true;
const poll = props.poll;
const { verifiedHumansOnly, endTimestamp, startTimestamp } = poll;
const indexVersion = props.indexVersion ?? "4.0.0";
const Children = props.children ?? (() => <></>);
const Loading = props.Loading ?? (() => <></>);

let all = Social.index(`easypoll-${indexVersion}-answer`, `${src}`);
if (all === null && blocking) {
  return <Loading />;
} else if (all === null) {
  return <Children data={[]}></Children>;
}

const expensiveWork = () => {
  let filtered = all
    // should be 1 per user
    .map((e) => e["accountId"])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter((e) => all[e])
    .map((e) => all[e])
    //
    .filter((v, i) => {
      // should respect startTimestamp
      if (v.value.timestamp < startTimestamp) return false;
      // should respect endTimestamp
      if (v.value.timestamp > endTimestamp) return false;

      return true;
    });

  let finish = true;
  // should respect human only
  if (verifiedHumansOnly) {
    for (let i = 0; i < filtered.length; i++) {
      const v = filtered[i].accountId;

      const res = Near.view("registry.i-am-human.near", "sbt_tokens_by_owner", {
        account: `${v}`,
        issuer: "fractal.i-am-human.near",
      });

      if (res === null) {
        finish = false;
      }
      const isVerified = res !== null ? res?.[0]?.[1]?.[0] : null;

      if (!isVerified) {
        filtered.splice(i, 1);
        i--;
      }
    }
  }

  if (finish && !state) {
    console.log(
      `Finished filtering answers: ${filtered.length} valid / ${all.length} total`
    );
    State.init({
      filtered,
    });
  }
};

if (!state) {
  expensiveWork();
}

if (!state.filtered && blocking) {
  return <Loading />;
} else if (!state.filtered) {
  return <Children data={[]}></Children>;
}

return <Children data={state.filtered || []}></Children>;
