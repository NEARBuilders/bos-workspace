const { pages, onPageChange, template } = props;

State.init({
  mobileNavbarOpen: false,
});

const update = (k, v) => State.update({ [k]: v });

return (
  <>
    <Widget
      src={template ?? "create.near/widget/templates.ui.navbar.default"}
      props={{
        open: state.mobileNavbarOpen,
        setOpen: (v) => update("mobileNavbarOpen", v),
        pages,
        onPageChange,
      }}
    />
  </>
);
