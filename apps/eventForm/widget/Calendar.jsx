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
              click: function(e) {
                e.preventDefault();
                window.parent.postMessage(JSON.stringify({ handler: "filter"}), '*');
              }
            },
            addEvent: {
              text: '',
              click: function(e) {
                e.preventDefault();
                window.parent.postMessage(JSON.stringify({ handler: "add-event"}), '*');
              }
            },
          },
          expandRows: true,
          headerToolbar: {
            start: 'title prev,next dayGridMonth list', // will normally be on the left. if RTL, will be on the right
            center: '',
            // end: 'timeGridDay list' 
            end: 'filterBy addEvent' 
          },
          navLinks: true,
          events: ${JSON.stringify(events)},
          eventClick: function(info) {
            info.jsEvent.preventDefault(); // don't let the browser navigate
            // Post the event details to the parent window
            window.parent.postMessage(JSON.stringify({ handler: "event-click", data: info.event }), '*');
          },

          // Render the custom button with an icon
          viewDidMount: function () {
            var addEvent = document.querySelector('.fc-addEvent-button');
            addEvent.innerHTML = 'Add Event <i class="bi bi-plus-circle-fill" style="color: #05EB97; margin-left: 2px;"></i>';
        
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

  @media (width < 720px) {
    .fc .fc-toolbar-title {
      font-size: 1rem;
    }

    .fc-toolbar-chunk {
      display: flex;
      align-items: center;
    }
  }

  @media (width < 550px) {
    .fc-dayGridMonth-button.fc-button.fc-button-primary {
      font-size: 0.75rem;
      width: 50px;
      height: 30px;
      padding: 0.5rem;
    }

    .fc-list-button.fc-button.fc-button-primary {
      font-size: 0.75rem;
      width: 50px;
      height: 30px;
      padding: 0.5rem;
    }

    .fc-filterBy-button.fc-button.fc-button-primary {
      font-size: 0.75rem;
      width: 60px;
      height: 30px;
      padding: 0.5rem;
    }

    .fc-addEvent-button.fc-button.fc-button-primary {
      font-size: 0.75rem;
      width: 95px;
      height: 30px;
      padding: 0.5rem;
    }

    .fc-prev-button.fc-button.fc-button-primary {
      font-size: 0.75rem;
    }

    .fc-next-button.fc-button.fc-button-primary {
      font-size: 0.75rem;
    }
  }

  @media (width < 480px) {
    .fc-header-toolbar.fc-toolbar {
      padding: 0.25rem;
      text-align: center;
    } 

    .fc-direction-ltr .fc-toolbar > * > :not(:first-child) {
      margin-left: 0px;
    }

    .fc-prev-button.fc-button.fc-button-primary {
      padding: 2px;
    }

    .fc-next-button.fc-button.fc-button-primary {
      padding: 2px;
    }

    .fc-dayGridMonth-button.fc-button.fc-button-primary {
      font-size: 0.75rem;
      width: 50px;
      height: 30px;
      padding: 0.5rem;
    }

    .fc-list-button.fc-button.fc-button-primary {
      font-size: 0.75rem;
      width: 50px;
      height: 30px;
      padding: 0.5rem;
    }

    .fc-filterBy-button.fc-button.fc-button-primary {
      font-size: 0.75rem;
      width: 60px;
      height: 30px;
      padding: 0.5rem;
    }

    .fc-addEvent-button.fc-button.fc-button-primary {
      font-size: 0.75rem;
      width: 65px;
      height: 30px;
      padding: 0.2rem;
    }

    .fc-addEvent-button.fc-button.fc-button-primary i {
      display: none;
    }
  }

</style>
`;

return (
  <>
    <div>
      <iframe
        srcDoc={srcData}
        onMessage={(data) => {
          const dataObj = JSON.parse(data);
          switch (dataObj.handler) {
            case "filter": {
              if (props.handleFilter) {
                props.handleFilter();
              }
              break;
            }
            case "add-event": {
              if (props.handleAddEvent) {
                props.handleAddEvent();
              }
              break;
            }
            case "event-click": {
              if (props.handleEventClick) {
                props.handleEventClick();
              }
              break;
            }
          }
        }}
        style={{
          height: "100vh",
          width: "100%",
        }}
      />
    </div>
  </>
);
