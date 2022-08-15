import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useCommunity } from "../../contexts/CommunityContext";
import { useEvent } from "../../contexts/EventContext";
import { useInvitation } from "../../contexts/InvitationContext";

export default function EventSlice({
  eventID,
  inviteID,
  eventType,
  setReload,
  communityAID,
  communityBID
}) {
  const { terminateEvent } = useEvent();
  const { closeInvitation } = useInvitation();
  const { rejectInvitation } = useCommunity();

  async function handleAccept() {
    setReload((s) => !s);
  }

  async function handleReject() {
    try {
      await terminateEvent(eventID);
      await closeInvitation(inviteID);
      await rejectInvitation(communityAID, eventID, inviteID)
      await rejectInvitation(communityBID, eventID, inviteID)
    } catch (e) {
      console.log(e)
    }

    setReload((s) => !s);
  }

  return (
    <Card className="m-2">
      <Card.Title className="m-2">Incoming Event Invitation</Card.Title>
      <Card.Body>
        <Row>
          <Col>
            <Row>
              <Col>
                <strong>{communityAID}</strong>
              </Col>
            </Row>
            <Row>
              <Col>{eventType}</Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col className="mx-1">
                <Row>
                  <Button variant="success" onClick={handleAccept}>
                    Accept
                  </Button>
                </Row>
              </Col>
              <Col className="mx-1">
                <Row>
                  <Button variant="danger" onClick={handleReject}>
                    Reject
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
