const { project } = props;

const widgetToFork = "/*__@appAccount__*//widget/p";
let widgetCode = Social.get(widgetToFork);

if (widgetCode === null) return <></>;
if (!widgetCode)
  return "Something went wrong. Please reach out to sking.near or efiz.near";

widgetCode = widgetCode.replace(
  /const final_id = "\?\?replace_with_id\?\?";/,
  `const final_id = "${project.id}";\n`,
);
widgetCode = widgetCode.replace(
  /const final_by = "\?\?replace_with_account\?\?";/,
  `const final_by = "${context.accountId}";`,
);

State.init({
  widgetName: project.title.replace(/[^a-zA-Z0-9]/g, ""),
});

return (
  <>
    <h3>Settings</h3>
    <h5>Deploy to your own account</h5>
    <p>
      If you want to access your project from your own account, instead of
      having a long URL.
    </p>
    Widget name:
    <input
      type="text"
      value={state.widgetName}
      onChange={(e) => State.update({ widgetName: e.target.value })}
      className="mb-3"
    />
    <Widget
      src="/*__@replace:nui__*//widget/Input.Button"
      props={{
        children: "Deploy",
        variant: "primary",
        onClick: () => {
          Social.set({
            widget: {
              [state.widgetName]: { "": widgetCode },
            },
          });
        },
      }}
    />
    <p className="my-3">Widget code to deploy</p>
    <Markdown
      text={`
        \`\`\`jsx
        ${widgetCode}
        \`\`\`
        `}
    />
  </>
);
