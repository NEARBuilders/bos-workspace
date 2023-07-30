const widgetOwner = props.widgetOwner ?? "easypoll-v0.ndc-widgets.near";
const src = props.src;
const accountId = props.accountId ?? context.accountId;
const blockHeight = props.blockHeight ?? "final";
const indexVersion = props.indexVersion ?? "4.0.0";

if (!src) {
  return "Please provide poll src";
}

const poll = Social.get(`${src}`, blockHeight);

if (!poll) {
  return "";
}

poll = JSON.parse(poll);
poll.accountId = src.split("/")[0];

const formatData = (input) => {
  let columns = poll.questions.map((v) => {
    return {
      title: v.title,
    };
  });

  columns = [{ title: "User" }, ...columns];
  let data = input.map((v) => {
    let items = Object.values(v.value.answers);
    items = items.map((v) => {
      if (Array.isArray(v)) {
        return v.join(" - ");
      }
      return v;
    });
    return [v.accountId, ...items];
  });

  return {
    input,
    columns,
    data,
  };
};

const Component = ({ data }) => {
  if (!state) {
    State.init({ ...formatData(data) });
  }
  return (
    <>
      <Widget
        src={`${widgetOwner}/widget/EasyPoll.Data.Table`}
        props={{
          columns: state.columns,
          data: state.data,
          title: "Results for: " + poll.title,
        }}
      />
    </>
  );
};

return (
  <Widget
    src={`${widgetOwner}/widget/EasyPoll.Data.GetAnswers`}
    props={{
      src,
      indexVersion,
      poll,
      children: Component,
      loading: () => "Loading..",
      blocking: true,
    }}
  />
);
