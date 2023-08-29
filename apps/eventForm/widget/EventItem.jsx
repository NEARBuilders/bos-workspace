const path = props.path;
const blockHeight = props.blockHeight;

const eventThing = Social.getr(path, blockHeight);

if (!eventThing) return <p>Loading...</p>;

const EventCard = styled.div``;

console.log(eventThing.data);

return (
  <EventCard>
    {JSON.stringify(eventThing)}
    <Widget
      src="itexpert120-contra.near/widget/EventView"
      props={{ data: eventThing.data }}
    />
  </EventCard>
);
