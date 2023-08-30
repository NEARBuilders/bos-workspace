const path = props.path;
const blockHeight = props.blockHeight;

const eventThing = Social.getr(path, blockHeight);

if (!eventThing) return <p>Loading...</p>

const EventCard = styled.div``;

return <EventCard><p>{JSON.stringify(eventThing.template.src)}</p></EventCard>;
