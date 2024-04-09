const communities = {
  regional: {
    overviewId: 397,
    icon: "https://ipfs.near.social/ipfs/bafkreiajwq6ep3n7veddozji2djv5vviyisabhycbweslvpwhsoyuzcwi4",
    cover:
      "https://ipfs.near.social/ipfs/bafkreihgxg5kwts2juldaeasveyuddkm6tcabmrat2aaq5u6uyljtyt7lu",
    title: "Regional",
  },
  defi: {
    overviewId: 412,
    icon: "https://ipfs.near.social/ipfs/bafkreidpitdafcnhkp4uyomacypdgqvxr35jtfnbxa5s6crby7qjk2nv5a",
    cover:
      "https://ipfs.near.social/ipfs/bafkreicg4svzfz5nvllomsahndgm7u62za4sib4mmbygxzhpcl4htqwr4a",
    title: "DeFi",
  },
  nft: {
    overviewId: 416,
    icon: "https://ipfs.near.social/ipfs/bafkreie2eaj5czmpfe6pe53kojzcspgozebdsonffwvbxtpuipnwahybvi",
    cover:
      "https://ipfs.near.social/ipfs/bafkreiehzr7z2fhoqqmkt3z667wubccbch6sqtsnvd6msodyzpnf72cszy",
    title: "NFTs",
  },
  gaming: {
    overviewId: 414,
    icon: "https://ipfs.near.social/ipfs/bafkreiepgdnu7soc6xgbyd4adicbf3eyxiiwqawn6tguaix6aklfpir634",
    cover:
      "https://ipfs.near.social/ipfs/bafkreiaowjqxds24fwcliyriintjd4ucciprii2rdxjmxgi7f5dmzuscey",
    title: "Gaming",
  },
};

const Gradient = styled.div`
   {
    width: 100%;
    margin-top: -25px;
    margin-bottom: 25px;
    height: 250px;
    text-align: center;
    background: #000;

    font-family: Arial, sans-serif;
  }

  .subtitle-above {
    font-size: 18px;
    letter-spacing: 1px;
    font-family: Courier, monospace;
  }

  .subtitle-below {
    font-size: 16px;
        font-family: Courier, monospace;

  }

  .slogan {
    font-weight: 600;
    font-size: 60px;
        font-family: Courier, monospace;

  }
`;

return (
  <div>
    <Gradient className="d-flex flex-column justify-content-center">
      <h1 class="mb-3 text-white slogan">
        <span class="text-primary-gradient">NEAR </span>Work Groups
      </h1>
      <div class="subtitle-below text-white opacity-75">
        Share ideas, connect with people, and get involved!
      </div>
    </Gradient>
    <div class="h5 pb-3">Featured Communities</div>
    <div class="row">
      {Object.entries(communities).map(([label, community]) => {
        return (
          <div class="col">
            <Widget src="devs.near/widget/community.Featured" />
          </div>
        );
      })}
    </div>
  </div>
);
