// helper function to fetch all events
const fetchAllEvents = () => {
  const index = Social.index("every", "every.near/type/event");

  let fetchedEvents = [];

  index.map((item) => {
    const path = `${item.accountId}/thing/${item.value.id}`;
    const blockHeight = item.blockHeight;

    const eventThing = Social.getr(path, blockHeight);
    fetchedEvents.push(eventThing.data);
  });

  return fetchedEvents;
};
