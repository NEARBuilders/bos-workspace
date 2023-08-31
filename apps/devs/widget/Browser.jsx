// /**
//  * Takes in a rootPath and rootType
//  */
// const rootPath = props.rootPath || context.accountId || "evrything.near";
// const rootType = props.rootType || "account";
// const rootNode = props.rootNode || {};

// State.init({
//   path: rootPath,
//   type: rootType,
//   history: [rootPath],
// });

// function setPath(path) {
//   State.update({ path });
// }

// function setHistory(history) {
//   State.update({ history });
// }

// function setType(type) {
//   State.update({ type });
// }

// function setRoot(newPath, newType) {
//   State.update({
//     path: newPath,
//     type: newType,
//   });
// }

// Initialize the state with a default route
State.init({
  currentRoute: "home", // Default route
});

// Function to handle navigation
function handleNavigate(newRoute) {
  State.update({ currentRoute: newRoute });
}

// Get the widget for the current route
const CurrentWidget = props.routes[state.currentRoute]?.src;

// Render the current widget or a default message if the route is not found
return (
  <div>
    {CurrentWidget ? (
      <Widget
        src={CurrentWidget.path}
        blockHeight={CurrentWidget.blockHeight}
      />
    ) : (
      <div>Route not found</div>
    )}

    {/* Navigation buttons */}
    <div>
      {Object.keys(props.routes).map((route) => (
        <button onClick={() => handleNavigate(route)} key={route}>
          {route}
        </button>
      ))}
    </div>
  </div>
);
