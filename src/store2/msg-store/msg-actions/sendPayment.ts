import { relay } from 'api'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store2'
import { encryptText } from '..'
import { MsgStore } from '../msg-store'

export const sendPayment = async (
  self: MsgStore,
  { contact_id, amt, chat_id, destination_key, memo }: SendPaymentParams
) => {
  const root = getRoot(self) as RootStore
  try {
    const myid = root.user.myid
    const myenc = await encryptText(root, { contact_id: myid, text: memo })
    const encMemo = await encryptText(root, { contact_id, text: memo })
    const v = {
      contact_id: contact_id || null,
      chat_id: chat_id || null,
      amount: amt,
      destination_key,
      text: myenc,
      remote_text: encMemo,
    }
    const r = await relay.post('payment', v)
    if (!r) return
    if (contact_id || chat_id) self.gotNewMessage(r)
    if (r.amount) root.details.addToBalance(r.amount * -1)
  } catch (e) {
    console.log(e)
  }
}

export interface SendPaymentParams {
  contact_id: number
  amt: number
  chat_id: number
  destination_key: string
  memo: string
}
