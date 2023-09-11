/**
 * Recursive Item
 * This is designed to be a plug-and-play component for displaying a tree of data.
 *
 * props:
 * - data: object
 * - level: number (default 0)
 * - eFolder: function ({ toggleExpand, isExpanded, key }) => ReactElement (default [+] or [-] key)
 * - eFile: function ({ key, data }) => ReactElement (default key: data)
 * - margin: number (default 20)
 */

State.init({
  expandedKeys: {},
});

function toggleExpand(key) {
  State.update({
    expandedKeys: {
      ...state.expandedKeys,
      [key]: !state.expandedKeys[key],
    },
  });
}

function getBackgroundColor(counter) {
  return counter % 2 === 0 ? "#f7f7f7" : "#e7e7e7"; // Light gray for even, slightly darker gray for odd
}

const { data, level, path, padding, eFolder, eFile, counter } = props;

if (level === undefined) {
  level = 0;
}
if (data === undefined) {
  data = {};
}

if (path === undefined) {
  path = [];
}

if (counter === undefined) {
  counter = 0;
}

if (eFolder === undefined) {
  eFolder = ({ toggleExpand, isExpanded, key }) => (
    <span onClick={toggleExpand} style={{ cursor: "pointer" }}>
      {isExpanded ? "[-]" : "[+]"} {key}
    </span>
  );
}

if (eFile === undefined) {
  eFile = ({ key, data }) => (
    <span>
      {key}: {data}
    </span>
  );
}

return (
  <>
    <div style={{ paddingLeft: `${level * (padding ?? 20)}px`, width: "100%" }}>
      {Object.keys(data).map((key, index) => {
        const currentPath = [...path, key].join("/");
        return (
          <div
            key={index}
            style={{
              backgroundColor: getBackgroundColor(counter + index),
              width: "100%",
            }}
          >
            {typeof data[key] === "object" ? (
              <>
                <eFolder
                  key={key}
                  data={data[key]}
                  isExpanded={state.expandedKeys[key]}
                  toggleExpand={() => toggleExpand(key)}
                  path={currentPath}
                />
                {state.expandedKeys[key] && (
                  <Widget
                    src="/*__@appAccount__*//widget/item"
                    props={{
                      data: data[key],
                      level: level + 1,
                      path: [...path, key],
                      eFolder,
                      eFile,
                      counter: counter + index + 1,
                    }}
                  />
                )}
              </>
            ) : (
              <eFile key={key} data={data[key]} path={currentPath} />
            )}
          </div>
        );
      })}
    </div>
  </>
);
