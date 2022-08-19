import React from 'react'
import { Card, CardGroup, Row, Col, Container } from 'react-bootstrap'
import '../../../styles.css'

function Tile({text, idx}){
    return(
        <div className='child'>
            <Card style={{ height: '150px'}} onClick={()=>console.log("clicked idx: ", idx)}>
                <Card.Body className='text-center text-muted'>
                    Tile
                </Card.Body>
            </Card>
        </div>
    )
}

export default function BingoBoard({items}) {
      return (
            <Container className='d-flex align-items-start flex-wrap' style={{ width: '775px'}}>
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
                <Tile />
            </Container>
       
  )
}
