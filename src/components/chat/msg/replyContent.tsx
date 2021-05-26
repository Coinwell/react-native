import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { IconButton } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { useTheme } from '../../../store'
import { useAvatarColor } from '../../../store/hooks/msg'
import { useCachedEncryptedFile } from './hooks'
import { constantCodes, constants } from '../../../constants'
import { parseLDAT } from '../../utils/ldat'
import Typography from '../../common/Typography'

export default function ReplyContent(props) {
  const theme = useTheme()

  const extraStyles = props.extraStyles || {}
  const onCloseHandler = () => {
    if (props.onClose) props.onClose()
  }
  const nameColor = props.color || useAvatarColor(props.senderAlias || '')

  return useObserver(() => {
    return (
      <View
        style={{
          ...styles.wrap,
          height: props.reply ? 65 : 'auto',
          paddingTop: props.reply ? 0 : 10,
          borderTopWidth: props.reply ? 1 : 0,
          borderTopColor: theme.border
        }}
      >
        <View style={{ ...styles.replyBar, backgroundColor: nameColor }} />
        <View style={{ ...styles.replyWrap }}>
          {props.replyMsg && <ReplySource {...props} />}

          <View style={{ ...styles.replyContent }}>
            <Typography color={nameColor} numberOfLines={1} fw='500'>
              {props.senderAlias || ''}
            </Typography>
            <Typography style={{ maxWidth: '100%' }} numberOfLines={1}>
              {props.content}
            </Typography>
          </View>
        </View>
        {props.reply && (
          <IconButton
            icon='close'
            size={18}
            color={theme.icon}
            style={{ ...styles.close }}
            onPress={onCloseHandler}
          />
        )}
      </View>
    )
  })
}

function ReplySource(props) {
  const typ = constantCodes['message_types'][props.replyMsg.type]

  switch (typ) {
    case 'message':
      return <></>

    case 'attachment':
      return <Media {...props.replyMsg} reply={props.reply} />

    case 'boost':
    default:
      return <></>
  }
}

function Media(props) {
  const { id, message_content, media_type, chat, media_token } = props
  const theme = useTheme()
  const isMe = props.sender === 1

  const ldat = parseLDAT(media_token)

  let amt = null
  let purchased = false
  if (ldat.meta && ldat.meta.amt) {
    amt = ldat.meta.amt
    if (ldat.sig) purchased = true
  }

  let { data, uri, loading, trigger, paidMessageText } = useCachedEncryptedFile(
    props,
    ldat
  )

  useEffect(() => {
    trigger()
  }, [media_token])

  const hasImgData = data || uri ? true : false
  const showPurchaseButton = amt && !isMe ? true : false

  return (
    <View style={{ width: props.reply ? '15%' : '25%' }}>
      {!hasImgData ? (
        <Ionicon name='lock-closed' color={theme.silver} size={30} />
      ) : (
        <FastImage
          style={{ ...styles.photo }}
          resizeMode='cover'
          source={{ uri: uri || data }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    paddingRight: 50,
    paddingLeft: 20
  },
  replyBar: {
    width: 5,
    height: '90%',
    marginRight: 10
  },
  replyWrap: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  replyContent: {
    display: 'flex',
    width: '85%'
  },
  photo: {
    width: 40,
    height: 40,
    borderRadius: 10
  },
  close: {
    position: 'absolute',
    top: 2,
    right: 5
  }
})
