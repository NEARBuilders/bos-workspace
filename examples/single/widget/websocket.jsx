if (state.ws === undefined) {
  const eventsFilter = {
    status: "SUCCESS",
    event: "fileChange",
  };

  function startWebSocket(processEvents) {
    let ws = State.get().ws;

    if (ws) {
      ws.close();
      return;
    }

    ws = new WebSocket("ws://127.0.0.1:8080");

    ws.onopen = () => {
      console.log(`Connection to WS has been established`);
      ws.send(
        JSON.stringify({
          secret: "near-social-events",
          filter: eventsFilter,
          fetch_past_events: 100,
        })
      );
    };
    ws.onclose = () => {
      State.update({ ws: null });
      console.log(`WS Connection has been closed`);
      State.get().startWebSocket(processEvents);
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      processEvents(data.events);
    };
    ws.onerror = (err) => {
      State.update({ ws: null });
      console.log("WebSocket error", err);
    };

    State.update({ ws });
  }

  function processEvent(event) {
    return {
      time: new Date(event.block_timestamp * 1000),
      event: event.event,
      predecessorId: event.predecessor_id,
    };
  }

  function processEvents(events) {
    events = events.flatMap(processEvent);
    events.reverse();

    State.update((state) => {
      const prevActions = state.actions || [];
      state.actions = [
        ...events.filter(
          (event) =>
            prevActions.length === 0 ||
            event.time.getTime() > prevActions[0].time.getTime()
        ),
        ...prevActions,
      ].slice(0, 10);
      return state;
    });
  }

  State.init({
    startWebSocket,
  });
  state.startWebSocket(processEvents);
}

return state.actions;