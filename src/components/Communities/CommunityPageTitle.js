import React, { useState, useEffect } from "react";
import { Card, Button, Image, Col, Row, Modal } from "react-bootstrap";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useCommunity } from "../../contexts/CommunityContext";

export default function CommunityPageTitle({ from }) {
  const { communityID } = useParams();
  const { addOpenApplication } = useCommunity();
  const [communityName, setCommunityName] = useState(null); //30
  const [description, setDescription] = useState(null); //151
  const [imgURL, setImgURL] = useState("/images/temp_avatar.jpg");
  const [creator, setCreator] = useState(null);
  const [error, setError] = useState(null); //handle these later
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [memberList, setMemberList] = useState([{}]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [userName, setUsername] = useState(null);
  const [openApps, setOpenApps] = useState([]);
  const auth = getAuth();

  const communityDocRef = doc(db, "communities", communityID);

  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function navAdmin() {
    navigate(`/community/${communityID}/admin`);
  }

  function navCreateEvent() {
    navigate(`/community/${communityID}/create-event`);
  }

  async function submitApp() {
    try {
      if (!auth.currentUser) {
        //we are logged out
        console.log("User is not logged in, can't apply to join");
        navigate("/login");
        throw "not logged in";
      } else if (memberList.includes(userName)) {
        console.log("User already is a member of this community");
        handleClose();
        throw "already a member";
      } else if (openApps.map((a) => a.uid).includes(auth.currentUser.uid)) {
        console.log("User already has a pending application");
        handleClose();
        throw "Pending application already exists";
      }
      await addOpenApplication(communityID, auth.currentUser.uid, userName);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const comDocSnap = await getDoc(communityDocRef);
      if (comDocSnap.exists()) {
        setCommunityName(comDocSnap.data().name);
        setDescription(comDocSnap.data().description);
        setCreator(comDocSnap.data().creator["user"]);
        setMemberList(comDocSnap.data().members);
        setOpenApps(comDocSnap.data().openApps);
        setImgURL(comDocSnap.data().imgURL);
        if (auth.currentUser) {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUsername(userDocSnap.data().user);
            if (comDocSnap.data().adminUIDs.includes(auth.currentUser.uid)) {
              setIsAdmin(true);
              setIsMember(true);
            } else if (
              comDocSnap.data().memberUIDs.includes(auth.currentUser.uid)
            ) {
              setIsMember(true);
            }
          }
        }
      } else {
        setError("Query Failed");
        console.log("Query Failed");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  } else if (from === "home" && isAdmin && isMember) {
    return (
      //Link to admin page
      <Card>
        <Card.Body>
          <Row className="pb-2">
            <Col className="col-md-auto">
              <Image width={110} height={110} src={imgURL} rounded />
            </Col>
            <Col className="col-lg-2">
              <Row>
                <Col>
                  <h4>{communityName}</h4>
                </Col>
                <Row>
                  <Col>
                    <h6>Created by:</h6>
                  </Col>
                </Row>
                <Row>
                  <Col>{creator}</Col>
                </Row>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col>
                  <strong>About {communityName}: </strong>
                </Col>
              </Row>
              <Row>
                <Col>{description}</Col>
              </Row>
            </Col>
            <Col className="col-md-auto d-flex align-items-center">
              <Button variant="primary" onClick={navAdmin}>
                Admin Page
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (from === "home" && !isAdmin && !isMember) {
    return (
      //Apply Button
      <Card>
        <Card.Body>
          <Row className="pb-2">
            <Col className="col-md-auto">
              <Image width={110} height={110} src={imgURL} rounded />
            </Col>
            <Col className="col-lg-2">
              <Row>
                <Col>
                  <h4>{communityName}</h4>
                </Col>
                <Row>
                  <Col>
                    <h6>Created by:</h6>
                  </Col>
                </Row>
                <Row>
                  <Col>{creator}</Col>
                </Row>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col>
                  <strong>About {communityName}: </strong>
                </Col>
              </Row>
              <Row>
                <Col>{description}</Col>
              </Row>
            </Col>
            <Col className="col-md-auto d-flex align-items-center">
              <Button variant="primary" onClick={handleShow}>
                Apply
              </Button>
            </Col>
          </Row>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Apply to {communityName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to submit an application to join{" "}
              {communityName}? A community administrator will manage your
              application upon submission
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={submitApp}>
                Send Application
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    );
  } else if (from === "home" && !isAdmin && isMember) {
    return (
      //show nothing
      <Card>
        <Card.Body>
          <Row className="pb-2">
            <Col className="col-md-auto">
              <Image width={110} height={110} src={imgURL} rounded />
            </Col>
            <Col className="col-lg-2">
              <Row>
                <Col>
                  <h4>{communityName}</h4>
                </Col>
                <Row>
                  <Col>
                    <h6>Created by:</h6>
                  </Col>
                </Row>
                <Row>
                  <Col>{creator}</Col>
                </Row>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col>
                  <strong>About {communityName}: </strong>
                </Col>
              </Row>
              <Row>
                <Col>{description}</Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (from === "admin" && isAdmin) {
    //link to create event
    return (
      <Card>
        <Card.Body>
          <Row className="pb-2">
            <Col className="col-md-auto">
              <Image width={110} height={110} src={imgURL} rounded />
            </Col>
            <Col className="col-lg-2">
              <Row>
                <Col>
                  <h4>{communityName}</h4>
                </Col>
                <Row>
                  <Col>
                    <h6>Created by:</h6>
                  </Col>
                </Row>
                <Row>
                  <Col>{creator}</Col>
                </Row>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col>
                  <strong>About {communityName}: </strong>
                </Col>
              </Row>
              <Row>
                <Col>{description}</Col>
              </Row>
            </Col>
            <Col className="col-md-auto d-flex align-items-center">
              <Button variant="primary" onClick={navCreateEvent}>
                Create Event
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}
