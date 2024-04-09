const projectsData = Social.get("*/thing/project/**");

const projects = [
  {
    data: JSON.stringify({
      team: ["efiz.near", "plugrel.near", "james.near"],
      demo: "devs.near/widget/every.group",
      post: {
        type: "social",
        accountId: "multi.sputnik-dao.near",
        blockHeight: 95111895,
      },
    }),
    metadata: {
      name: "Build DAO",
      description: "Support Systems for Open Web Developers",
      image: {
        href: "https://pbs.twimg.com/profile_images/1690850854457204736/KUXVTpZt_400x400.png",
      },
      backgroundImage: {
        href: "https://pbs.twimg.com/profile_banners/894252872094941184/1598231788/1500x500",
      },
      linktree: {
        page: "/build.sputnikn-dao.near/widget/community",
        github: "https://github.com/NEARbuilders/create",
      },
    },
  },
];

return projects;
