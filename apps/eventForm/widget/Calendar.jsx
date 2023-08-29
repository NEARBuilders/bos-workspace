// CALENDAR FROM https://github.com/fullcalendar/fullcalendar/tree/main/bundle
const events = props.events || [];

const srcData = `
<!DOCTYPE html>
<html>
  <head>
    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet'>
    <link href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css' rel='stylesheet'>
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar/index.global.min.js'></script>
    <script>

      document.addEventListener('DOMContentLoaded', function() {
        const calendarEl = document.getElementById('calendar')
        const calendar = new FullCalendar.Calendar(calendarEl, {
          titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
          themeSystem: 'bootstrap5',
          initialView: 'timeGridDay',
          editable: true,
          customButtons: {
            getEvents: {
              text: 'load events',
              click: () => window.top.postMessage({ score: "hello" }, "*")
            }
          },
          headerToolbar: {
            start: 'prev,next today', // will normally be on the left. if RTL, will be on the right
            // center: 'title',
            end: 'timeGridDay list' 
            // end: 'timeGridDay dayGridMonth dayGridWeek dayGridDay list' 
          },
          navLinks: true,
          events: ${JSON.stringify(events)}
        })
        calendar.render()
      })
    </script>
    
  </head>
  <body>
    <div id='calendar'></div>
  </body>
</html>

<style>
html,
body {
  height: 100%;
}

#calendar {
  height: 100%;
}

</style>

`;

return (
  <>
    <iframe
      srcDoc={srcData}
      onMessage={(data) => {
        console.log(data);
      }}
      style={{
        height: "100vh",
        width: "100%",
      }}
    />
  </>
);
