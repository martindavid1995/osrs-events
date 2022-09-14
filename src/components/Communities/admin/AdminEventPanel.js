import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { doc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import EventSlice from "../../events/EventSlice";

export default function AdminEventPanel() {
  const communityID = useParams().communityID;
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const q = query(
        collection(db, "events"),
        where("communitiesInvolved", "array-contains", communityID),
        where("status", "in", ["creating", "registering", "live"])
      );
      const comDocSnap = await getDocs(q);
      var events = [];
      comDocSnap.forEach((doc) => {
        // var bothComs = doc.data().communitiesInvolved;
        // var otherCommunity =
        //   communityID === bothComs[0] ? bothComs[1] : bothComs[0];
        events.push({
          // otherCommunityID: otherCommunity,
          communitiesInvolved: doc.data().communitiesInvolved,
          eventType: doc.data().gametype,
          eventStatus: doc.data().status,
          eventTitle: doc.data().eventName
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
              event.otherCommunityID +
              index +
              event.eventType +
              event.eventStatus
            }
            eventType={event.eventType}
            communitiesInvolved={event.communitiesInvolved}
            // otherCommunity={event.otherCommunityID}
            eventTitle={event.eventTitle}
            status={event.eventStatus}
          />
        ))}
      </Card.Body>
    </Card>
  );
}
