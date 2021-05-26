import React from 'react'
import { useObserver } from 'mobx-react-lite'

import ContactSubscribe from './ContactSubscribe'
import AddContact from './AddContact'
import InviteNewUser from './InviteNewUser'
import Payment from './Payment'
import ShareGroup from './ShareGroup'
import AddTribe from './Tribe/AddTribe'
import JoinTribe from './Tribe/JoinTribe'

export default function Modals() {
  return useObserver(() => {
    return (
      <>
        <ContactSubscribe />
        <AddContact />
        <InviteNewUser />
        <Payment />
        <ShareGroup />
        <AddTribe />
        <JoinTribe />
      </>
    )
  })
}
