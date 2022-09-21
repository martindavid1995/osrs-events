import React from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";

export default function EventSlice({
  eventType,
  communitiesInvolved,
  eventTitle,
  status,
  eventID
}) {

  function getButtonLink(){
    if (status === "creating"){
      return "/events/create/"+eventID
    } else return ""
  }

  function getButtonText(){
    if (status === "creating"){
      return "Creation Page"
    }else if (status ==="registering"){
      return "Register"
    }else if (status ==="live"){
      return "View Game"
    }else return ""
  }

  function getStatusBadge(){
    var color = 'primary'
    if (status === "pending"){
      color = 'info'
    } else if (status === "creating"){
      color = 'light'
    }else if (status === "registering"){
      color = 'warning'
    }else if (status === "live"){
      color = 'success'
    }else if (status === "past"){
      color = 'secondary'
    }else if (status === "terminated"){
      color = 'danger'
    }
    return (
      <>
      <Badge bg={color}>{capFirst(status)}</Badge>
      </>
    )
  }

  function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Card className="m-2" bg="secondary">
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
        <Row className="my-1">
          <Col>{communitiesInvolved[0]}</Col>
          <Col>{communitiesInvolved[1]}</Col>
        </Row>
        <Row>
          <Col>{getStatusBadge()}</Col>
          <Col>
            <Button href={getButtonLink()}>
              {getButtonText()}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
