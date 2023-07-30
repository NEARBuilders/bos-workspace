let isLoading = true;

let layouts = [
  [
    {
      type: "row",
      content: [
        {
          type: "text",
          variants: ["lg"],
          rows: 1,
          style: {
            width: "50%",
          },
        },
        {
          type: "text",
          variants: ["sm"],
          rows: 1,
          style: {
            width: "80px",
            marginStart: "auto",
          },
        },
      ],
    },
    {
      type: "row",
      variants: ["me-auto"],
      content: [
        {
          type: "avatar",
          variants: ["md", "me-1"],
        },
        {
          type: "text",
          variants: ["md"],
          rows: 1,
          style: {
            width: "150px",
          },
        },
      ],
    },
    {
      type: "box",
      variants: ["lg", "mb-5"],
    },
    {
      type: "row",
      variants: ["flex-column"],
      content: [
        {
          type: "box",
          variants: ["rounded-5"],
          style: {
            height: "46px",
          },
          count: 3,
        },
      ],
    },
    {
      type: "row",
      variants: ["justify-content-start", "mt-4"],
      content: [
        {
          type: "box",
          variants: ["rounded-5"],
          count: 2,
          style: {
            height: "38px",
            width: "160px",
          },
        },
      ],
    },
  ],
];

return (
  <>
    {isLoading ? (
      layouts.map((layout, index) => (
        <div
          style={{
            marginBottom: "50px",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            borderRadius: "8px",
          }}
        >
          <Widget
            key={index}
            src="nui.sking.near/widget/Feedback.Skeleton"
            props={{ layout }}
          />
        </div>
      ))
    ) : (
      <>Loaded</>
    )}
  </>
);
