import React, { useEffect, useState } from "react";
import { Card, Container, Modal, Button } from "react-bootstrap";
import BingoTile from "./BingoTile";
import "../../../styles.css";
import { db } from "../../../firebase";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";

export default function BingoBoard({creation}) {
  const [items, setItems] = useState(["N/A"]);
  const [loading, setLoading] = useState(false);
  const [bingoID, setBingoID] = useState(null);
  const eID = useParams().eventID;
  const bID = useParams().bingoID;
  var eventID = ""
  if (eID === undefined) {
    eventID = bID
  } else {
    eventID = eID
  }
  const eventDocRef = doc(db, "events", eventID);
  
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const eventDocSnap = await getDoc(eventDocRef);
      if (eventDocSnap.exists()) {
        setBingoID(eventDocSnap.data().gameID);
      }
      setLoading(false);
    }
    fetchData();
  }, []);


  // Handles listening for tile changes to force rerender on all clients
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      if (bingoID !== null) {
        const bingoDocRef = doc(db, "bingo", bingoID); // Create a reference to the document for this game
        const unsub = onSnapshot(bingoDocRef, (doc) => {  // If you detect a change in the document
          setItems(doc.data().items); //Reset the state of the items to re-render them out on the board
        });
        setLoading(false);
      }
    }
    fetchData();
  }, [bingoID]); //Rerender on a change in bingoID because page may be loaded before bingoID is set by other useEffect()



  if (loading || bingoID === null) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  } else {
    return (
      <Container
        className="d-flex align-items-start flex-wrap"
        style={{ width: "625px" }}
      >
        {items.map((item, index) => (
          <BingoTile
            bingoID={bingoID}
            key={item.text + index}
            text={item.text}
            idx={index}
            imgURL={item.image}
            creating={creation}
          />
        ))}
      </Container>
    );
  }
}
