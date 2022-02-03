import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_DAY:
      return {
        ...state,
        day: action.value
      };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.value.days,
        appointments: action.value.appointments,
        interviewers: action.value.interviewers
      };
    case SET_INTERVIEW: {
      const appointments = { ...state.appointments };
      appointments[action.value.id] = { ...appointments[action.value.id], interview: action.value.interview };

      const days = [...state.days];

      days.forEach(day => {
        let spots = 0;
        
        day.appointments.forEach(id => {
          if (!appointments[id].interview) {
            spots++;
          }
        });

        day.spots = spots;
      });

      return {
        ...state,
        appointments,
        days
      };
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

const useApplicationData = (initial) => {
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  async function bookInterview(id, interview) {
    const result = await axios
      .put(`/api/appointments/${id}`, { interview })
      .then(res => {
        dispatch({
          type: SET_INTERVIEW,
          value: {
            id,
            interview
          }
        });
      })
      .catch(err => {
        console.log(err);
      });

    return result;
  };

  async function cancelInterview(id) {
    const result = await axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          value: {
            id,
            interview: null
          }
        });
      });
      
    return result;
  };

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onopen = function (event) {
      webSocket.send("ping");
    };

    webSocket.onmessage = function (event) {
      const messageReceived = JSON.parse(event.data);

      dispatch({
        type: SET_INTERVIEW,
        value: {
          id: messageReceived.id,
          interview: messageReceived.interview
        }
      });
    }

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        value: {
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }
      });
    });

    return () => webSocket.close();
  }, []);

  const setDay = day => dispatch({ type: SET_DAY, value: day });

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;