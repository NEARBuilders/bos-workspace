const widgetOwner = widgetOwner ?? "easypoll-v0.ndc-widgets.near";
const blockHeight = props.blockHeight ?? "final";
const tabs = props.tabs;
const src = props.src;

State.init({});

console.log("aa", src.split("/"));
const onDelete = () => {
  const [accountId, key, type, uid] = src.split("/");

  const commit = {
    [key]: {
      [type]: { [uid]: null },
    },
  };

  State.update({ commitLoading: true });
  Social.set(commit, {
    force: true,
    onCommit: () => {
      State.update({ commitLoading: false, committed: true });
    },
    onCancel: () => {
      State.update({ commitLoading: false });
    },
  });
};

const Container = styled.div`
  border-radius: 21px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.1) -4px 9px 25px -6px;
  max-width: 860px;
  margin: auto;
  width: 100%;
  background: #fafbfb;
`;

if (state.committed) {
  return (
    <Container
      className="text-center d-flex flex-column align-items-center"
      style={{
        padding: "60px 12px",
        color: "#dc3545",
      }}
    >
      <i
        className="bi bi-trash"
        style={{
          fontSize: 60,
        }}
      />
      <span
        style={{
          fontWeight: "bold",
          fontsize: 15,
          color: "#dc3545",
        }}
      >
        Deleted Successfully!
      </span>
      <a
        href={`#/${widgetOwner}/widget/EasyPoll`}
        className="text-decoration-none"
      >
        <Widget
          src="rubycop.near/widget/NDC.StyledComponents"
          props={{
            Button: {
              text: "Take Me Home",
              icon: <i className="bi bi-house" />,
              className:
                "d-flex primary flex-row-reverse  mt-4 gap-2 align-items-center",
              onClick: onSubmit,
            },
          }}
        />
      </a>
    </Container>
  );
}

if (state.commitLoading) {
  return (
    <Container
      className="text-center"
      style={{
        padding: "60px 12px",
      }}
    >
      <Widget
        src={`easypoll-v0.ndc-widgets.near/widget/Common.Spinner`}
        props={{
          color1: "#ffd50d",
          color2: "#4f46e5",
        }}
      />
      <span
        style={{
          fontWeight: "bold",
          fontsize: 15,
          color: "#4f46e5",
          textAlign: "center",
        }}
      >
        Deleting...
      </span>
    </Container>
  );
}

return (
  <div className="d-flex p-2 gap-3 flex-column">
    <h3>Are you sure you wanna delete this poll?</h3>
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.PollCard`}
      props={{
        src: src,
        blockHeight: blockHeight,
        href: tabs.VIEW_POLL.href(src, p.blockHeight),
        editHref: tabs.EDIT_POLL.href(src, p.blockHeight),
        deleteHref: tabs.DELETE_POLL.href(src, p.blockHeight),
      }}
    />
    <div className="d-flex gap-4 justify-content-end">
      <a
        href={`#/${widgetOwner}/widget/EasyPoll`}
        className="text-decoration-none"
      >
        <Widget
          src="rubycop.near/widget/NDC.StyledComponents"
          props={{
            Button: {
              text: "No, Take Me Home",
              icon: <i className="bi bi-house" />,
              className:
                "d-flex primary flex-row-reverse  mt-3 gap-2 align-items-center",
              onClick: () => {},
            },
          }}
        />
      </a>
      <Widget
        src="rubycop.near/widget/NDC.StyledComponents"
        props={{
          Button: {
            text: "Yes, Delete It",
            icon: <i className="bi bi-trash" />,
            className:
              "d-flex mt-3 gap-2  flex-row-reverse align-items-center bg-danger text-white",
            onClick: onDelete,
          },
        }}
      />
    </div>
  </div>
);
