import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import ApplicationSlice from "./ApplicationSlice";

export default function OpenApplications() {
  const [openApps, setOpenApps] = useState([]);
  const [reload, setReload] = useState(false);
  const communityID = useParams().communityID;
  const communityDocRef = doc(db, "communities", communityID);

  useEffect(() => {
    async function fetchData() {
      const comDocSnap = await getDoc(communityDocRef);
      if (comDocSnap.exists()) {
        setOpenApps(comDocSnap.data().openApps);
      }
    }

    fetchData();
  }, [reload]);

  return (
    <Card>
      <Card.Body>
        <h4 className="text-center">Pending Applications</h4>
        {openApps.map((app, index) => (
          <ApplicationSlice
            key={app + index}
            username={app.username}
            UID={app.uid}
            communityID={communityID}
            setReload={setReload}
          />
        ))}
      </Card.Body>
    </Card>
  );
}
