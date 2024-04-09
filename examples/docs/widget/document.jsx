const { basePath, param, _params } = props;

const { MarkdownViewer } = VM.require("devs.near/widget/markdown.view") || {
  MarkdownViewer: () => null,
};

const { get } = VM.require("${config_account}/widget/utils.adapter");

const data = get(_params.path); // this is our adapter

if (!data) {
  return <p>Page not found</p>;
}

return (
  <div className="content">
    <h1>{data.title}</h1>
    <MarkdownViewer value={data.content} />
  </div>
);
