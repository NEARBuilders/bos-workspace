State.init({
  document: props.document || 43124,
});

const goTo = ({ page, document }) => {
  document && State.update({ document: document });
};

console.log("state", state.document);

const content = `
# This is a test\n
You are looking at a test document with id: ${state.document}\n
---\n
### Here \n
is\n
some\n
content\n
---\n
bos://nearui.near/widget/Typography.Text.demo
`;

return (
  <Widget
    src="/*__@appAccount__*//widget/templates.project.default"
    props={{
      id: "123",
      title: "Everything",
      description: "Everything is awesome",
      logo: "https://ipfs.near.social/ipfs/bafkreihi3qh72njb3ejg7t2mbxuho2vk447kzkvpjtmulsb2njd6m2cfgi",
      tags: ["everything", "awesome"],
      goTo,
      content,
      activeDocument: state.document,
      documents: {
        43124: {
          title: "Everything is awesome",
          children: {
            43125: {
              title: "Everything is great",
              children: {
                43126: {
                  title: "Everything is great",
                },
              },
            },
            98097: {
              title: "Everything is great",
            },
          },
        },
        88097: {
          title: "Everything is great",
        },
      },
    }}
  />
);
