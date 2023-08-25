/*__@import:QoL/widget__*/

const { pages, onPageChange, template } = props;

State.init({
  mobileNavbarOpen: false,
});

const update = (k, v) => State.update({ [k]: v });

return (
  <>
  {/* I'm passing in a template that could be configured in the app provider? */}
    {widget(template ?? "/*__@appAccount__*//widget/templates.ui.navbar.default", {
      open: state.mobileNavbarOpen,
      setOpen: (v) => update("mobileNavbarOpen", v),
      pages,
      onPageChange
    })}
  </>
);
