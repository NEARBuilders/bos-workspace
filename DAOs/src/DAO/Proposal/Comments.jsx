const daoId = props.daoId ?? "multi.sputnik-dao.near";
const proposalId = props.proposalId;
const commentsCount = props.commentsCount ?? 0;

const item = {
  type: "dao_proposal_comment",
  path: `${daoId}/proposal/main`,
  proposal_id: proposalId + "-beta",
};

const Wrapper = styled.div`
  background: #f8f9fa;
  padding: 24px;
  border-radius: 14px;

  & > div {
    margin-left: 0 !important;
  }
  textarea {
    font-size: 0.9rem !important;
    margin-bottom: 24px !important;
  }

  p {
    margin-bottom: 16px;
  }
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #d7dbdf;
  margin: 16px 0;
`;

return (
  <>
    <Wrapper className="mb-2 w-100">
      <Widget
        src={`near/widget/Comments.Compose`}
        props={{
          item,
          onComment: () => State.update({ showReply: false }),
        }}
      />
      <Hr />
      <Widget
        src={`near/widget/Comments.Feed`}
        props={{
          item,
          subscribe: true,
          widgetProvider: "mob.near",
        }}
      />
      {commentsCount === 0 && (
        <span className="text-muted text-center">
          No comments yet. Be the first to comment!
        </span>
      )}
    </Wrapper>
  </>
);
