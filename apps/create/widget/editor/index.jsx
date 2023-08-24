const projectId = props.projectId;
// State.init({
//   selectedDoc: props.selectedDoc,
// });

// function init() {
//   // When we first load, check if there is a selected document in state
//   const selectedDoc = props.handle["document"].getSelected(projectId);
//   if (selectedDoc) {
//     // If there is, then get the content for it
//     const doc = Storage.privateGet(docId);
//     State.update({
//       selectedDoc: docId,
//       content: doc.content,
//       title: doc.title,
//     });
//   } else {
//     // If there's not, then default to first doc
//     const firstDocPath = [Object.keys(docs)[0]];
//     const firstDocContent = docs[firstDocPath[0]].content;
//     State.update({
//       selectedDoc: firstDocPath,
//       content: firstDocContent,
//       title: firstDocPath.title,
//     });
//   }
// }

// init();

// function init() {
//   const did = props.handle["document"].getSelected(props.projectId);
//   if (did) {
//     props.handle["document"].get(did);
//   }
// }
// init();

/*__@import:QoL/widget__*/

const selectedDoc = props.handle["document"].getSelected(props.projectId);
const doc = props.handle["document"].get(selectedDoc);

return (
  <>
    <p>{JSON.stringify(selectedDoc)}</p>
    <p>{JSON.stringify(doc)}</p>
    {widget("/*__@appAccount__*//widget/editor.ui", {
      projectId: projectId,
      did: selectedDoc,
      ...props,
    })}
  </>
);
