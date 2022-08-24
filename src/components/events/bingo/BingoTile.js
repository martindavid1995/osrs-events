import React, { useRef, useState } from "react";
import { Card, Container, Modal, Button, Form } from "react-bootstrap";
import { useBingo } from "../../../contexts/BingoContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import SpriteSearch from "../../Search/SpriteSearch";

export default function BingoTile({ bingoID, text, idx }) {
  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const itemRef = useRef();
  const descriptionRef = useRef();
  const bingoDocRef = doc(db, "bingo", bingoID);
  const { updateTile } = useBingo();

  async function sendUpdate(e) {
    e.preventDefault();
    try {
      const bingoDocSnap = await getDoc(bingoDocRef);
      if (bingoDocSnap.exists()) {
        var items = bingoDocSnap.data().items;
        items[idx] = {
          text: itemRef.current.value,
          image: null,
          description: descriptionRef.current.value,
        };
        await updateTile(bingoID, items);
      }
    } catch (e) {
      console.log(e);
    }
    handleClose();
  }

  return (
    <div className="child">
      <Card style={{ height: "150px"}} onClick={handleShow}>
        <Card.Body className="text-center text-muted">{text}</Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile {idx + 1}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={sendUpdate}>
            <Form.Group className="mb-3" controlId="tile_input.item_name">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                ref={itemRef}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="tile_input.description">
              <Form.Label>Description Text (Optional)</Form.Label>
              <Form.Control as="textarea" rows={2} ref={descriptionRef} />
              <Form.Text className="text-muted">
                This is a good place to let people know if there are specific
                rules or exclusions for this tile. Description will be viewable
                on tile hover-over.
              </Form.Text>
            </Form.Group>

            <SpriteSearch />

            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
