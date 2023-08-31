/*__@import:everything/utils/fetchEvents__*/

const fetchedEvents = fetchAllEvents();

if (!fetchedEvents) {
  return <div>Loading...</div>;
}

const formattedEvents = fetchedEvents.map((event) => {
  return {
    title: event.title,
    start: new Date(`${event.start} ${event.startTime}`),
    end: new Date(`${event.end} ${event.endTime}`),
    url: event.link,
    allDay: event.isAllDay === "true",
    editable: false,
    extendedProps: {
      category: event.category,
    },
    description: event.description,
  };
});

return (
  <div className="container">
    <Widget
      src="itexpert120-contra.near/widget/Calendar"
      props={{ events: formattedEvents }}
    />
  </div>
);
