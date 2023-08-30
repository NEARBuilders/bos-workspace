const fetchAllEvents = () => {
  const index = Social.index("every", "every.near/type/event");

  if (!index) return <div>Loading...</div>;

  let fetchedEvents = [];

  index.map((it) => {
    const path = `${it.accountId}/thing/${it.value.id}`;
    const blockHeight = it.blockHeight;

    const eventThing = Social.getr(path, blockHeight);
    fetchedEvents.push(eventThing.data);
  });

  return fetchedEvents;
};
