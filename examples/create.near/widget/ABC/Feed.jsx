const hashtag = props.hashtag ?? "abc";

const index = {
  action: "hashtag",
  key: hashtag.toLowerCase(),
  options: {
    limit: 10,
    order: "desc",
    accountId: props.accounts,
  },
};

const renderItem = (a) =>
  (a.value.type === "social" && `${a.accountId}/post/main` === a.value.path && (
    <div key={JSON.stringify(a)} className="mb-3">
      <Widget
        src="create.near/widget/Page.Post"
        props={{ accountId: a.accountId, blockHeight: a.blockHeight }}
      />
    </div>
  )) ||
  (a.value.type === "social" &&
    `${a.accountId}/post/comment` === a.value.path && (
      <div key={JSON.stringify(a)} className="mb-3">
        <Widget
          src="mob.near/widget/MainPage.Comment.Post"
          props={{ accountId: a.accountId, blockHeight: a.blockHeight }}
        />
      </div>
    ));

const PillSelect = styled.div`
  display: inline-flex;
  align-items: center;

  @media (max-width: 600px) {
    width: 100%;

    button {
      flex: 1;
    }
  }
`;

const PillSelectButton = styled.button`
  display: block;
  position: relative;
  border: 1px solid #e6e8eb;
  border-right: none;
  padding: 3px 24px;
  border-radius: 0;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => (p.selected ? "#fff" : "#687076")};
  background: ${(p) => (p.selected ? "#006ADC !important" : "#FBFCFD")};
  font-weight: 600;
  transition: all 200ms;

  &:hover {
    background: #ecedee;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: #006adc !important;
    box-shadow: 0 0 0 1px #006adc;
    z-index: 5;
  }

  &:first-child {
    border-radius: 6px 0 0 6px;
  }
  &:last-child {
    border-radius: 0 6px 6px 0;
    border-right: 1px solid #e6e8eb;
  }
`;

const FeedWrapper = styled.div`
  .post {
    padding-left: 24px;
    padding-right: 24px;

    @media (max-width: 1200px) {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
`;

return (
  <div>
    <Widget
      src="mob.near/widget/FilteredIndexFeed"
      props={{ index, renderItem }}
    />
  </div>
);
