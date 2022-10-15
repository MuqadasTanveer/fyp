import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

import { useAppContext } from "../../context/appContext";
import "./AppointmentDetailCard.css";
import { dellAppointmentbyId, getAppointmentCounsellorId } from "../../api";

const AppointmentDetailCard = ({
  id,
  counselee_Id,
  counselee_Name,
  counsellors_Id,
  counsellors_Name,
  date,
  message,
  age,
  gender,
  number,
  isCounselor,
  localISOTime,
}) => {
  const [showModel, setShowModel] = useState(false);
  const [IsTodayMeet, setIsTodayMeet] = useState(false);
  const [counsellorData, setCounsellorData] = useState([]);
  const navigate = useNavigate();
  const { handleChange } = useAppContext();

  const deleteAppintmentHandler = async (id) => {
    await dellAppointmentbyId(id);
    // console.log(data);
    navigate("/counselors");
  };

  useEffect(() => {
    const getCounsellorData = async (id) => {
      try {
        const { data } = await getAppointmentCounsellorId(id);
        setCounsellorData(data[0]);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCounsellorData(counsellors_Id);
  }, [counsellors_Id]);

  // ///////////////
  //// function to check is today meeting
  useEffect(() => {
    if (localISOTime === date.slice(0, 13)) return setIsTodayMeet(true);
  }, [date, localISOTime]);

  const handleCloseModel = () => setShowModel(false);
  const handleShowModel = () => setShowModel(true);

  const meetingHandler = () => {
    handleChange({
      name: "meetingCounsellor",
      value: counsellors_Name,
    });
    handleChange({
      name: "meetingEmail",
      value: counsellorData.email,
    });
    handleChange({
      name: "meetingCounsellorId",
      value: counsellors_Id,
    });
    navigate("/video-meeting");
  };

  return (
    <Fragment>
      <div className="appointmentDetailCard">
        {IsTodayMeet && !isCounselor && (
          <div className="active-counselee">
            <p
              onClick={meetingHandler}
              style={{
                cursor: "pointer",
              }}
            >
              Today, Click to Start
            </p>
          </div>
        )}
        {IsTodayMeet && isCounselor && (
          <div className="active-counselee">
            <p>Today, Check your Gmail</p>
          </div>
        )}
        <img
          src={`https://dummyimage.com/400x400/2be3e0/595959&text=${
            isCounselor
              ? counselee_Name?.slice(0, 1)
              : counsellors_Name?.slice(0, 1)
          }`}
          alt=""
          style={{ width: "50px", height: "100%", borderRadius: "50%" }}
        />
        <div className="mx-2">
          <h6>
            Name : {""}
            {isCounselor ? counselee_Name : counsellors_Name}
          </h6>
          {/* {console.log({ fetchedAppoitmentDetail })} */}
          {!isCounselor && <h6>{counsellorData.email}</h6>}
          {isCounselor && <h6>Age : {age}</h6>}
          {isCounselor && <h6>Gender : {gender}</h6>}
          {isCounselor && <h6>phone Number : {number}</h6>}
          <h6>Date : {date}</h6>

          <p>{message.slice(0, 100)}</p>
        </div>
      </div>
      <div className="ms-2 "></div>
      {!isCounselor && (
        <div className="mb-5">
          <Button
            variant="primary"
            className="btn btn-round-full fs-1 bg-danger"
            onClick={handleShowModel}
          >
            Cancel Appointment
          </Button>

          <Modal show={showModel} onHide={handleCloseModel}>
            <Modal.Header closeButton>
              <Modal.Title>Appointment Cancellation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="text-danger">
                Are you Sure ? You want to cancel this Appointment {id}
              </p>{" "}
            </Modal.Body>
            <Modal.Footer>
              <div className="d-flex">
                <Button
                  variant="info"
                  className="btn-round-full fs-1 me-2"
                  onClick={handleCloseModel}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  className="btn-round-full fs-1"
                  onClick={() => deleteAppintmentHandler(id)}
                >
                  Confirm
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </Fragment>
  );
};

export default AppointmentDetailCard;
