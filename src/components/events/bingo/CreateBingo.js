import { getDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useInvitation } from "../../../contexts/InvitationContext";
import { useBingo } from "../../../contexts/BingoContext";
import { useEvent } from "../../../contexts/EventContext";
import { Container } from "react-bootstrap";
import BingoBoard from "./BingoBoard";

export default function CreateBingo() {
  const { closeInvitation } = useInvitation();
  const { setEventStatus } = useEvent();
  const { createBingo } = useBingo();
  const [loading, setLoading] = useState(false);
  const eventID = useParams().eventID;
  const eventDocRef = doc(db, "events", eventID);
  const [challengerID, setChallengerID] = useState();
  const [challengeeID, setChallengeeID] = useState();
  const [bingoID, setBingoID] = useState();
  const [items, setItems] = useState(Array(25).fill('N/A'))
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    async function fetchData() {
      const eventDocSnap = await getDoc(eventDocRef);
      if (eventDocSnap.exists()) {
        setChallengerID(eventDocSnap.data().communitiesInvolved[0]);
        setChallengeeID(eventDocSnap.data().communitiesInvolved[1]);
      }
      setLoading(false)
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function makeGame() {
      if (challengerID !== undefined && challengeeID !== undefined) {
        try {
          const eventDocSnap = await getDoc(eventDocRef);
          if (
            eventDocSnap.exists() &&
            eventDocSnap.data().status === "pending"
          ) {
            const bingoRef = await createBingo(challengerID, challengeeID, items);
            await setEventStatus(eventID, "creating");
            console.log(bingoRef.id);
            setBingoID(bingoRef.id);
          } else {
            console.log("Not going to create a duplicate bingo entry");
          }
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
          //pass in onclick function to modify
          <>
            <h1 className="text-center">Create Bingo</h1>
            <BingoBoard items={items}/>
          </>
            
    );
  }
}
