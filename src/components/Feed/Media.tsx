import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import FastImage from 'react-native-fast-image'
import { IconButton } from 'react-native-paper'
import Ionicon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import { useStores, useTheme, hooks } from '../../store'
import { calendarDate } from '../../store/utils/date'
import { parseLDAT } from '../utils/ldat'
import { useCachedEncryptedFile } from '../chat/msg/hooks'
import { SCREEN_WIDTH, SCREEN_HEIGHT, STATUS_BAR_HEIGHT } from '../../constants'
import Typography from '../common/Typography'
import Divider from '../common/Layout/Divider'

function Media(props) {
  const {
    index,
    id,
    message_content,
    media_type,
    chat,
    media_token,
    onMediaPress,
    created_at
  } = props
  const theme = useTheme()

  const ldat = parseLDAT(media_token)
  let { data, uri, loading, trigger, paidMessageText } = useCachedEncryptedFile(
    props,
    ldat
  )

  let amt = null
  let purchased = false
  if (ldat.meta && ldat.meta.amt) {
    amt = ldat.meta.amt
    if (ldat.sig) purchased = true
  }

  useEffect(() => {
    trigger()
  }, [media_token])

  const hasImgData = data || uri ? true : false

  console.log('loading', loading)

  return (
    <>
      <View style={{ ...styles.mediaItem }}>
        {/* <MediaType type={media_type} data={data} uri={uri} /> */}
        {!loading ? (
          hasImgData && <MediaType type={media_type} data={data} uri={uri} />
        ) : (
          <ActivityIndicator animating={true} color='grey' />
        )}
        {/* {hasImgData ? (
          <MediaType type={media_type} data={data} uri={uri} />
        ) : (
          // <Typography>{media_type}</Typography>
          <ActivityIndicator animating={true} color='grey' />
        )} */}

        <View style={{ ...styles.footer }}>
          <IconButton
            icon={() => (
              <Ionicon name='rocket-outline' color={theme.iconPrimary} size={24} />
            )}
            onPress={() => console.log('boost!')}
          />
          <Typography size={12} color={theme.subtitle} style={{ paddingRight: 5 }}>
            {calendarDate(moment(created_at), 'MMM DD, YYYY')}
          </Typography>
        </View>
        {/* {index + 1 !== media.length && <Divider mt={10} mb={10} />} */}
        <Divider mt={10} mb={10} />
      </View>
    </>
  )
}

function MediaType({ type, data, uri }) {
  const h = SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 60
  const w = SCREEN_WIDTH
  const [photoH, setPhotoH] = useState(h)

  if (type === 'n2n2/text') return <></>
  if (type.startsWith('image')) {
    return (
      <View
        style={{
          width: w,
          height: photoH
        }}
      >
        <FastImage
          resizeMode='contain'
          source={{ uri: uri || data }}
          style={{ ...styles.photo }}
          onLoad={evt => {
            setPhotoH((evt.nativeEvent.height / evt.nativeEvent.width) * w)
          }}
        />
      </View>
    )
  } else {
    return <></>
  }
}

const styles = StyleSheet.create({
  mediaItem: {
    // flex: 1
  },
  photoWrap: {
    position: 'relative',
    width: SCREEN_WIDTH / 3 - 10 / 3,
    height: SCREEN_WIDTH / 3 - 10 / 3,
    marginBottom: 5
  },
  photo: {
    width: '100%',
    height: '100%'
    // borderRadius: 5
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 5,
    paddingLeft: 5
    // marginBottom: 10
  }
})

export default React.memo(Media)
