import React, { useMemo } from 'react'
import { StyleSheet, Alert, TouchableOpacity, Image, View, Linking } from 'react-native'
import RNUrlPreview from 'react-native-url-preview'
import Hyperlink from 'react-native-hyperlink'
import * as linkify from 'linkifyjs'

import { useTheme } from '../../../store'
import { useParsedGiphyMsg } from '../../../store/hooks/msg'
import { getRumbleLink, getYoutubeLink, verifyCommunity, verifyPubKey } from './utils'
import shared from './sharedStyles'
import ClipMessage from './clipMsg'
import BoostMessage from './boostMsg'
import BoostRow from './boostRow'
import TribeMsg from './tribeMsg'
import EmbedVideo from './embedVideo'
import Typography from '../../common/Typography'

export default function TextMsg(props) {
  const theme = useTheme()
  const { isMe, message_content, isTribe } = props

  const rumbleLink = useMemo(() => getRumbleLink(message_content), [message_content])
  const youtubeLink = useMemo(() => getYoutubeLink(message_content), [message_content])
  const showBoostRow = props.boosts_total_sats ? true : false
  const isGiphy = message_content && message_content.startsWith('giphy::')
  const isClip = message_content && message_content.startsWith('clip::')
  const isBoost = message_content?.startsWith('boost::')
  const isLink = linkify.find(message_content, 'url').length > 0
  const { isPubKey } = verifyPubKey(message_content)
  const isCommunity = verifyCommunity(message_content)

  const onLongPressHandler = () => props.onLongPress(props)

  /**
   * Returns
   */
  if (isGiphy) {
    // TODO: Move this block to a separated component
    const { url, aspectRatio, text } = useParsedGiphyMsg(message_content)
    return (
      <TouchableOpacity style={{ ...styles.column, maxWidth: 200 }} onLongPress={onLongPressHandler}>
        <Image source={{ uri: url }} style={{ width: 200, height: 200 / (aspectRatio || 1) }} resizeMode={'cover'} />
        {(text ? true : false) && (
          <Typography color={isMe ? theme.white : theme.text} size={16} styles={styles.textPad}>
            {text}
          </Typography>
        )}
        {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} pad marginTop={14} />}
      </TouchableOpacity>
    )
  }
  if (isClip)
    return (
      <View style={styles.column}>
        <ClipMessage {...props} />
        {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} pad />}
      </View>
    )
  if (isBoost) return <BoostMessage {...props} />
  if (rumbleLink || youtubeLink)
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={isLink ? { width: 280, minHeight: 72 } : shared.innerPad}
        onLongPress={onLongPressHandler}
      >
        {/* TODO: Refactor with a better logic */}
        {!!rumbleLink && <EmbedVideo type='rumble' link={rumbleLink} onLongPress={onLongPressHandler} />}
        {!!youtubeLink && <EmbedVideo type='youtube' link={youtubeLink} onLongPress={onLongPressHandler} />}
        {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} pad />}
      </TouchableOpacity>
    )

  if (isPubKey) {
    return (
      <TouchableOpacity activeOpacity={0.8} style={shared.innerPad} onLongPress={onLongPressHandler}>
        <Typography color={theme.purple} size={15}>
          {message_content}
        </Typography>
        {showBoostRow && <BoostRow {...props} isTribe={isTribe} myAlias={props.myAlias} />}
      </TouchableOpacity>
    )
  }

  if (isCommunity) {
    return <TribeMsg {...props} showBoostRow={showBoostRow} onLongPressHandler={onLongPressHandler} />
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={isLink ? { width: 280, minHeight: 72, ...shared.innerPad } : shared.innerPad}
      onLongPress={onLongPressHandler}
    >
      {isLink ? (
        <View style={styles.linkWrap}>
          <Hyperlink
            linkStyle={{ color: theme.blue }}
            onPress={(url) => {
              Alert.alert('Warning', 'Link may contain harmful content, wanna continue?', [
                { text: 'No', onPress: () => {} },
                { text: 'Yes', onPress: () => Linking.openURL(url) },
              ])
            }}
          >
            <Typography color={theme.text} size={15}>
              {message_content}
            </Typography>
          </Hyperlink>
          <RNUrlPreview {...linkStyles(theme)} text={message_content} />
        </View>
      ) : (
        <Typography color={theme.text} size={15}>
          {message_content}
        </Typography>
      )}
      {showBoostRow && (
        <BoostRow
          {...props}
          isTribe={isTribe}
          myAlias={props.myAlias}
          {...(isLink && {
            pad: true,
            customPad: {
              paddingLeft: 10,
              paddingRight: 20,
              paddingTop: 0,
              paddingBottom: 0,
            },
          })}
        />
      )}
    </TouchableOpacity>
  )
}

function linkStyles(theme) {
  return {
    containerStyle: {
      alignItems: 'center',
    },
    imageStyle: {
      width: 80,
      height: 80,
      paddingRight: 10,
      paddingLeft: 10,
    },
    titleStyle: {
      fontSize: 14,
      color: theme.title,
      marginRight: 10,
      marginBottom: 5,
      alignSelf: 'flex-start',
      fontFamily: 'Helvetica',
    },
    descriptionStyle: {
      fontSize: 11,
      color: theme.subtitle, //"#81848A",
      marginRight: 10,
      alignSelf: 'flex-start',
      fontFamily: 'Helvetica',
    },
  }
}

const styles = StyleSheet.create({
  linkWrap: {
    display: 'flex',
  },
  link: {
    padding: 10,
    color: '#6289FD',
  },
  column: {
    display: 'flex',
    maxWidth: '100%',
  },
  textPad: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12,
  },
  littleTitle: {
    fontSize: 11,
    paddingTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
  },
  pubKeyWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  pubKeyContent: {
    maxWidth: '90%',
    paddingHorizontal: 14,
  },
  pubKey: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
