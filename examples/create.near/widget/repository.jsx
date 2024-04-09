const GRAPHQL_ENDPOINT = "https://near-queryapi.api.pagoda.co";

State.init({
  copiedShareUrl: false,
  selectedTab: props.tab ?? "content",
  isLoadingRpcImpressions: true,
  impressionsData: {
    impressions: undefined,
    weekly_chart_data_config: undefined,
    executed_at: undefined,
  },
  developerSince: undefined,
  numberOfThingsPublished: 0,
});

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const src = props.src ?? "create.near/widget/repository";
const [accountId, type, name] = src.split("/");
const existsData = Social.keys(src);
const exists = !existsData || Object.keys(existsData).length > 0;
const thing = Social.get(src);
const data = Social.get(`${src}/**`);
const metadata = data.metadata;
const tags = Object.keys(metadata.tags || {});
const detailsUrl = `/create.near/widget/repository?src=${src}`;
const shareUrl = `https://everything.dev${detailsUrl}`;
const accountProfileDescription =
  Social.getr(`${accountId}/profile`).description ?? "";
const descMaxWords = 15;
const thingDescMaxWords = 25;

function normalizeMarkdown(text) {
  // convert headers to normal text (remove # symbols)
  text = text.replace(/^#+\s*/gm, "");
  // convert bold and italic to normal text (remove * and _ symbols)
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");
  // remove links
  text = text.replace(/\[(.*?)\]\(.*?\)/g, "$1");
  // remove images
  text = text.replace(/!\[(.*?)\]\(.*?\)/g, "$1");
  return text.trim();
}

if (accountProfileDescription) {
  const text = normalizeMarkdown(accountProfileDescription).split(" ");
  accountProfileDescription = text.slice(0, descMaxWords);
  if (text.length >= descMaxWords) {
    accountProfileDescription.push("...");
  }
  accountProfileDescription = accountProfileDescription.join(" ");
}

function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "eduohe_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}

const indexerQueries = `
  query GetWidgetCount {
   eduohe_near_nearcon_2023_widget_activity_feed_widget_activity_aggregate(
      where: {account_id: {_eq: "${accountId}"}}
    ) {
      aggregate {
        count(distinct: true, columns: widget_name)
      }
    }
  }
  query GetDeveloperSince {
  eduohe_near_nearcon_2023_widget_activity_feed_widget_activity_aggregate(
      where: {account_id: {_eq: "${accountId}"}}
    ) {
      aggregate {
        min {
          block_timestamp
        }
      }
    }
  }
`;

useEffect(() => {
  fetchGraphQL(indexerQueries, "GetWidgetCount", {}).then((result) => {
    if (result.status === 200 && result.body) {
      if (result.body.errors) {
        console.log("error:", result.body.errors);
        return;
      }
      let data = result.body.data;
      if (data) {
        const noThings =
          data
            .eduohe_near_nearcon_2023_widget_activity_feed_widget_activity_aggregate
            .aggregate.count;
        State.update({
          numberOfThingsPublished: noThings,
        });
      }
    }
  });
}, []);

useEffect(() => {
  fetchGraphQL(indexerQueries, "GetDeveloperSince", {}).then((result) => {
    if (result.status === 200 && result.body) {
      if (result.body.errors) {
        console.log("error:", result.body.errors);
        return;
      }
      let data = result.body.data;
      if (
        data &&
        data.eduohe_near_nearcon_2023_widget_activity_feed_widget_activity_aggregate
      ) {
        const developerSince =
          data
            .eduohe_near_nearcon_2023_widget_activity_feed_widget_activity_aggregate
            .aggregate.min.block_timestamp;
        State.update({
          developerSince,
        });
      }
    }
  });
}, []);

let isWidget = false;

if (type === widget) {
  isWidget = true;
}

const dependencyMatch =
  isWidget && data.matchAll(/<Widget[\s\S]*?src=.*?"(.+)"[\s\S]*?\/>/g);
let dependencySources = [...(dependencyMatch || [])]
  .map((r) => r[1])
  .filter((r) => !!r);
dependencySources = dependencySources.filter(
  (r, i) => dependencySources.indexOf(r) === i && r !== "(.+)"
);

const source = `
\`\`\`jsx
${data}
\`\`\`
`;

const STORE = "storage.googleapis.com";
const BUCKET = "databricks-near-query-runner";
const BASE_URL = `https://${STORE}/${BUCKET}/output/near_bos_component_details/component_rpc_loads`;
const dataset = `${BASE_URL}/${src}`;

function computeWeekLabel(weekDateString) {
  let startDate = new Date(weekDateString);
  let endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  let label = `${formatDate(startDate)} - ${formatDate(endDate)}`;
  return label;
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

const getImpressions = () => {
  try {
    const url = `${dataset}.json`;
    const res = fetch(url);
    if (res.ok) {
      const parsedResults = JSON.parse(res.body);
      const weekly_chart_data = parsedResults.data.rpc_loads
        .sort((a, b) => new Date(a.week) - new Date(b.week))
        .map((row) => ({
          "RPC Impressions": row.number_of_rpc_loads,
          Week: computeWeekLabel(row.week),
        }));

      const weekly_chart_data_config = {
        tooltip: {
          trigger: "axis",
          confine: true,
        },
        grid: {
          left: "3%",
          right: "4%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: weekly_chart_data.map((r) => r.Week),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
        },
        yAxis: {
          type: "value",
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
        },
        series: [
          {
            name: "Number of Views",
            type: "line",
            smooth: true,
            data: weekly_chart_data.map((r) => r["RPC Impressions"]),
            areaStyle: {},
            color: "#59e691",
            showSymbol: false,
          },
        ],
      };

      State.update({
        isLoadingRpcImpressions: false,
        impressionsData: {
          impressions: parsedResults.data.total_rpc_loads,
          weekly_chart_data_config,
          executed_at: parsedResults.executed_at,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching the impression data: ", error.message);
  }
};

if (state.isLoadingRpcImpressions) {
  getImpressions();
}

const Wrapper = styled.div`
  padding-bottom: 48px;
`;

const SummaryWrapper = styled.div`
  margin-bottom: 32px;
`;

const Tabs = styled.div`
  display: flex;
  height: 48px;
  border-bottom: 1px solid #eceef0;
  margin-bottom: 32px;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1024px) {
    background: #f8f9fa;
    border-top: 1px solid #eceef0;
    margin: 0 -12px 48px;

    > * {
      flex: 1;
    }
  }
`;

const TabsButton = styled("Link")`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 600;
  font-size: 12px;
  padding: 0 12px;
  position: relative;
  color: ${(p) => (p.selected ? "#11181C" : "#687076")};
  background: none;
  border: none;
  outline: none;
  text-align: center;
  text-decoration: none !important;

  &:hover {
    color: #11181c;
  }

  &::after {
    content: "";
    display: ${(p) => (p.selected ? "block" : "none")};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #59e692;
  }

  > span {
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;

    > span {
      margin-right: 0;
      margin-bottom: 8px;
    }
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: ${(p) =>
    p.noSidebar ? "1fr" : "minmax(0, 1fr) 336px"};
  gap: 64px;

  @media (max-width: 995px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const Sidebar = styled.div`
  > div {
    padding-bottom: 32px;
    border-bottom: 1px solid #eceef0;
    margin-bottom: 32px;

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
      margin-bottom: 0;
    }
  }

  @media (max-width: 995px) {
    grid-row: 1;
  }
`;

const SideBarContainer = styled.div`
  @media (max-width: 995px) {
    margin-top: 10px;
    border-top: 1px solid #eceef0;
  }
`;

const SmallTitle = styled.h3`
  color: #687076;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  margin-bottom: 20px;
  text-transform: uppercase;

  @media (max-width: 770px) {
    margin-bottom: 16px;
  }
`;

const TextLink = styled("Link")`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #0091ff;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
`;

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};

  i {
    margin-right: 4px;
  }
`;

const Thing = styled.div`
  margin-bottom: 24px;
`;

const Icon = styled.i`
  font-size: 15px;
  fill: currentColor;
  padding-right: 5px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #eceef0;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: row;
`;

const StatsBadge = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const StatsText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: "#11181C";
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  border-radius: 12px;
`;

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 450px) {
    flex-direction: row;
  }
`;

const Graph = styled.div`
  display: flex;
  margin-top: -24px;
  @media (min-width: 450px) {
    margin-left: 30px;
  }
`;
const Bio = styled.div`
  color: #11181c;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 15px;
  margin-top: 20px;

  > *:last-child {
    margin-bottom: 15 !important;
  }

  @media (max-width: 900px) {
    margin-bottom: 15px;
  }
`;

if (!exists) {
  return (
    <>
      <Text bold>Error</Text>
      <Text>Could not find: {src}</Text>
    </>
  );
}

return (
  <>
    <SummaryWrapper>
      <Widget
        src="create.near/widget/repository.plugins"
        props={{
          primaryAction: "open",
          size: "large",
          showTags: true,
          showDesc: true,
          descMaxWords: thingDescMaxWords,
          src,
        }}
      />
    </SummaryWrapper>
    <Content>
      <Wrapper>
        <Tabs>
          <TabsButton
            href={`${detailsUrl}&tab=content`}
            selected={state.selectedTab === "content"}
          >
            <Icon className="bi bi-boxes" />
            Content
          </TabsButton>
          <TabsButton
            href={`${detailsUrl}&tab=about`}
            selected={state.selectedTab === "about"}
          >
            <Icon className="bi bi-info-square" />
            About
          </TabsButton>
          <TabsButton
            href={`${detailsUrl}&tab=discussion`}
            selected={state.selectedTab === "discussion"}
          >
            <Icon className="bi bi-chat-left-text" />
            Discussion
          </TabsButton>
        </Tabs>
        {state.selectedTab === "content" && (
          <Content noSidebar>
            <Widget
              src="create.near/widget/repository.content"
              props={{
                src,
              }}
            />
          </Content>
        )}

        {state.selectedTab === "about" && (
          <Content noSidebar>
            <div>
              {metadata.description ? (
                <Markdown text={metadata.description} />
              ) : (
                <Text>This has no description.</Text>
              )}
            </div>
          </Content>
        )}

        {state.selectedTab === "discussion" && (
          <Content noSidebar>
            <Widget src="james.near/widget/discussion" props={{ path: src }} />
          </Content>
        )}
      </Wrapper>
      <Sidebar>
        <SideBarContainer>
          <SmallTitle style={{ "padding-top": "20px" }}>Creator</SmallTitle>

          <Widget
            src="near/widget/AccountProfile"
            props={{
              accountId,
            }}
          />

          {accountProfileDescription && (
            <Bio>
              <Text>{accountProfileDescription}</Text>
            </Bio>
          )}
          <Container>
            <Stats>
              <StatsBadge>
                <Icon className="bi bi-code" />
                <span className="badge rounded-pill bg-secondary">
                  {state.numberOfThingsPublished
                    ? state.numberOfThingsPublished + " published"
                    : "..."}
                </span>
              </StatsBadge>
              <StatsBadge>
                <Icon className="bi bi-calendar" />
                <span className="badge rounded-pill bg-secondary">
                  {state.developerSince ? (
                    <Widget
                      key="foo"
                      src="near/widget/TimeAgo"
                      props={{
                        alwaysRelative: true,
                        blockTimestamp: state.developerSince,
                      }}
                    />
                  ) : (
                    <span>...</span>
                  )}
                </span>
              </StatsBadge>
            </Stats>
          </Container>
          <Container>
            <SmallTitle>Stats</SmallTitle>
            <GraphContainer>
              <div style={{ display: "flex", "flex-direction": "column" }}>
                <Text small style={{ "margin-bottom": "10px" }}>
                  Impressions
                </Text>
                <Text medium bold style={{ "margin-bottom": "10px" }}>
                  {state.impressionsData.impressions ?? "..."}
                </Text>
              </div>
              {state.impressionsData.weekly_chart_data_config && (
                <Graph>
                  <Widget
                    src="near/widget/Chart"
                    props={{
                      definition:
                        state.impressionsData.weekly_chart_data_config,
                      width: "180px",
                      height: "100px",
                    }}
                  />
                </Graph>
              )}
            </GraphContainer>
            <Text small style={{ "margin-bottom": "10px" }}>
              Last updated
            </Text>
            <Text medium bold style={{ "margin-bottom": "10px" }}>
              <Widget
                src="mob.near/widget/TimeAgo@97556750"
                props={{ keyPath: src }}
              />{" "}
              ago.
            </Text>
          </Container>
          <Container>
            <SmallTitle>DEPENDENCIES ({dependencySources.length})</SmallTitle>
            {dependencySources.length === 0 && (
              <Text>This has no dependencies.</Text>
            )}
            {dependencySources.map((source) => (
              <Thing key={source}>
                <Widget
                  key={source}
                  src="james.near/widget/inline"
                  props={{ src: source }}
                />
              </Thing>
            ))}
            {!state.showAllDependencies && dependencySources.length > 5 && (
              <Widget
                src="near/widget/DIG.Button"
                props={{
                  fill: "outline",
                  variant: "secondary",
                  label: "Show All",
                  size: "small",
                  style: { width: "30%" },
                  onClick: () => {
                    State.update({ showAllDependencies: true });
                  },
                }}
              />
            )}
          </Container>
        </SideBarContainer>
      </Sidebar>
    </Content>
  </>
);
