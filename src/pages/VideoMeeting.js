import { Fragment, useEffect, useState } from "react";
import ReviewForm from "../components/Form/ReviewForm";
import { useAppContext } from "../context/appContext";

import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { callControl, sendEmail } from "../api";

const VideoMeeting = () => {
  const [meetingId, setMeetingId] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const {
    type,
    meetingEmail,
    meetingCounsellorId,
    meetingCounsellor,
    counseleeId,
  } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getMeetingId = async () => {
      const { data } = await callControl();
      // console.log(data);
      setMeetingId(data);
    };
    getMeetingId();
  }, []);

  useEffect(() => {
    if (meetingId) {
      const meetingData = {
        counsellorEmail: meetingEmail,
        subject: "Counsultaion Meeting",
        message: `Today is your Counsultation meeting with : ${meetingCounsellor}. click on link to start ${meetingId}.`,
      };
      console.log(meetingData);
      const sendMeetingIdToCounsellor = async () => {
        try {
          const { data } = await sendEmail(
            `Email/SendEmail?toEmail=${meetingData.counsellorEmail}&subject=${meetingData.subject}&message=${meetingData.message}`
          );
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      };
      sendMeetingIdToCounsellor();
    }
  }, [meetingId]);

  const closeMeetingHandler = async (e) => {
    e.preventDefault();
    if (type === "Counselee") {
      setShowReviewForm(!showReviewForm);
    } else {
      setShowReviewForm(showReviewForm);
      navigate("/profile-page");
    }
  };

  return (
    <Fragment>
      {showReviewForm && (
        <ReviewForm
          counsellor_Id={meetingCounsellorId}
          rating_By={counseleeId}
        />
      )}
      <div
        style={{
          margin: "20px auto",
          width: "60vw",
          height: "100vh",
        }}
      >
        <iframe
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          src={meetingId}
          style={{ border: "0px", width: "100%", height: "90%" }}
          title="Join Meeting"
        ></iframe>
        <Button
          style={{ backgroundColor: "skyblue", color: "white" }}
          onClick={closeMeetingHandler}
        >
          Close Meeting
        </Button>
      </div>
    </Fragment>
  );
};

export default VideoMeeting;
