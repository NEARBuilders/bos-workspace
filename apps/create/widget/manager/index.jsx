/*__@import:QoL/widget__*/

const projectsObj = props.handle["project"].getAll();
const projects = Object.keys(projectsObj || {}).map((k) => ({
  ...projectsObj[k].data,
  template: projectsObj[k].template.src,
  id: k,
}));

return widget("/*__@appAccount__*//widget/manager.ui", {
  handleCreateProject: props.handle["project"].create,
  projects,
  navigate: props.navigate,
});
