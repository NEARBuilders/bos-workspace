const daoId = props.daoId;
const proposalsPerPage = props.proposalsPerPage ?? 10; // Number of proposals to fetch at a time

State.init({
  daoId,
  proposals: [],
  lastProposalId: null, // To keep track of the last loaded proposal
  hasMore: true, // Boolean to know if there are more proposals to load
});

const loadProposals = () => {
  const lastProposalId =
    state.lastProposalId !== null
      ? state.lastProposalId
      : Near.view(daoId, "get_last_proposal_id");
  if (lastProposalId === null) return;

  // Prevents multiple calls to loadProposals() before the first call is finished
  if (state.proposals.length > 0 && state.proposals[0].id === lastProposalId)
    return;

  const fromIndex = Math.max(0, lastProposalId - proposalsPerPage + 1); // Ensures fromIndex is never less than 0
  const limit = fromIndex === 0 ? lastProposalId + 1 : proposalsPerPage; // Ensure we don't fetch the same proposals twice if fromIndex is 0

  const newProposals = Near.view(daoId, "get_proposals", {
    from_index: fromIndex,
    limit: limit,
  });
  if (newProposals === null) return;

  console.log("Saving new proposals...");
  State.update({
    ...state,
    hasMore: fromIndex > 0,
    proposals: [...state.proposals, ...newProposals.reverse()],
    lastProposalId: fromIndex - 1,
    isLoading: false,
  });
};

return (
  <>
    <InfiniteScroll loadMore={loadProposals} hasMore={state.hasMore}>
      {state.proposals.map((proposal, i) => {
        if (proposal.status === "Removed") return null;
        return (
          <Widget
            key={i}
            src={"sking.near/widget/DAO.Proposal"}
            props={{
              daoId: state.daoId,
              proposal: proposal,
            }}
          />
        );
      })}
    </InfiniteScroll>
  </>
);
