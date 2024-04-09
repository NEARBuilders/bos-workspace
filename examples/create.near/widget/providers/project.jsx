const projects = VM.require("create.near/widget/data.projects") || [];

const Children = props.children;

return <Children projects={projects} />;
