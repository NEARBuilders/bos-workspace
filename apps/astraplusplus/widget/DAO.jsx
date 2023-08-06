const widgetOwner = "/*__@appAccount__*/";

// Trying to improve the UX by not showing the widget until it's ready
const Experiment = styled.div`
  opacity: 0;
  animation: fade-in 0.5s ease-in-out forwards;
  animation-delay: .5s;

  @keyframes fade-in {
    0% {
      opacity: 0;
      overflow: hidden;
      max-height: 0;
    }
    50% {
      opacity: 0;
      overflow: hidden;
      max-height: none;
    }
    100% {
      opacity: 1;
    }
  }
`;

return (
  <Experiment>
    <Widget
      src={`${widgetOwner}/widget/DAO.index`}
      props={{ widgetOwner, ...props }}
    />
  </Experiment>
);
