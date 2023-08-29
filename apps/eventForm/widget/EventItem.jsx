const path = props.path;
const blockHeight = props.blockHeight;

const eventThing = Social.getr(path, blockHeight);

if (!eventThing) return <p>Loading...</p>;

console.log(eventThing.data);

return (
  <Widget
    src="itexpert120-contra.near/widget/EventCard"
    props={{ data: eventThing.data }}
  />
);
