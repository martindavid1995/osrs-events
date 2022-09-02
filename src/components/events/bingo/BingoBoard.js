import React, { useEffect, useState } from "react";
import { Card, Container, Modal, Button } from "react-bootstrap";
import BingoTile from "./BingoTile";
import "../../../styles.css";
import { db } from "../../../firebase";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";

export default function BingoBoard() {
  const [items, setItems] = useState(["N/A"]);
  const [loading, setLoading] = useState(false);
  const [bingoID, setBingoID] = useState(null);
  const eventID = useParams().eventID;
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

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      if (bingoID !== null) {
        // console.log(bingoID)
        const bingoDocRef = doc(db, "bingo", bingoID);
        const unsub = onSnapshot(bingoDocRef, (doc) => {
          // console.log(doc.data().items)
          setItems(doc.data().items);
        });
        setLoading(false);
      }
    }
    fetchData();
  }, [bingoID]);

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
          />
        ))}
      </Container>
    );
  }
}
