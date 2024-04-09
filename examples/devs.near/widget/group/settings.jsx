const { groupData, groupId } = props;
const initialTabs = groupData.tabs || [];
State.init({
  tabs: initialTabs,
  src: "",
  blockHeight: "",
  iconClass: "",
  title: "",
  hasChanges: false,
});

const handleAddTab = () => {
  const newTab = {
    iconClass: iconClass,
    title: title,
    module: {
      src: src,
      blockHeight: blockHeight,
    },
  };
  State.update({ tabs: [...tabs, newTab], hasChanges: true });
};

const handleRemoveTab = (index) => {
  const newTabs = [...tabs];
  newTabs.splice(index, 1);
  State.update({ tabs: newTabs, hasChanges: true });
};

const handleSave = () => {
  Social.set({
    thing: {
      [groupId]: {
        "": JSON.stringify({ ...groupData, tabs }),
      },
    },
  });
  setHasChanges(false);
};

return (
  <div>
    <div>
      <input
        placeholder="iconClass"
        value={iconClass}
        onChange={(e) => State.update({ iconClass: e.target.value })}
      />
      <input
        placeholder="title"
        value={title}
        onChange={(e) => State.update({ title: e.target.value })}
      />
      <input
        placeholder="src"
        value={src}
        onChange={(e) => State.update({ src: e.target.value })}
      />
      <input
        placeholder="blockHeight"
        value={blockHeight}
        onChange={(e) => State.update({ blockHeight: e.target.value })}
      />
      <button onClick={handleAddTab}>Add Tab</button>
    </div>
    <ul>
      {(tabs || []).map((tab, index) => (
        <li key={index}>
          {tab.module.src} - {tab.module.blockHeight}
          <button onClick={() => handleRemoveTab(index)}>Remove</button>
        </li>
      ))}
    </ul>
    <div>
      <button onClick={handleSave} disabled={!hasChanges}>
        Save
      </button>
    </div>
  </div>
);
