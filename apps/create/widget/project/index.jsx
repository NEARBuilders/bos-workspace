const projectID = props.project;

if (!projectID) {
  return <div>Please specify a project ID</div>;
}

const handleUpdateProject = (new_project) => {
  props.handle["project"].update(projectID, new_project);
};

const projectRaw = props.handle["project"].get(projectID);

if (projectRaw === null) return "";
if (!projectRaw) return "Project not found";

const project = {
  id: projectID,
  ...projectRaw.data,
  tags: Object.keys(projectRaw.data.tags || {}),
  templateSrc: projectRaw.template.src,
  theme: projectRaw.template.theme,
};

return (
  <Widget
    src="/*__@appAccount__*//widget/project.ui"
    props={{ ...props, project: project }}
  />
);
