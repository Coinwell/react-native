import React from 'react'
import { IconButton } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { useStores, useTheme } from '../../../store'
import Menu from '../ActionSheet/Menu'

export default function TribeSettings({ visible, owner, onCancel, onEditPress, onMembersPress }) {
  const { ui } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const ownerItems = [
    {
      title: 'Edit Community',
      thumbIcon: (
        <IconButton
          icon={({ size, color }) => <AntDesignIcon name='edit' color={color} size={size} />}
          color={theme.white}
          size={18}
        />
      ),
      thumbBgColor: theme.primary,
      action: () => {
        onCancel()
        onEditPress()
      },
    },
  ]

  const userItems = []

  const commonItems = [
    {
      title: 'Members',
      thumbIcon: (
        <IconButton
          icon={({ size, color }) => <FeatherIcon name='users' color={color} size={size} />}
          color={theme.white}
          size={18}
        />
      ),
      thumbBgColor: theme.primary,
      action: () => {
        onCancel()
        onMembersPress()
      },
    },
  ]

  const items = owner ? [...commonItems, ...ownerItems] : [...commonItems, ...userItems]

  return <Menu visible={visible} items={items} onCancel={onCancel} />
}
