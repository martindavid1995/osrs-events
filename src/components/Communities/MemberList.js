import React, { useState, useEffect } from "react";
import {
  Card,
  ListGroup,
  ListGroupItem,
  Badge,
  Row,
  Col,
  Dropdown,
  Accordion
} from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../contexts/UserContext";
import { useCommunity } from "../../contexts/CommunityContext";

export default function MemberList({ admin }) {
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [memberUIDs, setMemberUIDs] = useState([]);
  const [creator, setCreator] = useState();
  const [adminUIDs, setAdminUIDs] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const communityID = useParams().communityID;
  const communityDocRef = doc(db, "communities", communityID);
  const { removeCommunityMember } = useCommunity();
  const { unsubscribeUserFromCommunity, grantAdminPrivelages } = useUser();
  const { addCommunityAdmin } = useCommunity();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  async function kickUser(UID, username) {
    await removeCommunityMember(communityID, UID, username);
    await unsubscribeUserFromCommunity(communityID, UID);
    setReload((s) => !s);
  }

  async function promoteUser(UID, username) {
    await addCommunityAdmin(communityID, UID, username);
    await grantAdminPrivelages(communityID, UID);
    setReload((s) => !s);
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const comDocSnap = await getDoc(communityDocRef);
      if (comDocSnap.exists()) {
        setAdmins(comDocSnap.data().adminUsernames);
        setMembers(comDocSnap.data().memberUsernames);
        setMemberUIDs(comDocSnap.data().memberUIDs);
        setAdminUIDs(comDocSnap.data().adminUIDs);
        setMemberData(comDocSnap.data().members);
        setCreator(comDocSnap.data().creator.user);
      }
      setLoading(false);
    }
    fetchData();
  }, [reload]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  } else if (admin) {
    return (
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Member List</Accordion.Header>
          <Accordion.Body>
          <Card>
        <Card.Body>
          <h4>Member List</h4>
          <ListGroup>
            <ListGroupItem>
              <Row>
                <Col>{creator}</Col>
                <Col>
                  <Badge className="flex" bg="success" pill>
                    Creator
                  </Badge>
                </Col>
                <Col></Col>
              </Row>
            </ListGroupItem>
            {admins
              .filter((user) => user !== creator)
              .map((user, index) => (
                <ListGroupItem key={user + index}>
                  <Row>
                    <Col>{user}</Col>
                    <Col>
                      <Badge className="flex" bg="primary" pill>
                        Admin
                      </Badge>
                    </Col>
                    <Col></Col>
                  </Row>
                </ListGroupItem>
              ))}

            {memberData
              .filter(function (user) {
                return adminUIDs.indexOf(user.UID) === -1;
              })
              .map((dict, index) => (
                <ListGroupItem key={dict.UID + index}>
                  <Row>
                    <Col>{dict.user}</Col>
                    <Col>
                      <Badge className="flex" bg="secondary" pill>
                        Member
                      </Badge>
                    </Col>
                    <Col>
                      <DropdownButton
                        size="sm"
                        id="admin-dropdown"
                        title="Manage"
                        onSelect={function (evt) {
                          switch (evt) {
                            case "promote":
                              promoteUser(dict.UID, dict.user);
                              break;
                            case "kick":
                              kickUser(dict.UID, dict.user);
                              break;
                          }
                        }}
                      >
                        <Dropdown.Item eventKey={"promote"}>
                          Promote
                        </Dropdown.Item>
                        <Dropdown.Item eventKey={"kick"}>Kick</Dropdown.Item>
                      </DropdownButton>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
          </ListGroup>
        </Card.Body>
      </Card>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  } else if (!admin) {
    return (
      <Card>
        <Card.Body>
          <h4>Member List</h4>
          <ListGroup>
            <ListGroupItem>
              <Row>
                <Col>{creator}</Col>
                <Col>
                  <Badge className="flex" bg="success" pill>
                    Creator
                  </Badge>
                </Col>
              </Row>
            </ListGroupItem>
            {admins
              .filter((user) => user !== creator)
              .map((user, index) => (
                <ListGroupItem key={user + index}>
                  <Row>
                    <Col>{user}</Col>
                    <Col>
                      <Badge className="flex" bg="primary" pill>
                        Admin
                      </Badge>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            {/* filter out the admins from the admin list so that they don't appear twice */}
            {members
              .filter(function (val) {
                return admins.indexOf(val) === -1;
              })
              .map((user, index) => (
                <ListGroupItem key={user + index}>
                  <Row>
                    <Col>{user}</Col>
                    <Col>
                      <Badge className="flex" bg="secondary" pill>
                        Member
                      </Badge>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  }
}
