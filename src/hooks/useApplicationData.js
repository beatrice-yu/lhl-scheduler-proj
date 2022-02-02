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

  const updateInterviewSpots = (id, transaction) => {
    const day = state.days.find(day => day.name === state.day);

    switch (transaction) {
      case 'cancel':
        day.spots++;
        break;
      case 'book':
        (state.appointments[id].interview === null) && day.spots--;
        break;
      default:
        break;
    }
  };

  const bookInterview = (id, interview) => {
    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(res => {
        dispatch({
          type: SET_INTERVIEW,
          value: {
            id,
            interview
          }
        });
      })
      .then(() => {
        updateInterviewSpots(id, 'book');
      });
  };

  const cancelInterview = (id) => {
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          value: {
            id,
            interview: null
          }
        });
      })
      .then(() => {
        updateInterviewSpots(id, 'cancel');
      });
  };

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onopen = function (event) {
      webSocket.send("ping");
    };

    webSocket.onmessage = function (event) {
      console.log("Message Received: ", event.data);
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
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
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
  }, []);

  const setDay = day => dispatch({ type: SET_DAY, value: day });

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;