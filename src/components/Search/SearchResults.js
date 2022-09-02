import React from "react";
import {
  Card,
  ListGroup,
  ListGroupItem,
  Image,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

export default function SearchResults({ results, getSelection }) {
  function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  return (
    <Container className="d-flex align-items-start flex-wrap mb-3">
      {results.map((item, index) => (
        <Card
          key={item.name + index}
          style={{ width: "65px", height: "58px" }}
          onClick={() =>
            {getSelection(capFirst(item.name.replaceAll("_", " ")), item.img, item.detail_url);}
          }
        >
          <Card.Img
            variant="top"
            src={item.img}
            style={{ width: "63px", height: "56px" }}
          />
        </Card>
      ))}
    </Container>
  );
}
