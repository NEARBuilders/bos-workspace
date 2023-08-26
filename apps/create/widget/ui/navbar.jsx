/*__@import:QoL/widget__*/

const { pages, onPageChange, template } = props;

State.init({
  mobileNavbarOpen: false,
});

const update = (k, v) => State.update({ [k]: v });

return (
  <>
    {widget(
      template ?? "/*__@appAccount__*//widget/templates.ui.navbar.default",
      {
        open: state.mobileNavbarOpen,
        setOpen: (v) => update("mobileNavbarOpen", v),
        pages,
        onPageChange,
      },
    )}
  </>
);
