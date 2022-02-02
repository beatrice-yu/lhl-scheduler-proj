import React from "react";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

import useApplicationData from "hooks/useApplicationData";

export default function Application(props) {
  // const [state, setState] = useState({
  //   day: 'Monday',
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // });

  // const bookInterview = (id, interview) => {
  //   console.log(id, interview);

  //   const appointment = {
  //     ...state.appointments[id],
  //     interview: { ...interview },
  //   };

  //   const appointments = {
  //     ...state.appointments,
  //     [id]: appointment,
  //   };

  //   setState({
  //     ...state,
  //     appointments,
  //   });

  //   return axios
  //     .put(`http://localhost:8001/api/appointments/${id}`, { interview })
  //     .then(res => {
  //       setState({
  //         ...state,
  //         appointments,
  //       });
  //     });
  // };

  // const cancelInterview = (id) => {
  //   const appointment = {
  //     ...state.appointments[id],
  //     interview: null
  //   };

  //   const appointments = {
  //     ...state.appointments,
  //     [id]: appointment
  //   };

  //   return axios
  //     .delete(`http://localhost:8001/api/appointments/${id}`)
  //     .then(() => {
  //       setState({
  //         ...state,
  //         appointments
  //       });
  //     });
  // };

  // const dailyAppointments = getAppointmentsForDay(state, state.day);
  // const schedule = dailyAppointments.map((appointment) => {
  //   const interview = getInterview(state, appointment.interview);
    
  //   return (
  //     <Appointment
  //       key={appointment.id}
  //       id={appointment.id}
  //       time={appointment.time}
  //       interview={interview}
  //       interviewers={getInterviewersForDay(state, state.day)}
  //       bookInterview={bookInterview}
  //       cancelInterview={cancelInterview}
  //     />
  //   );
  // });

  // const setDay = day => setState({ ...state, day });
  // //const setDays = days => setState(prev => ({ ...prev, days }));

  // useEffect(() => {
  //   Promise.all([
  //     axios.get("http://localhost:8001/api/days"),
  //     axios.get("http://localhost:8001/api/appointments"),
  //     axios.get("http://localhost:8001/api/interviewers")
  //   ]).then((all) => {
  //     setState({
  //       days: all[0].data,
  //       appointments: all[1].data,
  //       interviewers: all[2].data
  //     });
  //   });
  // }, []);

  // return (
  //   <main className="layout">
  //     <section className="sidebar">
  //     <img
  //       className="sidebar--centered"
  //       src="images/logo.png"
  //       alt="Interview Scheduler"
  //     />
  //     <hr className="sidebar__separator sidebar--centered" />
  //     <nav className="sidebar__menu">
  //       <DayList
  //         days={state.days}
  //         day={state.day}
  //         setDay={setDay}
  //       />
  //     </nav>
  //     <img
  //       className="sidebar__lhl sidebar--centered"
  //       src="images/lhl.png"
  //       alt="Lighthouse Labs"
  //     />
  //     </section>
  //     <section className="schedule">
  //       {schedule}
  //     </section>
  //   </main>
  // );

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const interviewers = getInterviewersForDay(state, state.day);

  const appointments = getAppointmentsForDay(state, state.day).map(
    appointment => {
      return (
        <Appointment
          key={appointment.id}
          {...appointment}
          interview={getInterview(state, appointment.interview)}
          interviewers={interviewers}
          bookInterview={bookInterview}
          cancelInterview={cancelInterview}
        />
      );
    }
  );

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        <section className="schedule">
          {appointments}
          <Appointment key="last" time="5pm" />
        </section>
      </section>
    </main>
  );
}
