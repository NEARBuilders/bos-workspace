
const { basePath, param, _params } = props;

const { get } = VM.require("${config_account}/widget/adapter");

const content = get(_params.path); // this is our adapter

return <p>{JSON.stringify(content)}</p> // this is our view