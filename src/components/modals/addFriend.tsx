import React, { useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, StyleSheet } from 'react-native'
import { Button, Portal } from 'react-native-paper'

import { useStores } from '../../store'
import FadeView from '../utils/fadeView'
import Form from '../form'
import { contact } from '../form/schemas'
import ModalWrap from './modalWrap'
import Header from './modalHeader'
import InviteNewUser from './inviteNewUser'

export default function AddFriendWrap({ visible }) {
  const { ui } = useStores()

  function close() {
    ui.setAddFriendModal(false)
  }

  return (
    <ModalWrap onClose={close} visible={visible}>
      {visible && <AddFriend close={close} />}
    </ModalWrap>
  )
}

function AddFriend({ close }) {
  const { contacts } = useStores()
  const [hideButtons, setHideButtons] = useState(false)
  const [addContact, setAddContact] = useState(false)
  const [inviteNewUser, setInviteNewUser] = useState(false)
  const [loading, setLoading] = useState(false)

  function onNewToSphinxHandler() {
    setHideButtons(true)
    setTimeout(() => setInviteNewUser(true), 100)
  }
  function onAlreadyOnSphinxHandler() {
    setHideButtons(true)
    setTimeout(() => setAddContact(true), 100)
  }

  return useObserver(() => (
    <View style={{ flex: 1 }}>
      <Header title='Add Friend' onClose={close} />

      <FadeView opacity={hideButtons ? 0 : 1} style={styles.content}>
        <Button
          mode='contained'
          dark={true}
          accessibilityLabel='new-to-sphinx-button'
          onPress={onNewToSphinxHandler}
          style={{ backgroundColor: '#55D1A9', borderRadius: 30, width: '75%', height: 60, display: 'flex', justifyContent: 'center' }}
        >
          New to N2N2
        </Button>
        <Button
          mode='contained'
          dark={true}
          accessibilityLabel='already-on-sphinx-button'
          onPress={onAlreadyOnSphinxHandler}
          style={{ backgroundColor: '#6289FD', borderRadius: 30, width: '75%', height: 60, display: 'flex', justifyContent: 'center', marginTop: 28 }}
        >
          Already on N2N2
        </Button>
      </FadeView>

      <FadeView opacity={addContact ? 1 : 0} style={styles.content}>
        <View style={styles.former} accessibilityLabel='add-friend-form-wrap'>
          <Form
            schema={contact}
            loading={loading}
            // buttonAccessibilityLabel="add-friend-form-button"
            buttonText='Save to Contacts'
            onSubmit={async values => {
              setLoading(true)
              await contacts.addContact(values)
              setLoading(false)
              close()
            }}
          />
        </View>
      </FadeView>

      <FadeView opacity={inviteNewUser ? 1 : 0} style={styles.content}>
        {inviteNewUser && <InviteNewUser done={close} />}
      </FadeView>
    </View>
  ))
}

const styles = StyleSheet.create({
  modal: {
    margin: 0
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40
  },
  former: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%'
  }
})
