// CALENDAR FROM https://github.com/fullcalendar/fullcalendar/tree/main/bundle
const events = props.events || [];

const srcData = `
<!DOCTYPE html>
<html>
  <head>

    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet'>
    <link href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css' rel='stylesheet'>
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar/index.global.js'></script>
    <script>

      document.addEventListener('DOMContentLoaded', function() {
        const calendarEl = document.getElementById('calendar')
        const calendar = new FullCalendar.Calendar(calendarEl, {
          titleFormat: { year: 'numeric', month: 'long', },
          themeSystem: 'bootstrap5',
          initialView: 'dayGridMonth',
          editable: true,
          firstDay: 1,
          buttonText: {
            month: "Month",
            list: "List",
          },
          customButtons: {
            filterBy: {
              text: 'Filter by',
              click: function() {
                alert('clicked the custom button!');
              }
            },
            addEvent: {
              text: '',
              click: function() {
                location.href="google.com";
              }
            },
          },
          
          headerToolbar: {
            start: 'title prev,next dayGridMonth list', // will normally be on the left. if RTL, will be on the right
            // end: 'timeGridDay list' 
            end: 'filterBy addEvent' 
          },
          navLinks: true,
          events: ${JSON.stringify(events)},

          // Render the custom button with an icon
          viewDidMount: function () {
            var addEvent = document.querySelector('.fc-addEvent-button');
            addEvent.innerHTML = 'Add Event <i class="bi bi-plus-circle-fill" style="color: #05EB97; margin-left: 2px;"></i>';
          
            //
            // const titleElement = document.querySelector('.fc-toolbar-title');
            // const text = titleElement.textContent;
            // const words= text.split(" ");
            // words[0] = '<strong>' + words[0] + '</strong>';
            // titleElement.innerHTML = words.join(" ");
          }
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

  #calendar: {
    height:  100%;
  }

  .fc-col-header {
    border-radius: 0px 0px 6px 6px;
    background: rgba(237, 237, 237, 0.93);
  }

  .fc-scrollgrid-sync-inner a {
    text-decoration: none;
    color: #5C5F62;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .fc-toolbar-chunk {
    display: flex;
  }

  .fc .fc-button-primary {
    background-color: white;
    color: black;
    border: none;
  }

  .fc .fc-button-primary:hover{ 
    transition: 300ms;
  }

  .fc-dayGridMonth-button.fc-button.fc-button-primary {
    width: 67px;
    height: 35px;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 3px;

    background: rgba(3, 177, 114, 0.20);
    color: #03B172;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .fc-dayGridMonth-button.fc-button.fc-button-primary.fc-button-active {
    border: 1px solid #03B172;

    background-color: white;

    color: #03B172;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .fc-list-button.fc-button.fc-button-primary {
    display: flex;
    width: 67px;
    height: 35px;
    padding: 8px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 3px;
    background: rgba(3, 177, 114, 0.20);

    color: #03B172;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .fc-list-button.fc-button.fc-button-primary.fc-button-active {
    border: 1px solid #03B172;

    background-color: white;

    color: #03B172;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .fc-header-toolbar.fc-toolbar {
    display: flex;
    padding: 16px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;

    border-radius: 6px;
    border: 1px solid var(--Stroke, rgba(218, 220, 224, 0.60));
    background: #FFF;
  } 

  .fc .fc-toolbar.fc-header-toolbar {
    margin-bottom: 16px;
  }

  .fc-toolbar-title {
    font-weight: 400;
  }

  .fc-filterBy-button.fc-button.fc-button-primary {
    border-radius: 3px;
    background: #EEE;

    display: flex;
    height: 35px;
    padding: 8px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  .fc-addEvent-button.fc-button.fc-button-primary {
    display: flex;
    height: 35px;
    padding: 8px 16px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 3px;
    background: #03B172;

    color: #FFF;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .fc table {
    border-radius: 6px;
  }

  .fc .fc-daygrid-day-top {
    flex-direction: row;
  }

  .fc .fc-daygrid-day-number {
    display: flex;
    width: 22px;
    padding: 5px;
    align-items: flex-start;
    gap: 10px;

    text-decoration: none;

    color: #333;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .fc-day-past,
  .fc-day-other {
    background: #F2F2F2;
  }

  .fc .fc-view-harness-active > .fc-view {
    border-radius: 6px;
  }

  tbody, td, tfoot, th, thead, tr {
    border-radius: 6px;
  }
</style>
`;

return (
  <>
    <div className="container">
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
    </div>
  </>
);
