import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStores, useTheme } from '../../../store'
import { SCREEN_WIDTH } from '../../../constants'
import Typography from '../../common/Typography'
import Avatar from '../../common/Avatar'
import Button from '../../common/Button'

export default function PubKey(props) {
  const { isMe, pubKey, myAlias, senderPic, senderAlias, onLongPressHandler } = props
  const theme = useTheme()
  const { ui, contacts } = useStores()

  const alias = isMe ? myAlias : senderAlias

  const isContact = contacts.contacts.find((c) => c.public_key === pubKey)

  return (
    <View style={{ height: isMe ? 75 : 120 }}>
      <TouchableOpacity activeOpacity={0.8} onLongPress={onLongPressHandler}>
        <View style={{ ...styles.pubKeyWrap, borderBottomColor: theme.border }}>
          <Avatar alias={alias} photo={senderPic} size={40} aliasSize={16} />
          <View style={{ ...styles.pubKeyContent }}>
            <Typography>{alias}</Typography>
            <View style={{ ...styles.pubKey }}>
              <Typography
                color={theme.greySpecial}
                numberOfLines={1}
                style={{
                  maxWidth: SCREEN_WIDTH - 250,
                  paddingRight: 14,
                }}
              >
                {pubKey}
              </Typography>
              <MaterialIcon name='qrcode' size={22} color={theme.icon} />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {!isMe && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20 }}>
          <Button
            size='small'
            w={'100%'}
            round={5}
            onPress={() =>
              ui.setAddContactModal(true, isContact ? true : false, { alias: senderAlias, public_key: pubKey })
            }
          >
            {isContact ? 'View Contact' : 'Add Contact'}
          </Button>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  pubKeyWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 14,
    width: '100%',
  },
  pubKeyContent: {
    paddingHorizontal: 14,
  },
  pubKey: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
