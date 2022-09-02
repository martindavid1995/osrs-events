import React, { useRef, useState, useEffect } from "react";
import { Card, Image, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useBingo } from "../../../contexts/BingoContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import SearchResults from "../../Search/SearchResults";

export default function BingoTile({ bingoID, idx }) {
  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const searchRef = useRef();
  const itemRef = useRef();
  const descriptionRef = useRef();
  const bingoDocRef = doc(db, "bingo", bingoID);
  const { updateTile } = useBingo();
  const [currImg, setCurrImg] = useState("");
  const [tempImg, setTempImg] = useState("https://oldschool.runescape.wiki/images/Bank_filler_detail.png")
  const url =
    "https://raw.githubusercontent.com/martindavid1995/dataset-thinner/master/item_images.json";
  const [results, setResults] = useState([]);
  const [errored, setErrored] = useState(false)
  const [submit, setSubmit] = useState(false)

  useEffect(() => {  
    async function fetchData() {
      const bingoDocSnap = await getDoc(bingoDocRef);
      if (bingoDocSnap.exists()) {
        setCurrImg(bingoDocSnap.data().items[idx].image)
      }
    }
    fetchData();
  }, [submit]);

  async function sendUpdate(e) {
    e.preventDefault();
    try {
      const bingoDocSnap = await getDoc(bingoDocRef);
      if (bingoDocSnap.exists()) {
        var items = bingoDocSnap.data().items;
        items[idx] = {
          text: itemRef.current.value,
          image: tempImg,
          description: descriptionRef.current.value,
        };
        await updateTile(bingoID, items);
      }
    } catch (e) {
      console.log(e);
    }
    setSubmit(s => !s)
    handleClose();
  }


  function getSelection(selection, smallSprite, detail_img) {
    setTempImg(detail_img)
    searchRef.current.value = "";
    setResults([]);
    setErrored(false)
  }

  function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  function doSearch(searchQuery) {
    if (searchQuery.length < 3) {
      setResults([]);
      return;
    }
    var str = escapeRegExp(searchQuery);
    var regex = new RegExp(".*" + str + ".*");
    fetch(url)
      .then((res) => res.json())
      .then((out) => {
        var results = [];
        out.map(function (item) {
          if (regex.test(item["name"])) {
            //match all to regex here
            results.push({
              name: item["name"],
              img: item["img_url"],
              detail_url: item["detail_url"],
            });
          }
        });
        setResults(results);
      })
      .catch((err) => {
        throw err;
      });
  }

  return (
    <div className="child">
      <Card style={{ height: "120px", width: "120px" }} onClick={handleShow}>
        <Card.Body>
          <Image className="rounded mx-auto d-block" src={currImg} width={80} height={80}></Image>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile {idx + 1}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card
            style={{ height: "120px", width: "120px" }}
          >
            <Card.Body>
              <Image 
              className="rounded mx-auto d-block"
              src={tempImg} 
              onError={() => 
                {
                  if (tempImg !== "" && errored === false){
                    setErrored(true)
                    setTempImg(tempImg.slice(0, -4) + "_animated.gif")
                  }
                }
              }
              width={80} 
              height={80}>
              </Image>
            </Card.Body>
          </Card>
          <Form onSubmit={sendUpdate}>
            <Form.Group className="mb-3" controlId="tile_input.item_name">
              <Form.Label>Tile Title</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                ref={itemRef}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="tile_input.description">
              <Form.Label>Tile Description Text (Optional)</Form.Label>
              <Form.Control as="textarea" rows={2} ref={descriptionRef} />
              <Form.Text className="text-muted">
                This is a good place to let people know if there are specific
                rules or exclusions for this tile. Description will be viewable
                on tile hover-over.
              </Form.Text>
            </Form.Group>

            <Form.Group id="search">
              <Form.Label>Tile Image</Form.Label>
              <Form.Control
                className="mb-3"
                ref={searchRef}
                type="text"
                defaultValue={""}
                onChange={(event) => {
                  doSearch(
                    event.target.value.replaceAll(" ", "_").toLowerCase()
                  );
                }}
              />
            </Form.Group>

            <SearchResults results={results} getSelection={getSelection} />

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
