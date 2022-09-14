import React from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";

export default function EventSlice({
  eventType,
  communitiesInvolved,
  eventTitle,
  status,
}) {
  function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getCommunitiesInvolvedCol() {
    if (communitiesInvolved.length > 3) {
      return (
        <>
        <Row>
          <Col>{communitiesInvolved[0]}</Col>
          <Col>{communitiesInvolved[1]}</Col>
          <Col>{communitiesInvolved[2]}</Col>
          <Col>...</Col>
        </Row>
        </>
      );
    } else if (communitiesInvolved.length === 3) {
      return (
        <>
        <Row>
          <Col>{communitiesInvolved[0]}</Col>
          <Col>{communitiesInvolved[1]}</Col>
          <Col>{communitiesInvolved[2]}</Col>
        </Row>
        </>
      );
    } else if (communitiesInvolved.length === 2) {
      return (
        <>
        <Row>
          <Col>{communitiesInvolved[0]}</Col>
          <Col>{communitiesInvolved[1]}</Col>
        </Row>
        </>
      );
    } else {
      return (
        <>
        <Row>
          <Col>{communitiesInvolved[0]}</Col>
        </Row>
        </>
      );
    }
  }

  return (
    <Card className="m-2">
      <Card.Body>
        <Row>
          <Col md="auto">
            <h5>
              <Badge>{capFirst(eventType)}</Badge>
            </h5>
          </Col>
          <Col>
            <h5>{eventTitle}</h5>
          </Col>
        </Row>
        <Row>
          <Col>{communitiesInvolved[0]}</Col>
          <Col>{communitiesInvolved[1]}</Col>
        </Row>
        <Row></Row>
      </Card.Body>
    </Card>
  );
}
