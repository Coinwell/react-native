import { ChatsStore } from '../chats-store'
import { relay } from 'api'
import { sleep } from 'store/utils/sleep'
import { display, log } from 'lib/logging'
import { normalizeChat } from 'app/store/normalize'

export const createTribe = async (self: ChatsStore, params: CreateTribeParams) => {
  display({
    name: 'createTribe',
    preview: 'Attempting createTribe with params',
    value: params,
  })
  const {
    name,
    description,
    tags,
    img,
    price_per_message,
    price_to_join,
    escrow_amount,
    escrow_time,
    unlisted,
    is_private,
    app_url,
    feed_url,
  } = params
  await sleep(1)
  const r = await relay.post('group', {
    name,
    description,
    tags: tags || [],
    is_tribe: true,
    is_listed: true,
    price_per_message: price_per_message || 0,
    price_to_join: price_to_join || 0,
    escrow_amount: escrow_amount || 0,
    escrow_millis: escrow_time ? escrow_time * 60 * 60 * 1000 : 0,
    img: img || '',
    unlisted: unlisted || false,
    private: is_private || false,
    app_url: app_url || '',
    feed_url: feed_url || '',
  })
  if (!r) return
  const normalizedChat = normalizeChat(r)
  self.gotChat(normalizedChat)
  return r
}

export type CreateTribeParams = {
  name: string
  description: string
  tags: string[]
  img: string
  price_per_message: number
  price_to_join: number
  escrow_amount: number
  escrow_time: number
  unlisted: boolean
  is_private: boolean
  app_url: string
  feed_url: string
}