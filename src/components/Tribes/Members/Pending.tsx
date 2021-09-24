import React from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores } from '../../../store'
import { constants } from '../../../constants'
import { PendingContact } from './Items'

export default function Pending({ tribe, members }) {
  const { msg } = useStores()

  async function onApproveOrDenyMember(contactId, status) {
    const msgs = msg.messages[tribe.id]
    if (!msgs) return
    const theMsg = msgs.find((m) => m.sender === contactId && m.type === constants.message_types.member_request)
    if (!theMsg) return
    await msg.approveOrRejectMember(contactId, status, theMsg.id)
  }

  const renderItem: any = ({ item, index }: any) => (
    <PendingContact key={index} contact={item} onApproveOrDenyMember={onApproveOrDenyMember} />
  )

  return useObserver(() => {
    return (
      <>
        <FlatList
          style={styles.scroller}
          data={members}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
        />
      </>
    )
  })
}

const styles = StyleSheet.create({
  scroller: {
    width: '100%',
    position: 'relative',
  },
})
