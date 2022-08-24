import React from 'react'
import { Card, ListGroup, ListGroupItem, Image, Container, OverlayTrigger, Tooltip } from 'react-bootstrap'

export default function SearchResults( {results, handleClick} ) {
    function capFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    
    function handleClick(name, img) {
        console.log("Clicked ",name) //write image to db here
    }
    
    
  return (
    // <Card className='mt-1' style={{ width: '613px'}}>
        <Container className='d-flex align-items-start flex-wrap mb-3'>
            {
                results.map((item, index) => 
                    (   
                        <Card key={item.name+index} style={{ width: '65px', height: '58px'}} onClick={() => handleClick(capFirst(item.name.replaceAll("_", " ")), item.img)}>
                            <Card.Img variant='top' src={item.img} style={{ width: '63px', height: '56px'}}/>
                        </Card>
                    )                    
                )
            }
        </Container>
    // </Card>
  )
}
