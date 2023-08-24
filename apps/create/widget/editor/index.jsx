/*__@import:QoL/widget__*/
/*__@import:everything/utils/debounce__*/

const { project: projectId, handle } = props;

const path = handle["document"].getSelected(projectId);
const doc = handle["document"].get(path);

const on = {
  change: (k, v) => {
    debounce(() => handle["document"].update(projectId, path, { [k]: v }));
  },
  publish: () => handle["document"].publish(projectId, path),
};

return widget("/*__@appAccount__*//widget/editor.ui", {
  path,
  doc,
  on,
  ...props,
});
