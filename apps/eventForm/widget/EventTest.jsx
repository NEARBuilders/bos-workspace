State.init({
  event: props.event || null,
});

const addEvent = (target) => {
  State.update({ event: target });
  console.log("Events: ", state.event);
};

return (
  <>
    <div>
      {!state.event ? (
        <Widget
          src="itexpert120.near/widget/EventForm"
          props={{ addEvent: addEvent }}
        />
      ) : (
        <Widget
          src="itexpert120.near/widget/EventView"
          props={{ data: state.event.data }}
        />
      )}
    </div>
  </>
);
