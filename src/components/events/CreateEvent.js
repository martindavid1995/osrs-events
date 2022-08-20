import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Card, Alert, Container, Button, Row, Col } from "react-bootstrap";
import EventCreationSlice from "./EventCreationSlice";

export default function CreateEvent() {
  const auth = getAuth();
  const navigate = useNavigate();
  const communityID = useParams().communityID;
  const communityDocRef = doc(db, "communities", communityID);
  const [error, setError] = useState();
  const [supportedEvents, setSupportedEvents] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [thumbnailURLs, setThumbnailURLs] = useState([]);
  const [navUrl, setNavUrl] = useState([]);

  const handleClick = (url) => {
    // console.log(communityID);
    const newUrl = "/community/" + communityID + url;
    navigate(newUrl);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (!auth.currentUser) {
          navigate("/");
          throw "user is logged out";
        } else {
          const comDocSnap = await getDoc(communityDocRef);
          if (comDocSnap.exists()) {
            if (!comDocSnap.data().adminUIDs.includes(auth.currentUser.uid)) {
              console.log("You aren't authorized to be in here");
              navigate("/");
            } else {
              const querySnapshot = await getDocs(
                collection(db, "event-information")
              );
              var events = [];
              var descripts = [];
              var thumbs = [];
              var navUrls = [];
              querySnapshot.forEach((doc) => {
                events.push(doc.data().name);
                descripts.push(doc.data().description);
                thumbs.push(doc.data().thumbnail);
                navUrls.push(doc.data().internalURL);
              });
              setSupportedEvents(events);
              setDescriptions(descripts);
              setThumbnailURLs(thumbs);
              setNavUrl(navUrls);
            }
          } else {
            console.log("Doc doesn't exist");
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Row>
        <Col className="text-center">
          <h3>Create A Community Event</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {supportedEvents.map((evt, index) => (
              <EventCreationSlice
                key={evt + index}
                eventName={evt}
                eventDescription={descriptions[index]}
                eventThumbnail={thumbnailURLs[index]}
                navUrl={navUrl[index]}
                whenClicked={handleClick}
              />
            ))}
          </Card>
        </Col>
      </Row>
    </>
  );
}
