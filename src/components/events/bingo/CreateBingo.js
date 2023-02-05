import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useInvitation } from "../../../contexts/InvitationContext";
import { useBingo } from "../../../contexts/BingoContext";
import { useEvent } from "../../../contexts/EventContext";
import BingoBoard from "./BingoBoard";
import { Row, Col, Button, Card, Badge, Modal } from "react-bootstrap";

export default function CreateBingo() {
  const auth = getAuth();
  const { closeInvitation } = useInvitation();
  const { setEventStatus, setEventGameID, readyUpTeam } = useEvent();
  const [admins, setAdmins] = useState();
  const { createBingo } = useBingo();
  const [loading, setLoading] = useState(false);
  const eventID = useParams().eventID;
  const eventDocRef = doc(db, "events", eventID);
  const [challengerID, setChallengerID] = useState();
  const [challengeeID, setChallengeeID] = useState();
  const [eventName, setEventName] = useState();
  const [readyStatus, setReadyStatus] = useState([false, false]);
  const [myTeam, setMyTeam] = useState();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      if (eventID !== null) {
        const eDocRef = doc(db, "events", eventID);
        const unsub = onSnapshot(eDocRef, (doc) => {
          setReadyStatus(doc.data().readyUpStatus);
          if (doc.data().status === "registering"){
            console.log("Game should now be starting for all parties")
            handleShow();
          } 
        });
        setLoading(false);
      }
    }
    fetchData();
  }, [eventID]);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const eventDocSnap = await getDoc(eventDocRef);
      if (eventDocSnap.exists()) {
        setChallengerID(eventDocSnap.data().communitiesInvolved[0]);
        setChallengeeID(eventDocSnap.data().communitiesInvolved[1]);
        setEventName(eventDocSnap.data().eventName);
        setAdmins(eventDocSnap.data().playersInvolved);
        if (eventDocSnap.data().playersInvolved[0].admins.includes(auth.currentUser.uid)){
          setMyTeam(eventDocSnap.data().playersInvolved[0].community)
        } else  if (eventDocSnap.data().playersInvolved[1].admins.includes(auth.currentUser.uid)){
          setMyTeam(eventDocSnap.data().playersInvolved[1].community)
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function makeGame() {
      console.log(eventID)
      setLoading(true);
      if (challengerID !== undefined && challengeeID !== undefined) {
        try {
          const eventDocSnap = await getDoc(eventDocRef);
          if (
            eventDocSnap.exists() &&
            eventDocSnap.data().status === "pending"
          ) {
            const bingoRef = await createBingo(
              challengerID,
              challengeeID,
              Array(25).fill({
                text: "Empty Tile",
                image:
                  "https://oldschool.runescape.wiki/images/Bank_filler_detail.png",
                description: ""
              }),
              eventID
            );
            await setEventStatus(eventID, "creating");
            await setEventGameID(eventID, bingoRef.id);
          } else {
            // console.log("Not going to create a duplicate bingo entry");
          }
          setLoading(false);
        } catch (e) {
          console.log(e);
        }
      }
    }
    makeGame();
  }, [challengerID, challengeeID]);

  function navDash() {
    navigate("/");
  }

  async function setReady() {
    if (myTeam === challengerID){
      if (readyStatus[0] == true){
        readyStatus[0] = false
      } else {
        readyStatus[0] = true
      }
    } else {
      if (readyStatus[1] == true){
        readyStatus[1] = false
      } else {
        readyStatus[1] = true
      }
    }
    await readyUpTeam(eventID, readyStatus)
    if (readyStatus[0] === true && readyStatus[1] === true){
      await setEventStatus(eventID, "registering");
    }
  }

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  } else {
    return (
      <>

    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Registration Phase</Modal.Title>
        </Modal.Header>
        <Modal.Body>The game has been accepted by both parties and has moved into the registration phase. Members of your community can now see the game broadcasted, and can apply to join your team on the community page. </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={navDash}>
            Return to Dashboard
          </Button>
        </Modal.Footer>
      </Modal>
        <Row>
          <Col>
            <h1 className="text-center">Create A Bingo Game</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <h6 className="text-center text-muted">
              Click a tile to set it's contents
            </h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Title className="mx-auto">Game Information</Card.Title>
              <Card.Body>
                <Row>
                  <Col>
                    <h6>Event Name: {eventName}</h6>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h6>Administrators: ...</h6>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h6>Prize Pool: ...</h6>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h6>Game Length: ...</h6>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                Bingo game customization features to come in future versions
              </Card.Footer>
            </Card>
          </Col>
          <Col>
            <BingoBoard creation={true} />
          </Col>
          <Col>
            <Card>
              <Card.Title className="mx-auto">Control Panel</Card.Title>
              <Card.Body>
                <Row>
                  <Col>
                      {challengerID}: <Badge bg={readyStatus[0] ? "success" : "danger"}>{readyStatus[0] ? "Ready" : "Not Ready"}</Badge>
                  </Col>
                </Row>
                <Row>
                  <Col>
                      {challengeeID}: <Badge bg={readyStatus[1] ? "success" : "danger"}>{readyStatus[1] ? "Ready" : "Not Ready"}</Badge>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      variant="primary"
                      className="m-1"
                      onClick={setReady}
                    >
                      Accept Rules/Ready Up
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
