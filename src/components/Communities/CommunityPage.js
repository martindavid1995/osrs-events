import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CommunityPageTitle from './CommunityPageTitle'
import CommunityPageEvents from './CommunityPageEvents'
import CommunityPageMembers from './CommunityPageMembers'

export default function CommunityPage() {

  return (
    <>
    <Container>
            <Row>
                <Col className="px-0 m-1">
                    <CommunityPageTitle />
                </Col>
            </Row>
            <Row>
                <Col className="px-0 m-1">
                    <CommunityPageEvents />
                </Col>
                <Col className="px-0 m-1">
                    <CommunityPageMembers />
                </Col>
            </Row>
    </Container>
    </>
  )
}
