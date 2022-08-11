import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CommunityPageTitle from './CommunityPageTitle'
import CommunityPageEvents from './CommunityPageEvents'
import MemberList from './MemberList'

export default function CommunityPage() {

  return (
    <>
    <Container>
            <Row>
                <Col className="px-0 m-1">
                    <CommunityPageTitle button={true}/>
                </Col>
            </Row>
            <Row>
                <Col className="px-0 m-1">
                    <CommunityPageEvents />
                </Col>
                <Col className="px-0 m-1">
                    <MemberList admin={false}/>
                </Col>
            </Row>
    </Container>
    </>
  )
}
