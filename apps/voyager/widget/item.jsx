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

function RecursiveItem({ data, path, eFolder, eFile }) {
  const item = data;

  const defaultFolder = ({ toggleExpand, isExpanded, key }) => (
    <span onClick={toggleExpand} style={{ cursor: "pointer" }}>
      {isExpanded ? "[-]" : "[+]"} {key}
    </span>
  );

  const defaultFile = ({ key, data }) => <span>{key}</span>;

  eFolder = eFolder || defaultFolder;
  eFile = eFile || defaultFile;

  if (typeof item === "object") {
    const isExpanded = !!state.expandedKeys[path];
    return (
      <div>
        <eFolder
          key={path}
          isExpanded={isExpanded}
          toggleExpand={() => toggleExpand(path)}
          path={path}
        />
        {isExpanded && (
          <div key={path}>
            {Object.keys(item).map((key) => (
              <div key={key}>
                <RecursiveItem
                  data={item[key]}
                  path={[path, key].join("/")}
                  eFolder={eFolder}
                  eFile={eFile}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return <eFile key={path} data={item} path={path} />;
  }
}

return RecursiveItem(props);
