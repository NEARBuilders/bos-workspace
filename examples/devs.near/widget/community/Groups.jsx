const Cover = styled.img`
  border-radius: 8px;
  width: 150px;
  object-fit: cover;
`;

const ActionButton = styled.a`
  border-radius: 5px;
  width: auto;
  text-transform: uppercase;
  padding: 8px 14px;
  background: #888;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  :hover {
    opacity: 0.8;
    text-decoration: none;
    background: #333;
    color: #fff;
  }
`;

const Card = styled.div`
  border-radius: 8px;
  color: #0c0c0c;
  align-items: center;
  justify-content: center;
  max-width: 210px;
  padding: 25px 32px;
  display: flex;
  flex-direction: column;
`;

const CardList = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-template-rows: repeat(200px, 1fr);
  gap: 0.5rem;
`;

const GroupCard = (props) => {
  const { title, coverSrc, actionButtons } = props;

  return (
    <Card>
      <Cover src={coverSrc} alt={title} />
      <br />
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-evenly",
        }}
      >
        {actionButtons.map((button, index) => (
          <ActionButton
            key={index}
            onClick={() => handleButtonClick(button.url)}
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {button.label}
          </ActionButton>
        ))}
      </div>
    </Card>
  );
};

const Images = [
  {
    title: "DeFi",
    url: "https://ipfs.near.social/ipfs/bafkreifikdi444catqds54ulo3kwujvetmng7pwmr2tmg7hadtxmfguyeu",
  },
  {
    title: "NFTs",
    url: "https://ipfs.near.social/ipfs/bafkreib56aciji2mgnwhqt3nkmutxqfednxqllgzvd5gm6d4mcjbumnxzm",
  },
  {
    title: "Gaming",
    url: "https://ipfs.near.social/ipfs/bafkreifzp5dafotrrzitwrp2op6shyavpad4nx6rxl2wk2xf343a6vtgqa",
  },
  {
    title: "Amplify",
    url: "https://ipfs.near.social/ipfs/bafkreigqamafvyfqcwsp4gl4nyh4wof7ldrz7oloj5fb22lqbu77fz7pda",
  },
];

const Links = [
  { title: "DeFi", url: "https://t.me/+50ySHiGjLn04M2Rh" },
  { title: "NFTs", url: "https://t.me/+i3GC2WYx5b5hMThh" },
  { title: "Gaming", url: "https://t.me/+QM6OtCRhcUdiYjhh" },
  { title: "Amplify", url: "https://t.me/+KCCfcYe-IKI2ZjEx" },
];

return (
  <div
    style={{
      display: "flex",
      flexFlow: "column",
      alignItems: "space-evenly",
      backgroundColor: "#fff",
      padding: "20px",
    }}
  >
    <CardList>
      {Images.map((image, i) => (
        <GroupCard
          key={i}
          title={Links[i].title}
          coverSrc={image.url}
          description=""
          actionButtons={[{ label: "Join", url: Links[i].url }]}
        />
      ))}
    </CardList>
  </div>
);
