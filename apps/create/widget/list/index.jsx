State.init({
  version: "1",
});

let data = [];
switch (state.version) {
  case "1": {
    data = Social.get("*/thing/docs/metadata/**");
    break;
  }
  case "2": {
    data = Social.index("every", "efiz.near/type/docs", { limit: "10" });
    break;
  }
}

return (
  <div>
    <div>
      <button onClick={() => State.update({ version: "1" })}>1</button>
      <button onClick={() => State.update({ version: "2" })}>2</button>
    </div>
    <div>{JSON.stringify(data)}</div>
  </div>
);
