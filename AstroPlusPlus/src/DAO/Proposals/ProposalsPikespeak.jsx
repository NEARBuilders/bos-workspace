const daoId = props.daoId;
const proposalsPerPage = props.proposalsPerPage ?? 10; // Number of proposals to fetch at a time

const apiUrl = `https://api.pikespeak.ai/daos/proposals`;
const publicApiKey = "36f2b87a-7ee6-40d8-80b9-5e68e587a5b5";
const resPerPage = 10;

const defaultMultiSelectMode = Storage.privateGet("multiSelectMode");

if (defaultMultiSelectMode === null) return "";
console.log(defaultMultiSelectMode)

State.init({
  daoId,
  daos: [daoId],
  page: 0,
  filters: {
    proposal_types: [],
    status: [],
    time_start: "",
    time_end: "",
  },
  filtersOpen: false,
  multiSelectMode: defaultMultiSelectMode ?? false,
});


const forgeUrl = (apiUrl, params) =>
  apiUrl +
  Object.keys(params)
    .sort()
    .reduce((paramString, p) => paramString + `${p}=${params[p]}&`, "?");

const res = fetch(
  forgeUrl(apiUrl, {
    offset: state.page * resPerPage,
    limit: resPerPage,
    daos: state.daos,
    proposal_types: state.filters.proposal_types,
    status: state.filters.status,
    time_start: state.filters.time_start,
    time_end: state.filters.time_end,
  }),
  {
    mode: "cors",
    headers: {
      "x-api-key": publicApiKey,
      "no-cache": true,
    },
  }
);

return (
  <>
    <div className="d-flex align-items-center gap-2">
      <Widget
        src="nui.sking.near/widget/Input.Text"
        props={{
          placeholder: "Search by proposal ID or name",
          disabled: true,
          type,
          size,
          icon: (
            <i
              className="bi bi-search"
              style={{
                color: "#4F46E5",
              }}
            />
          ),
          inputProps: {
            title: "Disabled because no API for searching yet",
          },
        }}
      />
      <Widget
        src="nui.sking.near/widget/Input.Button"
        props={{
          children: state.multiSelectMode ? (
            <>
              Hide Multi-Select
              <i class="bi bi-x-lg"></i>
            </>
          ) : (
            <>
              Show Multi-Select
              <i class="bi bi-card-checklist"></i>
            </>
          ),
          variant: "secondary outline",
          size: "md",
          onClick: () => {
            Storage.privateSet("multiSelectMode", !state.multiSelectMode);
            State.update({
              ...state,
              multiSelectMode: !state.multiSelectMode,
            });
          },
        }}
      />
      <Widget
        src="nui.sking.near/widget/Layout.Modal"
        props={{
          open: state.filtersOpen,
          onOpenChange: (open) => {
            State.update({
              ...state,
              filtersOpen: open,
            });
          },
          toggle: (
            <Widget
              src="nui.sking.near/widget/Input.Button"
              props={{
                children: (
                  <>
                    Filter
                    <i className="bi bi-funnel"></i>
                  </>
                ),
                variant: "secondary outline",
                size: "md",
              }}
            />
          ),
          content: (
            <Widget
              src="astro.sking.near/widget/DAO.Proposals.FilterModal"
              props={{
                filters: state.filters,
                cancel: () => {
                  State.update({
                    ...state,
                    filtersOpen: false,
                  });
                },
                applyFilters: (filters) => {
                  State.update({
                    ...state,
                    filters,
                    filtersOpen: false,
                  });
                },
              }}
            />
          ),
        }}
      />
    </div>
    {res !== null && !res.body && (
      <div className="alert alert-danger" role="alert">
        Couldn't fetch proposals from API. Please try again later.
      </div>
    )}

    <div
      style={{
        minHeight: 650 * (res.body?.length ?? resPerPage),
      }}
    >
      {res == null && (
        <>
          {new Array(resPerPage).fill(0).map((_, i) => (
            <Widget src="astro.sking.near/widget/DAO.Proposals.Card.skeleton" />
          ))}
        </>
      )}
      {res !== null &&
        res.body.map(({ proposal, proposal_type, proposal_id }, i) => {
          proposal.kind = {
            [proposal_type]: {
              ...proposal.kind,
            },
          };
          proposal.id = proposal_id;
          if (proposal.status === "Removed") return <></>;
          Object.keys(proposal.vote_counts).forEach((k) => {
            if (typeof proposal.vote_counts[k] == "string") {
              proposal.vote_counts[k] = proposal.vote_counts[k]
                .match(/.{1,2}/g)
                .map((x) => parseInt(x));
            }
          });
          return (
            <Widget
              key={i}
              src={"astro.sking.near/widget/DAO.Proposals.Card.index"}
              props={{
                daoId: state.daoId,
                proposalString: JSON.stringify(proposal),
                multiSelectMode: state.multiSelectMode,
              }}
            />
          );
        })}

      <div className="d-flex justify-content-center my-4">
        <Widget
          src="nui.sking.near/widget/Navigation.PrevNext"
          props={{
            hasPrev: state.page > 0,
            hasNext: res.body.length == resPerPage,
            onPrev: () => {
              State.update({
                page: state.page - 1,
              });
            },
            onNext: () => {
              State.update({
                page: state.page + 1,
              });
            },
          }}
        />
      </div>
    </div>
    {state.multiSelectMode && (
      <>
        <div
          style={{
            height: 180,
            width: "100%",
          }}
        ></div>
        <Widget
          src="astro.sking.near/widget/DAO.Proposals.MultiVoteSubmit"
          props={{
            daoId: state.daoId,
            onHideMultiSelect: () => {
              State.update({
                ...state,
                multiSelectMode: false,
              });
              Storage.privateSet("multiSelectMode", false);
            },
          }}
        />
      </>
    )}
  </>
);
