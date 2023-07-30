let layout = [
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
];

const Wrapper = styled.div`
  background-color: ${statusBackgroundColor};
  margin: 16px auto;
  max-width: 900px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 500px;
`;

return (
  <Wrapper className="ndc-card">
    <Widget src="nui.sking.near/widget/Feedback.Skeleton" props={{ layout }} />
  </Wrapper>
);
