const defaultFilters = props.defaultFilters ?? {};

const createDAOLink = "#//*__@appAccount__*//widget/index?tab=create-dao";

const renderHeader = () => (
  <div className="d-flex justify-content-between gap-2 align-items-center">
    <h2 className="h2">DAOs</h2>
    <Widget
      src="nearui.near/widget/Input.Button"
      props={{
        variant: "info",
        size: "lg",
        buttonProps: {
          style: {
            fontWeight: 500,
          },
        },
        children: (
          <>
            Create a new DAO
            <i className="bi bi-plus-lg"></i>
          </>
        ),
        href: createDAOLink,
      }}
    />
  </div>
);

const publicApiKey = "36f2b87a-7ee6-40d8-80b9-5e68e587a5b5";
const resPerPage = 10;

const forgeUrl = (apiUrl, params) =>
  apiUrl +
  Object.keys(params)
    .sort()
    .reduce((paramString, p) => paramString + `${p}=${params[p]}&`, "?");

const daos = useCache(
  () =>
    asyncFetch(forgeUrl(`https://api.pikespeak.ai/daos/all`, {}), {
      mode: "cors",
      headers: {
        "x-api-key": publicApiKey,
        "cache-control": "max-age=86400", // 1 day
      },
    }).then((res) => res.body),
  "all-daos",
  { subscribe: false },
);

const renderDAOs = () => {
  return (
    <Widget
      src="/*__@appAccount__*//widget/DAOs.list"
      props={{
        daos,
      }}
    />
  );
};

return (
  <div>
    {renderHeader()}
    {renderDAOs()}
  </div>
);
