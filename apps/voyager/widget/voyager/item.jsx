
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

function RecursiveItem({ data, path, eFolder, eFile, level }) {
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
      <div style={{ marginLeft: level * 20}}>
        <eFolder
          key={path}
          isExpanded={isExpanded}
          toggleExpand={() => toggleExpand(path)}
          path={path}
          level={level}
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
                  level={level + 1}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return <eFile key={path} data={item} path={path} level={level} />;
  }
}

return RecursiveItem(props);
