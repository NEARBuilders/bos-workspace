/*__@import:everything/utils/UUID__*/

State.init({
  event: props.event || null,
});

const addEvent = (target) => {
  const thingId = UUID.generate();

  // index new event
  Social.set({
    thing: {
      [thingId]: target,
    },
    index: {
      every: JSON.stringify({
        key: "every.near/type/event",
        value: {
          type: "every.near/type/event",
          id: thingId,
        },
      }),
    },
  });

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
