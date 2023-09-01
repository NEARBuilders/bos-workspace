/*__@import:everything/utils/fetchEvents__*/

State.init({
  hideNewEventModal: true,
  hideFilterModal: true,
  filterFrom: null,
  filterTo: null,
  filterEvents: false,
  filteredEvents: null,
});

const toggleFilteredEvents = () => {
  State.update({
    filterEvents: !state.filterEvents,
  });
};

const toggleNewEventModal = () => {
  State.update({ hideNewEventModal: !state.hideNewEventModal });
};

const toggleFilterModal = () => {
  State.update({ hideFilterModal: !state.hideFilterModal });
};

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

const handleEventClick = () => {
  console.log("handleEventClick");
};

const handleAddEvent = () => {
  toggleNewEventModal();
};

const handleFilter = () => {
  toggleFilterModal();
};

const newEventModalProps = {
  title: "Create event",
  body: <Widget src="itexpert120-contra.near/widget/CreateEvent" />,
  confirmText: "Create a new event",
  onConfirm: () => {
    console.log("confirm");
  },
  hidden: state.hideNewEventModal,
  onClose: toggleNewEventModal,
  showFooter: false,
};

const filterForm = () => {
  const onFilterFromUpdate = ({ target }) => {
    State.update({ filterFrom: target.value });
  };

  const onFilterToUpdate = ({ target }) => {
    State.update({ filterTo: target.value });
  };

  const onFilterClear = () => {
    toggleFilteredEvents();
    toggleFilterModal();
  };

  return (
    <div className="container ">
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="date-from">From</label>
          <input
            className="form-control"
            id="date-from"
            name="date-from"
            type="date"
            value={state.filterFrom}
            onChange={onFilterFromUpdate}
          />
        </div>
        <div className="col">
          <label htmlFor="date-to">To</label>
          <input
            className="form-control"
            id="date-to"
            name="date-to"
            type="date"
            value={state.filterTo}
            onChange={onFilterToUpdate}
          />
        </div>
      </div>
      <button onClick={onFilterClear}>Clear Filters</button>
    </div>
  );
};

const onFilterEvents = () => {
  const filterTo = new Date(state.filterTo);
  const filterFrom = new Date(state.filterFrom);

  State.update({
    filteredEvents: formattedEvents.filter(
      (ev) => ev.start >= filterFrom && ev.end <= filterTo
    ),
  });

  toggleFilteredEvents();

  toggleFilterModal();
};

const filterModalProps = {
  title: "Event filters",
  body: <filterForm />,
  confirmText: "Filter events",
  onConfirm: onFilterEvents,
  hidden: state.hideFilterModal,
  onClose: toggleFilterModal,
  showFooter: true,
};

const calendarProps = {
  events: state.filterEvents ? state.filteredEvents : formattedEvents,
  handleEventClick,
  handleAddEvent,
  handleFilter,
};

return (
  <div>
    <Widget
      src="itexpert120-contra.near/widget/Calendar"
      props={{
        ...calendarProps,
      }}
    />

    <Widget
      src="itexpert120-contra.near/widget/Modal"
      props={{ ...newEventModalProps }}
    />
    <Widget
      src="itexpert120-contra.near/widget/Modal"
      props={{ ...filterModalProps }}
    />
  </div>
);
