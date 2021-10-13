// TODO - fix all this after other stores pulled in
import { relay } from 'api'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { normalizeChat, normalizeContact } from 'store/normalize'
import { ContactsStore } from '../contacts-store'
import { display, log } from 'lib/logging'

export const getContacts = async (self: ContactsStore) => {
  const root = getRoot(self) as RootStore
  const chatStore = root.chats
  const subStore = root.subs
  const userStore = root.user
  try {
    const r = await relay.get('contacts')
    display({
      name: 'getContacts',
      preview: `Returned with...`,
      value: { r },
    })

    if (!r) return
    if (r.contacts) {
      const contactsToSave = []
      r.contacts.forEach((contact) => {
        const normalizedContact = normalizeContact(contact)
        contactsToSave.push(normalizedContact)
      })
      self.setContacts(contactsToSave)

      const me = r.contacts.find((c) => c.is_owner)

      if (me) {
        userStore.setMyID(me.id)
        userStore.setAlias(me.alias)
        userStore.setDeviceId(me.device_id)
        userStore.setPublicKey(me.public_key)
        if (me.tip_amount || me.tip_amount === 0) {
          userStore.setTipAmount(me.tip_amount)
        }
      }
    }

    if (r.chats) {
      const chatsToSave = []
      r.chats.forEach((chat) => {
        const normalizedChat = normalizeChat(chat)
        chatsToSave.push(normalizedChat)
      })
      chatStore.setChats(chatsToSave)
    }

    if (r.subscriptions) subStore.setSubs(r.subscriptions)

    return r
  } catch (e) {}
}