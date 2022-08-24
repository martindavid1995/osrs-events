import React, { useEffect, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import SearchResults from './SearchResults'

export default function SpriteSearch() {
    const url = "https://raw.githubusercontent.com/martindavid1995/dataset-thinner/master/item_images.json"
    const [results, setResults] = useState([])
    
    function escapeRegExp(str) {
      return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    

    function doSearch(searchQuery){
        if (searchQuery.length < 3) {
          setResults([])
          return
        }
        var str = escapeRegExp(searchQuery)
        var regex = new RegExp(".*"+str+ ".*")
        fetch(url)
        .then(res => res.json())
        .then((out) => {
            var results = []
            out.map(function (item) {  
              if (regex.test(item['name'])){  //match all to regex here
                results.push({name : item['name'], img : item['img_url']})
              }
            })
            setResults(results)
        }).catch(err => { throw err })
    }

  return (
    <>
            <Form>
            <Form.Group id="search">
                <Form.Label>Tile Image</Form.Label>
                <Form.Control
                className='mb-3' 
                type='text'   
                onChange={(event) => {
                   doSearch(((event.target.value).replaceAll(" ", "_")).toLowerCase());
                }} />
                
            </Form.Group>  
            </Form> 

     <>
     <SearchResults results={results}></SearchResults>
     </> 
     </>
  )
}



