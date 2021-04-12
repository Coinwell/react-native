import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { IconButton } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { useStores, useTheme } from '../../../store'
import Menu from '../ActionSheet/Menu'

export default function AddFriend() {
  const { ui } = useStores()
  const theme = useTheme()

  function close() {
    ui.setAddFriendDialog(false)
  }

  const items = [
    {
      title: 'New to N2N2',
      thumbIcon: 'Send',
      description: 'Invite a new friend',
      thumbBgColor: theme.primary,
      action: () => {
        close()

        setTimeout(() => {
          ui.setInviteFriendModal(true)
        }, 400)
      }
    },
    {
      title: 'Already on N2N2',
      thumbIcon: <IconButton icon={({ size, color }) => <AntDesign name='adduser' color={color} size={size} />} color={theme.white} size={18} />,
      description: 'Add to your contact',
      thumbBgColor: theme.primary,
      action: () => {
        close()
        setTimeout(() => {
          ui.setAddContactModal(true)
        }, 400)
      }
    }
  ]

  return useObserver(() => <Menu visible={ui.addFriendDialog} items={items} onCancel={close} />)
}