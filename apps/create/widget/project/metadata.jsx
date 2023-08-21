const { project } = props;

/*__@import:QoL/widget__*/

const objectDiff = (a, b) => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  const keys = aKeys.concat(bKeys.filter((item) => aKeys.indexOf(item) < 0));
  const result = {};
  keys.forEach((key) => {
    if (Array.isArray(a[key]) && Array.isArray(b[key])) {
      a[key].forEach((item, index) => {
        if (item !== b[key][index]) {
          result[key] = b[key];
        }
      });
    } else if (
      a[key] &&
      typeof a[key] === "object" &&
      b[key] &&
      typeof b[key] === "object"
    ) {
      result[key] = objectDiff(a[key], b[key]);
    } else if (a[key] != b[key]) result[key] = b[key];
  });
  return result;
};

const handleUpdateProject = (new_project) => {
  const diff = objectDiff(project, new_project);
  // if no diff, return
  if (Object.keys(diff).length === 0) return;

  // TODO: Save project to SocialDB
  console.log("handleUpdateProject", new_project);
};

return widget("/*__@appAccount__*//widget/project.form", {
  handleCreateProject: handleUpdateProject,
  defaultProject: project,
  buttonChildren: "Update Project",
});
