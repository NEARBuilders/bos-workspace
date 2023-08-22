/**
 * Trying it out like you said and it's awesome.
 */

return (
  <>
    <Widget
      src="create.near/widget/Provider" 
      props={{
        Children: ((p) => <Widget src="create.near/widget/editor.ui" props={p} />),
        ...props,
      }}
    />
  </>
);


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