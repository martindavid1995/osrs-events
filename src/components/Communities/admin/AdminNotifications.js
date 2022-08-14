import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { doc, getDocs, collection, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import EventSlice from '../../events/EventSlice'

export default function AdminNotifications() {
  const communityID  = useParams().communityID
  const [incomingInvites, setIncomingInvites] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "invitations"), where("to", "==", communityID))
      const comDocSnap = await getDocs(q)
      var invites = []
      comDocSnap.forEach((doc) => {
        console.log(doc.data().from)
        invites.push({
          from: doc.data().from,
          eventType: doc.data().eventType
        })
      })
      setIncomingInvites(invites)
    }
    fetchData()
  }, [])


  return (
    <Card>
        <Card.Body>
        <h4 className='text-center'>Community Notifications</h4>
        {incomingInvites.map((invite, index) => <EventSlice key={invite.from+index} eventType={invite.eventType} challengerName={invite.from}/>)}
        </Card.Body>
    </Card>
  )
}
