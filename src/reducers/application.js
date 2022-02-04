//export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

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

export default reducer;