import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

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