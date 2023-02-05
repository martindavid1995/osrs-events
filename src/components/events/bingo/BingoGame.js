import React, { useState, useEffect } from "react";
import BingoBoard from "./BingoBoard";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import "../bingo/BingoGame.css";
import { db } from "../../../firebase";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
//The page that displays the bingo game for all users
export default function BingoGame() {
  const [title, setTitle] = useState();
  const [loading, setLoading] = useState(true);

  const eventID = useParams().eventID;
  const eventDocRef = doc(db, "events", eventID);


  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const eventDocSnap = await getDoc(eventDocRef);
      if (eventDocSnap.exists()) {
        setTitle(eventDocSnap.data().eventName)
      } 
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    //pass in onclick function to submit
    <div>
      <Container>
        <Card className="text-center">
          <Card.Title>
            <h3>{title}</h3>
          </Card.Title>
          <Card.Body>
            <Row>
              <Col>
                <Row>
                  <Col>
                    <Card bg="secondary">
                      <Card.Title className="text-center">
                        Game Information
                      </Card.Title>
                      <Card.Body>
                        All of the game information is going to go here
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Card bg="secondary">
                      <Card.Title className="text-center">
                        User-Specific Information
                      </Card.Title>
                      <Card.Body>
                        All of the user-specific information is going to go here
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <BingoBoard creation={false} />
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center">
                    <Button>Administrator Page</Button>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <Card bg="secondary">
                      <Card.Title className="text-center">
                        Live Game Updates
                      </Card.Title>
                      <Card.Body>
                        <ListGroup>
                          <ListGroupItem variant="primary">
                            Item 1
                          </ListGroupItem>
                          <ListGroupItem variant="secondary">
                            Item 2
                          </ListGroupItem>
                          <ListGroupItem variant="success">
                            Item 3
                          </ListGroupItem>
                          <ListGroupItem variant="danger">Item 4</ListGroupItem>
                          <ListGroupItem variant="warning">
                            Item 5
                          </ListGroupItem>
                          <ListGroupItem variant="info">Item 6</ListGroupItem>
                          <ListGroupItem variant="light">Item 7</ListGroupItem>
                          <ListGroupItem variant="dark">Item 8</ListGroupItem>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
