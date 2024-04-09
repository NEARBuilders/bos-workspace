const { basePath, param } = props;

const { get } = VM.require("${config_account}/widget/utils.adapter");

const documents = get();

// Preprocess documents to group paths by their parent sections
const groupedSections = {};
Object.keys(documents).forEach((path) => {
  const parts = path.split("/");
  const parentSection = parts[0];
  const childSection = parts.length > 1 ? parts[1] : null;
  
  if (!groupedSections[parentSection]) {
    groupedSections[parentSection] = [];
  }

  // Ensure child section is only added once per parent section
  if (childSection && !groupedSections[parentSection].includes(childSection)) {
    groupedSections[parentSection].push(childSection);
  }
});

return (
  <div className="sidebar">
    {Object.keys(groupedSections).map((parentSection) => (
      <div key={parentSection}>
        {/* Render parent section */}
        <div className="parent-section">
          <Link to={`/${basePath}?${param}=${parentSection}`}>
            <button className="button">{documents[parentSection].title}</button>
          </Link>
        </div>
        
        {/* Render child sections */}
        <div className="nested-section">
          {groupedSections[parentSection].map((childSection) => (
            <div className="child-section" key={childSection}>
              <Link to={`/${basePath}?${param}=${parentSection}/${childSection}`}>
                <button className="button">{documents[`${parentSection}/${childSection}`].title}</button>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Render separator */}
        <div className="separator"></div>
      </div>
    ))}
  </div>
);
