State.init({
  events: props.events || [],
});

const addEvent = (target) => {
  State.update({ events: [...state.events, target] });
  console.log("Events: ", state.events);
};

return (
  <>
    <div>
      <Widget
        src="itexpert120.near/widget/EventForm"
        props={{ addEvent: addEvent }}
      />
    </div>
  </>
);
