import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'

function Tile({text}){
    return(
        <Card style={{ width: '20%', height: '20%'}}>
            <Card.Body className='text-center'>
                {text}
            </Card.Body>
        </Card>
    )
}

export default function BingoBoard({items}) {
      return (
    <Card style={{ width: '100vh', height: '100vh'}}>
        <Card.Body style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {items.map((item, index) => <Tile text={item}/>)}
        </Card.Body>
    </Card>
  )
}
