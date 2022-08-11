import React, { useState, useEffect } from 'react'
import { Card, ListGroup, ListGroupItem, Badge, Row, Col, Dropdown } from 'react-bootstrap'
import  DropdownButton  from 'react-bootstrap/DropdownButton'
import { useParams } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase'

export default function MemberList( {admin} ) {
    const [members, setMembers] = useState([])
    const [admins, setAdmins] = useState([])
    const [memberUIDs, setMemberUIDs] = useState([])
    const [adminUIDs, setAdminUIDs] = useState([])
    const [memberData, setMemberData] = useState([])
    const communityID = useParams().communityID
    const communityDocRef = doc(db, "communities", communityID)

    async function kickUser(UID){

    }

    function extractUIDs(array) {
        var newArr = []
        array.map((dict) => newArr.push(dict.UID))
        return newArr
    }

    function extractUsernames(array) {
        var newArr = []
        array.map((dict) => newArr.push(dict.user))
        return newArr
    }

    useEffect(() => { 
        async function fetchData() {
            const comDocSnap = await getDoc(communityDocRef)
            if (comDocSnap.exists()){
                setAdmins(extractUsernames(comDocSnap.data().admins)) 
                setMembers(extractUsernames(comDocSnap.data().members))
                setMemberUIDs(extractUIDs(comDocSnap.data().members))
                setAdminUIDs(extractUIDs(comDocSnap.data().admins))
                setMemberData(comDocSnap.data().members)
            }
        }
        fetchData()

    }, [])

        return (
            <Card>
                <Card.Body>
                    <h4>Member List</h4>
                    <ListGroup>
                        {admins.map((user, index) => 
                        <ListGroupItem key={user+index}>
                            <Row>
                                <Col>{user}</Col>
                                <Col><Badge className="flex" bg='primary' pill>Admin</Badge></Col>
                                <Col></Col>
                            </Row>
                        </ListGroupItem>)}
                        {/* filter out the admins from the admin list so that they don't appear twice */}

                        {memberData.filter(function(user) {return adminUIDs.indexOf(user.UID) === -1} ).map((dict, index) => 
                                <ListGroupItem key={dict.UID+index}>
                                    <Row>
                                        <Col>{dict.user}</Col>
                                        <Col><Badge className="flex" bg='secondary' pill>Member</Badge></Col>
                                        <Col>
                                            <DropdownButton size='sm' id="admin-dropdown" title="Manage" onSelect={function(evt){
                                                switch(evt){
                                                    case 'promote':
                                                        console.log("promote")
                                                        break
                                                    case 'kick':
                                                        kickUser(dict.UID)
                                                        break
                                                }
                                            }}>
                                                <Dropdown.Item eventKey={'promote'}>Promote</Dropdown.Item>
                                                <Dropdown.Item eventKey={'kick'}>Kick</Dropdown.Item>
                                            </DropdownButton>
                                        </Col>
                                    </Row>
                                </ListGroupItem>)}
                    </ListGroup>
                </Card.Body>
            </Card>
        )
    // } else {
    //     return(
    //         <Card>
    //             <Card.Body>
    //                 <h4>Member List</h4>
    //                 <ListGroup>
    //                     {admins.map((user, index) => <ListGroupItem key={user+index}><Row><Col>{user}</Col><Col><Badge className="flex" bg='primary' pill>Admin</Badge></Col></Row></ListGroupItem>)}
    //                     {/* filter out the admins from the admin list so that they don't appear twice */}
    //                     {members.filter(function(val) {return admins.indexOf(val) === -1} ).map((user, index) => <ListGroupItem key={user+index}><Row><Col>{user}</Col><Col><Badge className="flex" bg='secondary' pill>Member</Badge></Col></Row></ListGroupItem>)}
    //                 </ListGroup>
    //             </Card.Body>
    //         </Card>
    //         )
    // }
    
}

