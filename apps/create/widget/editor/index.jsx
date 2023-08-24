/*__@import:QoL/widget__*/
const projectId = props.projectId;
const selectedDoc = props.handle["document"].getSelected(props.projectId);
const doc = props.handle["document"].get(selectedDoc);

return (
  <>
    {widget("/*__@appAccount__*//widget/editor.ui", {
      projectId: projectId,
      did: selectedDoc,
      doc: doc,
      ...props,
    })}
  </>
);
