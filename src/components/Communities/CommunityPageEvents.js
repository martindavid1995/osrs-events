import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { doc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import EventSlice from "../events/EventSlice";

export default function CommunityPageEvents() {
  const communityID = useParams().communityID;
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const q = query(
        collection(db, "events"),
        where("communitiesInvolved", "array-contains", communityID),
        where("status", "in", ["registering", "live"])
      );
      const comDocSnap = await getDocs(q);
      var events = [];
      comDocSnap.forEach((doc) => {
        events.push({
          communitiesInvolved: doc.data().communitiesInvolved,
          eventType: doc.data().gametype,
          eventStatus: doc.data().status,
          eventTitle: doc.data().eventName,
          eventID: doc.id
        });
      });
      setEvents(events);
    }
    fetchData();
  }, []);

  return (
    <Card>
      <Card.Body>
        <h4 className="text-center">Community Events</h4>
        {events.map((event, index) => (
          <EventSlice
            key={
                 index + event.eventTitle
            }
            eventType={event.eventType}
            communitiesInvolved={event.communitiesInvolved}
            eventTitle={event.eventTitle}
            status={event.eventStatus}
            eventID={event.eventID}
          />
        ))}
      </Card.Body>
    </Card>
  );
}
