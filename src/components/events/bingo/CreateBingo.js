import { getDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useInvitation } from "../../../contexts/InvitationContext";
import { useBingo } from "../../../contexts/BingoContext";
import { useEvent } from "../../../contexts/EventContext";
import BingoBoard from "./BingoBoard";
import { Row, Col } from "react-bootstrap";

export default function CreateBingo() {
  const { closeInvitation } = useInvitation();
  const { setEventStatus, setEventGameID } = useEvent();
  const { createBingo } = useBingo();
  const [loading, setLoading] = useState(false);
  const eventID = useParams().eventID;
  const eventDocRef = doc(db, "events", eventID);
  const [challengerID, setChallengerID] = useState();
  const [challengeeID, setChallengeeID] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const eventDocSnap = await getDoc(eventDocRef);
      if (eventDocSnap.exists()) {
        setChallengerID(eventDocSnap.data().communitiesInvolved[0]);
        setChallengeeID(eventDocSnap.data().communitiesInvolved[1]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function makeGame() {
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
                image: "https://oldschool.runescape.wiki/images/Bank_filler_detail.png",
                description: "",
              })
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

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  } else {
    return (
      <>
        <Row><Col><h1 className="text-center">Create A Bingo Game</h1></Col></Row>
        <Row><Col><h6 className="text-center text-muted">Click a tile to set it's contents</h6></Col></Row>
        <BingoBoard creation={true}/>
      </>
    );
  }
}
