import React, { useEffect, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import SearchResults from './SearchResults'

export default function SpriteSearch(getSelection) {
    const url = "https://raw.githubusercontent.com/martindavid1995/dataset-thinner/master/item_images.json"
    const [results, setResults] = useState([])
    
    // Escapes all special characters in the search query
    function escapeRegExp(str) {
      return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    function doSearch(searchQuery){

        // Only start populating results once 4 characters have been typed
        if (searchQuery.length < 3) {
          setResults([])
          return
        }

        // Escape special characters so we can use them as literals in new Regex
        var str = escapeRegExp(searchQuery)

        // Setup a regex for your search query
        var regex = new RegExp(".*"+str+ ".*")

        // Fetch the data into json
        fetch(url)
        .then(res => res.json())
        .then((out) => {
            var results = []
            // For each item
            out.map(function (item) {  
              if (regex.test(item['name'])){  //If Regex matches, push the item and it's image to the results
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

                {/* Each time the user types a character into the search bar, we call doSearch() with their query*/}
                <Form.Control
                className='mb-3' 
                type='text'   
                onChange={(event) => {
                   doSearch(((event.target.value).replaceAll(" ", "_")).toLowerCase()); 
                   getSelection={getSelection}
                }} />
                
            </Form.Group>  
            </Form> 

     <>
     <SearchResults results={results} ></SearchResults>
     </> 
     </>
  )
}



