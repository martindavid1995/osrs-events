import React, { useState, useEffect } from "react";
import { Card, Button, Row } from "react-bootstrap";
import CommunitySlice from "./CommunitySlice";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";

export default function CommunityPanel() {
  const navigate = useNavigate();
  const [memberOf, setMemberOf] = useState([]);
  const [error, setError] = useState();
  const auth = getAuth();

  useEffect(() => {
    async function fetchData() {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setMemberOf(userDocSnap.data().memberOf);
      } else {
        setError("Query Failed");
      }
    }
    fetchData();
  }, []);

  function navCreateCommunity() {
    navigate("/create-community");
  }

  // console.log(memberOf)
  const regexp = /( )/gm;
  return (
    <Card>
      <Card.Body>
        <h2 className="text-center">Communities</h2>
        {memberOf.map((community, index) => (
          <CommunitySlice
            key={community + index}
            communityID={community.replaceAll(regexp, "-")}
          />
        ))}
        <Row>
          <Button
            className="mt-3 mx-auto"
            type="submit"
            onClick={navCreateCommunity}
          >
            Create New Community
          </Button>
        </Row>
      </Card.Body>
    </Card>
  );
}
