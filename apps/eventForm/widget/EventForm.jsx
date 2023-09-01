/*__@import:everything/utils/UUID__*/
/*__@import:everything/utils/date-time__*/

const addEvent = props.addEvent;

let user_account = context.accountId;

State.init({
  id: UUID.generate(),
  title: "",
  description: {
    content: "# New Event Description",
  },
  start: getCurrentDate(),
  startTime: getCurrentTime(),
  end: getCurrentDate(),
  endTime: getCurrentTime(),
  location: "",
  link: "",
  organizer: user_account,
  isAllDay: false,
  category: "",
  logo: null,
  background: null,
  tempHash: "",
  hashTags: [],
});

const onTitleChange = ({ target }) => {
  State.update({ title: target.value });
};

const onDescriptionChange = (target) => {
  State.update({ description: target });
};

const onStartChange = ({ target }) => {
  State.update({ start: target.value });
};

const onStartTimeChange = ({ target }) => {
  State.update({ startTime: target.value });
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

const onHashTagRemove = (target) => {
  const newTags = state.hashTags.filter((item) => item !== target);
  State.update({ hashTags: newTags });
};

const clearFields = () => {
  State.update({
    title: "",
    description: {
      content: "# New Event Description",
    },
    start: getCurrentDate(),
    startTime: getCurrentTime(),
    end: getCurrentDate(),
    endTime: getCurrentTime(),
    location: "",
    link: "",
    organizer: user_account,
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
    data: {
      title: state.title,
      description: state.description,
      start: isoDate(state.start, state.startTime),
      startTime: isoTime(state.start, state.startTime),
      end: isoDate(state.end, state.endTime),
      endTime: isoTime(state.end, state.endTime),
      location: state.location,
      link: state.link,
      organizer: state.organizer,
      isAllDay: state.isAllDay,
      category: state.category,
      logo: state.logo,
      background: state.background,
      hashTags: state.hashTags,
    },
    template: {
      src: "itexpert120-contra.near/widget/EventView",
    },
    type: "every.near/type/event",
  };

  addEvent(newEvent);
  clearFields();
};

const EventForm = () => {
  return (
    <div className="container">
      <div>
        <div className="mb-3">
          <label class="form-label" for="title">
            Event Title
          </label>
          <input
            class="form-control"
            id="title"
            value={state.title}
            onChange={onTitleChange}
            placeholder="New Event Title"
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
              height: "250px",
            }}
          />
        </div>
        <div className="row mb-3">
          <div className="col">
            <label for="start">Event Start Date</label>
            <input
              class="form-control"
              id="start"
              type="date"
              value={state.start}
              onChange={onStartChange}
            />
          </div>
          <div className="col">
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
        <div className="row  mb-3">
          <div className="col">
            <label for="end">Event End Date</label>
            <input
              class="form-control"
              id="end"
              type="date"
              value={state.end}
              onChange={onEndChange}
            />
          </div>
          <div className="col">
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
            placeholder="New Event Location"
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
            placeholder="New Event Link"
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
            placeholder="New Event Organizer"
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
            placeholder="New Event Category"
          />
        </div>
        <div className="mb-3 row ">
          <div className="col">
            <label>Logo Image</label>
            <Widget
              src="near/widget/ImageEditorTabs"
              props={{ image: state.logo, onChange: onLogoChange }}
            />
          </div>
          <div className="col">
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
                    <span className="badge text-bg-primary">
                      {item}{" "}
                      <i
                        className="bi bi-x ms-2 p-1"
                        onClick={() => onHashTagRemove(item)}
                      ></i>
                    </span>{" "}
                  </>
                ))}
            </p>
          </label>
          <div className="d-flex gap-3">
            <input
              id="hashtags"
              value={state.tempHash}
              onChange={onTempHashChange}
              placeholder="New Event Tags"
            />
            <button onClick={onHashTagAdd}>Add</button>
          </div>
        </div>
        <div className="mb-3">
          <button onClick={handleNewEvent}>Add Event</button>
          <button onClick={clearFields}>Clear Fields</button>
        </div>
      </div>
    </div>
  );
};

return <EventForm />;
