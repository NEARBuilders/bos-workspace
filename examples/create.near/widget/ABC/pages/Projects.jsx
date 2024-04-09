/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];
const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "create.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };
  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/ABC.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };
  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }
  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }
  if (props.referral) {
    linkProps.referral = props.referral;
  }
  const linkPropsQuery = Object.entries(linkProps)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `#/${nearDevGovGigsWidgetsAccountId}/widget/ABC.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const selectedBoardId = props.selectedBoardId ?? "mnwtransition";

const boards = props.boards ?? [
  {
    name: "ABC",
    id: "abc",
    config: {
      requiredLabels: ["abc"],
      columns: [
        { label: "widget", title: "Widget" },
        { label: "integration", title: "Integration" },
        { label: "feature-request", title: "Feature Request" },
      ],
      excludedLabels: [],
    },
  },
  {
    name: "NFT",
    id: "nft",
    config: {
      requiredLabels: ["nft"],
      columns: [
        { label: "nep", title: "NEP" },
        { label: "badges", title: "Badges" },
        { label: "feature-request", title: "Feature Request" },
      ],
      excludedLabels: [],
    },
  },
  {
    name: "DAO",
    id: "dao",
    config: {
      requiredLabels: ["dao"],
      columns: [
        { label: "transparency", title: "New Request" },
        { label: "processing", title: "Processing" },
        { label: "onboarded", title: "Onboarded" },
      ],
      excludedLabels: [],
    },
  },
];

const pageContent = (
  <div>
    <ul class="nav nav-tabs my-3">
      {boards.map((board) => (
        <li class="nav-item" key={board.id}>
          <a
            href={href("Boards", { selectedBoardId: board.id })}
            class={`nav-link ${board.id == selectedBoardId ? "active" : ""}`}
          >
            {board.name}
          </a>
        </li>
      ))}
    </ul>
    <div class="tab-content">
      {boards.map((board) => (
        <div
          class={`tab-pane fade ${
            board.id == selectedBoardId ? "show active" : ""
          }`}
          id={`board${board.id}`}
          role="tabpanel"
          aria-labelledby={`${board.id}-tab`}
          tabindex="0"
          key={board.id}
        >
          {widget("widgets.boards.KanbanBoard", {
            requiredLabels: board.config.requiredLabels,
            excludedLabels: board.config.excludedLabels,
            columns: board.config.columns,
            boardId: board.id,
          })}
        </div>
      ))}
    </div>
  </div>
);

return widget("widgets.layout.Page", {
  children: pageContent,
});
