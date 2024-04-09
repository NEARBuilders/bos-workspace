const { basePath, param, _params } = props;

const { get } = VM.require("${config_account}/widget/utils.adapter");

const data = get(_params.path); // this is our adapter

if (!data) {
  return <p>Page not found</p>;
}



return (
  <div className="content">
    <h1>{data.title}</h1>
    <p>{data.content}</p>
    {/* {content.sections.map((section) => (
      <div key={section.title}>
        <h2>{section.title}</h2>
        {section.subsections.map((subsection) => (
          <div key={subsection.title}>
            <h3>{subsection.title}</h3>
            <p>{subsection.content}</p>
          </div>
        ))}
      </div>
    ))} */}
  </div>
);
