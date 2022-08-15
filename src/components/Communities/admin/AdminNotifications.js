import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { doc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import EventSlice from "../../events/EventSlice";

export default function AdminNotifications() {
  const communityID = useParams().communityID;
  const [incomingInvites, setIncomingInvites] = useState([]);
  const [error, setError] = useState();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const q = query(
        collection(db, "invitations"),
        where("to", "==", communityID),
        where("status", "==", "open")
      );
      const comDocSnap = await getDocs(q);
      var invites = [];
      comDocSnap.forEach((doc) => {
        invites.push({
          from: doc.data().from,
          eventType: doc.data().eventType,
          id: doc.id,
        });
      });
      setIncomingInvites(invites);
    }
    fetchData();
  }, []);

  return (
    <Card>
      <Card.Body>
        <h4 className="text-center">Community Notifications</h4>
        {incomingInvites.map((invite, index) => (
          <EventSlice
            key={invite.eventType + index}
            eventID={invite.id}
            eventType={invite.eventType}
            challengerName={invite.from}
            setReload={setReload}
          />
        ))}
      </Card.Body>
    </Card>
  );
}
