const Container = styled.div`
  border-radius: 21px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.1) -4px 9px 25px -6px;
  max-width: 860px;
  margin: auto;
  width: 100%;
`;

State.init({
  expandDescription: false,
});

function sliceString(string, newStringLength) {
  if (string.length > newStringLength) {
    return string.slice(0, newStringLength) + "...";
  }
  return string;
}

const widgetOwner = "easypoll-v0.ndc-widgets.near";
const blockHeight = props.blockHeight;
const indexVersion = props.indexVersion;
const poll = props.poll;
const userAnswers = props.userAnswers;
const href = props.href;
const editHref = props.editHref;
const deleteHref = props.deleteHref;
const humansOnly = poll.verifiedHumansOnly;
const isHuman = props.isHuman;
const resultsHref = props.resultsHref ?? "";
const src = props.src;

const Label = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #000;
  background-color: #ebedee;
  padding: 4px 10px;
  border-radius: 6px;
  margin-top: auto;
  margin-bottom: auto;
`;

return (
  <Container>
    <div className="d-flex mb-4">
      <div
        style={{
          height: "inherit",
          backgroundColor: "#ffd50d",
          width: "4px",
          minWidth: "5px",
          marginRight: "0.5rem",
          borderRadius: "8px",
        }}
      >
        {/*Decorative div, do not delete*/}
      </div>
      <h2
        style={{
          fontWeight: "500",
          fontSize: "28px",
          letterSpacing: "-1px",
          color: "#010A2D",
          marginTop: "auto",
          marginBottom: "auto",
          marginRight: "auto",
        }}
      >
        {poll.title}

        {humansOnly && (
          <OverlayTrigger
            placement={"auto"}
            overlay={
              <Tooltip id={`tooltip-iah-${poll.title}`}>
                Only Verified Humans
              </Tooltip>
            }
          >
            <img
              height={36}
              width={36}
              style={{
                marginBottom: 6,
                marginLeft: 6,
              }}
              src="data:image/png;base64,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"
            />
          </OverlayTrigger>
        )}
      </h2>
      <Widget
        src={`${widgetOwner}/widget/EasyPoll.PollMoreOptions`}
        props={{ poll: poll, href: href, editHref, deleteHref }}
      />
    </div>
    <div className="d-flex flex-grow-1 gap-3 flex-wrap justify-content-between align-content-center align-items-center mb-5">
      <Widget
        src={`${widgetOwner}/widget/EasyPoll.UserLabel`}
        props={{ accountId: poll.accountId }}
      />
      <Widget
        src={`${widgetOwner}/widget/EasyPoll.Data.GetAnswers`}
        props={{
          src,
          indexVersion,
          poll,
          children: ({ data }) => (
            <Widget
              src={`${widgetOwner}/widget/EasyPoll.PollTags`}
              props={{
                poll: poll,
                showVoteButton: false,
                pollAnswers: data,
                alreadyVoted: userAnswers.length > 0,
              }}
            />
          ),
          loading: () => "",
          blocking: false,
        }}
      />
    </div>
    {poll.description && (
      <div className="mb-4">
        <h3
          style={{
            fontWeight: "600",
            fontSize: 15,
            color: "#828688",
            opacity: 0.8,
          }}
        >
          Description
        </h3>
        <div
          style={{
            fontSize: "15px",
            maxHeight: "3000px",
            transition: "all 500ms ease",
            overflow: "auto",
          }}
        >
          <Markdown
            text={
              state.expandDescription
                ? poll.description
                : sliceString(poll.description, 300)
            }
          />
        </div>
        {poll.description.length > 300 && state.expandDescription ? (
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
            }}
            onClick={() => State.update({ expandDescription: false })}
            role="button"
          >
            Show less <i className="bi bi-arrow-up"></i>
          </div>
        ) : (
          poll.description.length > 300 && (
            <div
              style={{
                fontSize: "15px",
                fontWeight: 700,
              }}
              onClick={() => State.update({ expandDescription: true })}
              role="button"
            >
              Show more <i className="bi bi-arrow-down"></i>
            </div>
          )
        )}
      </div>
    )}
    {poll.tgLink != "" && poll.tgLink != undefined && (
      <div
        className="mb-4 d-flex justify-content-between"
        style={{
          border: "1.5px solid #4f46e520",
          padding: "12px",
          borderRadius: "16px",
        }}
      >
        <div className="d-flex">
          <i
            className="bi bi-people d-flex align-items-center justify-content-center"
            style={{
              height: "100%",
              aspectRatio: "1",
              backgroundColor: "#4f46e5",
              borderRadius: "14px",
              marginRight: "1rem",
              color: "white",
            }}
          ></i>
          <div>
            <p
              className="m-0"
              style={{
                fontWeight: "600",
                fontSize: 15,
                color: "#828688",
                opacity: 0.8,
              }}
            >
              Discussion link
            </p>
            <h6>
              <a className="w-100 text-truncate" href={poll.tgLink}>
                {poll.tgLink}
              </a>
            </h6>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <a target="_blank" href={poll.tgLink} style={{ userSelect: "none" }}>
            <i className="bi bi-box-arrow-up-right"></i>
          </a>
          <i
            role="button"
            className="bi bi-clipboard"
            style={{
              userSelect: "none",
              marginLeft: "15px",
              color: "#4f46e5",
            }}
            onClick={() => clipboard.writeText(poll.tgLink)}
          ></i>
        </div>
      </div>
    )}
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.Vote`}
      props={{
        poll: poll,
        widgetOwner,
        blockHeight,
        indexVersion,
        userAnswers,
        humansOnly,
        isHuman,
        resultsHref,
        src,
      }}
    />
  </Container>
);
