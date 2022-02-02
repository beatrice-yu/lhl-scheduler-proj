export function getAppointmentsForDay(state, day) {
  const days = state.days;
  const index = days.findIndex(x => x.name === day);

  if (index === -1) {
    return [];
  }

  return days[index].appointments.map(index => state.appointments[index]);
};

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewer = state.interviewers[interview.interviewer];
  return { ...interview, interviewer };
};

export function getInterviewersForDay(state, day) {
  const days = state.days;
  const index = days.findIndex(x => x.name === day);

  if (index === -1) {
    return [];
  }

  return days[index].interviewers.map(index => state.interviewers[index]);
}