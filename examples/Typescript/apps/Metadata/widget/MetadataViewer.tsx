// This is an adaptation of mob.near/widget/WidgetMetadata to TypeScript

// Below types reflect the Metadata standard found here:
// https://github.com/NearSocial/standards/blob/main/types/common/Metadata.md

interface NFT {
  contractId: string; // An account ID of the NFT contract
  tokenId: string; // Token ID within the NFT contract
}

interface Image {
  url?: string; // A direct URL to the image source
  ipfs_cid?: string; // IPFS CID to the image
  nft?: NFT; // Pointer to an NFT
}

interface LinkTree {
  [link_name: string]: string; // The link for the given link_name
}

interface Tags {
  [tag: string]: string; // A dynamic key represents a tag in the list
}

interface Metadata {
  name?: string; // The display name or title
  description?: string; // The main image or an icon
  image?: Image; // The background image
  backgroundImage?: Image; // The description in the markdown format
  linktree?: LinkTree; // Links
  tags?: Tags; // Tags
}

interface LinktreeElement {
  prefix: string;
  icon: string;
}

interface LinktreeElements {
  [key: string]: LinktreeElement;
}

function MetadataViewer(metadata: Metadata) {
  const { name, description, image, linktree, tags } = metadata;

  const links = Object.entries(linktree ?? {});
  const linktreeElements: LinktreeElements = {
    website: {
      prefix: "https://",
      icon: "bi-globe2",
    },
  };

  const linktreeObjects = links.map((o: [string, string], i: number) => {
    const key = o[0];
    let value = o[1];
    if (!value) {
      return null;
    }
    const e = linktreeElements[key];
    if (e.prefix) {
      value = value && value.replace(e.prefix, "");
    }
    const icon = e.icon ? (
      <i className={`bi ${e.icon ?? ""} text-secondary me-1`}></i>
    ) : (
      ""
    );
    return e.prefix ? (
      <div key={i} className="text-truncate">
        <a href={`${e.prefix}${value}`}>
          {icon}
          {value}
        </a>
      </div>
    ) : (
      <div key={i} className="text-truncate">
        {key}: {icon}
        {value}
      </div>
    );
  });

  const descriptionKey = `${name}-description`.replaceAll(/[._\/-]/g, "--");

  return (
    <div className="card" style={{ borderRadius: "2em" }}>
      <div className="row py-3 g-1">
        <div className="m-auto text-center" style={{ maxWidth: "12em" }}>
          <div
            className="d-inline-block"
            style={{ width: "10em", height: "10em" }}
          >
            <Widget
              src="mob.near/widget/Image"
              props={{
                image,
                className: "w-100 h-100 shadow",
                style: { objectFit: "cover", borderRadius: "2em" },
                thumbnail: false,
                fallbackUrl:
                  "https://ipfs.near.social/ipfs/bafkreido7gsk4dlb63z3s5yirkkgrjs2nmyar5bxyet66chakt2h5jve6e",
                alt: name,
              }}
            />
          </div>
        </div>
        <div className="col px-2">
          <div className="position-relative">
            <h5 className="card-title">{name}</h5>
          </div>
          <div className="card-text">
            {tags && Number(tags.length) > 0 && (
              <div>
                {Object.keys(tags).map((tag: string, i: number) => (
                  <span key={i} className="me-1 mb-1 badge bg-secondary">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {(description || linktreeObjects.length > 0) && (
              <button
                className="btn btn-sm btn-outline-secondary border-0"
                data-bs-toggle="collapse"
                data-bs-target={`#${descriptionKey}`}
                aria-expanded="false"
                aria-controls={descriptionKey}
              >
                <i className="bi bi-arrows-angle-expand me-1"></i>Show details
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={"card-text p-2 pt-0"} id={descriptionKey}>
        <Markdown text={description} />
        {linktreeObjects}
      </div>
    </div>
  );
}

export default MetadataViewer;
