/**
 * Trying it out like you said and it's awesome.
 */


// This is on our project page, when we click into it, set the id
return (
  <>
    <Widget
      src="create.near/widget/Provider" 
      props={{
        Children: ((p) => <Widget src="create.near/widget/editor.index" props={p} />),
        projectId: 1,
        ...props,
      }}
    />
  </>
);
// You can't do that.


/**
 * I wonder why the below doesn't work, cuz this still looks like something VM.require could do
 * Since the Provider doesn't use State
 * 
 * I think VM.require doesn't track the bos-workspace
 */

// const { Provider } = VM.require("create.near/widget/Module.Provider");

// return (
//   <>
//     <Provider Children={(p) => <Widget src="create.near/widget/editor.ui" props={p} />} {...props} />
//   </>
// );