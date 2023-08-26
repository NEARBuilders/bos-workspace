const getCurrentDate = () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const day = currentDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
  const currentDate = new Date();

  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

State.init({
  id: "",
  title: "",
  description: {
    content: "",
  },
  start: getCurrentDate(),
  startTime: getCurrentTime(),
  end: getCurrentDate(),
  endTime: getCurrentTime(),
  location: "",
  link: "",
  organizer: "",
  isAllDay: false,
  category: "",
  logo: null,
  background: null,
  tempHash: "",
  hashTags: [],

  events: [],
});

const onIdChange = ({ target }) => {
  State.update({ id: target.value });
};

const onTitleChange = ({ target }) => {
  State.update({ title: target.value });
};

const onDescriptionChange = (target) => {
  State.update({ description: { content: target } });
};

const onStartChange = ({ target }) => {
  State.update({ start: target.value });
  console.log(state.start);
};

const onStartTimeChange = ({ target }) => {
  State.update({ startTime: target.value });
  console.log(state.startTime);
};

const onEndChange = ({ target }) => {
  State.update({ end: target.value });
};

const onEndTimeChange = ({ target }) => {
  State.update({ endTime: target.value });
};

const onLocationChange = ({ target }) => {
  State.update({ location: target.value });
};

const onLinkChange = ({ target }) => {
  State.update({ link: target.value });
};

const onOrganizerChange = ({ target }) => {
  State.update({ organizer: target.value });
};

const onCategoryChange = ({ target }) => {
  State.update({ category: target.value });
};

const onIsAllDayChange = () => {
  State.update({ isAllDay: !state.isAllDay });
};

const onLogoChange = (target) => {
  State.update({ logo: target });
};

const onBackgroundChange = (target) => {
  State.update({ background: target });
};

const onTempHashChange = ({ target }) => {
  State.update({ tempHash: target.value });
};

const onHashTagAdd = () => {
  State.update({ hashTags: [...state.hashTags, state.tempHash] });
  State.update({ tempHash: "" });
};

const clearFields = () => {
  State.update({
    id: "",
    title: "",
    description: {
      content: "",
    },
    start: getCurrentDate(),
    startTime: getCurrentTime(),
    end: getCurrentDate(),
    endTime: getCurrentTime(),
    location: "",
    link: "",
    organizer: "",
    isAllDay: false,
    category: "",
    logo: null,
    background: null,
    tempHash: "",
    hashTags: [],
  });
};

const handleNewEvent = () => {
  const newEvent = {
    id: state.id,
    title: state.title,
    description: state.description,
    start: state.start,
    startTime: state.startTime,
    end: state.end,
    endTime: state.endTime,
    location: state.location,
    link: state.link,
    organizer: state.organizer,
    isAllDay: state.isAllDay,
    category: state.category,
    logo: state.logo,
    background: state.background,
    hashTags: state.hashTags,
  };

  State.update({ events: [...state.events, newEvent] });
  clearFields();

  console.log(state.events);
};

const CreateEvent = () => {
  return (
    <div className="container">
      <h2>Create Event</h2>
      <div>
        <div className="mb-3">
          <label class="form-label" for="id">
            Event ID
          </label>
          <input
            class="form-control"
            id="id"
            value={state.id}
            onChange={onIdChange}
          />
        </div>
        <div className="mb-3">
          <label class="form-label" for="title">
            Event Title
          </label>
          <input
            class="form-control"
            id="title"
            value={state.title}
            onChange={onTitleChange}
          />
        </div>
        <div className="mb-3">
          <label class="form-label" for="description">
            Event Description
          </label>
          <Widget
            src="efiz.near/widget/every.markdown.create"
            props={{
              data: state.description,
              onChange: onDescriptionChange,
            }}
          />
        </div>
        <div className="d-flex justify-content-around gap-3 mb-3">
          <div className="flex-fill">
            <label for="start">Event Start Date</label>
            <input
              class="form-control"
              id="start"
              type="date"
              value={state.start}
              onChange={onStartChange}
            />
          </div>
          <div className="flex-fill">
            <label for="startTime">Event Start Time</label>
            <input
              class="form-control"
              id="startTime"
              type="time"
              value={state.startTime}
              onChange={onStartTimeChange}
            />
          </div>
        </div>
        <div className="d-flex justify-content-around gap-3 mb-3">
          <div className="flex-fill">
            <label for="end">Event End Date</label>
            <input
              class="form-control"
              id="end"
              type="date"
              value={state.end}
              onChange={onEndChange}
            />
          </div>
          <div className="flex-fill">
            <label for="endTime">Event End Time</label>
            <input
              class="form-control"
              id="endTime"
              type="time"
              value={state.endTime}
              onChange={onEndTimeChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <label class="form-label" for="location">
            Event Location
          </label>
          <input
            class="form-control"
            id="location"
            value={state.location}
            onChange={onLocationChange}
          />
        </div>
        <div className="mb-3">
          <label class="form-label" for="link">
            Event Link
          </label>
          <input
            class="form-control"
            id="link"
            type="url"
            value={state.link}
            onChange={onLinkChange}
          />
        </div>
        <div className="mb-3">
          <label class="form-label" for="organizer">
            Event Organizer
          </label>
          <input
            class="form-control"
            id="organizer"
            value={state.organizer}
            onChange={onOrganizerChange}
          />
        </div>
        <div className="mb-3">
          <div class="form-check">
            <label class="form-check-label" for="isAllDay">
              All Day Event
            </label>
            <input
              value={state.isAllDay}
              checked={state.isAllDay}
              class="form-check-input"
              type="checkbox"
              id="isAllDay"
              onChange={onIsAllDayChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <label class="form-label" for="category">
            Event Category
          </label>
          <input
            class="form-control"
            id="category"
            value={state.category}
            onChange={onCategoryChange}
          />
        </div>
        <div className="mb-3 d-flex flex-justify-content-around gap-3">
          <div className="flex-fill">
            <label>Logo Image</label>
            <Widget
              src="near/widget/ImageEditorTabs"
              props={{ image: state.logo, onChange: onLogoChange }}
            />
          </div>
          <div className="flex-fill">
            <label>Background Image</label>
            <Widget
              src="near/widget/ImageEditorTabs"
              props={{ image: state.background, onChange: onBackgroundChange }}
            />
          </div>
        </div>
        <div className="mb-3">
          <label for="hashtags">
            <p>
              Hashtags:{" "}
              {state.hashTags.length !== 0 &&
                state.hashTags.map((item) => (
                  <>
                    <span className="badge bg-secondary">{item}</span>{" "}
                  </>
                ))}
            </p>
          </label>
          <div className="d-flex gap-3">
            <input
              id="hashtags"
              value={state.tempHash}
              onChange={onTempHashChange}
            />
            <button onClick={onHashTagAdd}>Add</button>
          </div>
        </div>
        <div className="mb-3">
          <button onClick={handleNewEvent}>Add Event</button>
        </div>
      </div>
    </div>
  );
};

return (
  <div>
    <CreateEvent />
    <Widget
      src="evrything.near/widget/Calendar"
      props={{ events: state.events }}
    />
  </div>
);
