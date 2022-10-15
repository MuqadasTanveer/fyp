import "./Dashboard.css";
import { useState, useEffect } from "react";
import CounsellorDetailAdmin from "../components/Card/CounsellorDetailAdmin";
import CounseleeDetailAdmin from "../components/Card/CounseleeDetailAdmin";
import AppointmentDetailAdmin from "../components/Card/AppointmentDetailAdmin";

import { useAppContext } from "../context/appContext";
import { getAllCounsellors, getAllCounselees, getAllAppointment } from "../api";

const Dashboard = () => {
  const [fetchedCounsellors, setFetchedCounsellors] = useState([]);
  const [fetchedCounselees, setFetchedCounselees] = useState([]);
  const [fetchedAllAppointment, setFetchedAllAppointment] = useState([]);
  const [counsellorChange, setCounsellorChange] = useState(false);
  const [counseleeChange, setCounseleeChange] = useState(false);
  const [appointmentChange, setAppointmentChange] = useState(false);
  const { error, handleError } = useAppContext();

  // get all Counselors from Backend
  useEffect(() => {
    const fetchAllCounsellors = async () => {
      try {
        const { data } = await getAllCounsellors();
        setFetchedCounsellors(data);
        handleError("");
      } catch (error) {
        // console.log(error.response.data);
        handleError(error.response.data);
      }
    };
    fetchAllCounsellors();
  }, [counsellorChange]);

  // get all Counselees from Backend
  useEffect(() => {
    const fetchAllCounselees = async () => {
      try {
        const { data } = await getAllCounselees();
        setFetchedCounselees(data);
        handleError("");
      } catch (error) {
        // console.log(error.response.data);
        handleError(error.response.data);
      }
    };
    fetchAllCounselees();
  }, [counseleeChange]);
  // get all Appointment from Backend
  useEffect(() => {
    const fetchAllApointments = async () => {
      try {
        const { data } = await getAllAppointment();
        setFetchedAllAppointment(data);
        handleError("");
      } catch (error) {
        // console.log(error.response.data);
        handleError(error.response.data);
      }
    };
    fetchAllApointments();
  }, [appointmentChange]);

  return (
    <div className="detail">
      {error && <p className="text-danger">{error}</p>}
      <div>
        <h3>Counsellor Detail</h3>
        <div className="counsellor-detail">
          {fetchedCounsellors &&
            fetchedCounsellors.map((data) => (
              <CounsellorDetailAdmin
                key={data.counsellorsId}
                {...data}
                counsellorHandler={() => setCounsellorChange(!counsellorChange)}
              />
            ))}
        </div>
      </div>
      <div>
        <h3>Counselee Detail</h3>
        <div className="counselee-detail">
          {fetchedCounselees &&
            fetchedCounselees.map((data) => (
              <CounseleeDetailAdmin
                key={data.counseleeId}
                {...data}
                counseleeHandler={() => setCounseleeChange(!counseleeChange)}
              />
            ))}
        </div>
      </div>
      <div>
        <h3>Appointment Detail</h3>
        <div className="counselee-detail">
          {fetchedAllAppointment &&
            fetchedAllAppointment.map((data) => (
              <AppointmentDetailAdmin
                key={data.id}
                {...data}
                appointmentHandler={() =>
                  setAppointmentChange(!appointmentChange)
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
