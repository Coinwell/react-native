import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View } from 'react-native'
import Share from 'react-native-share'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'
import QRCode from 'react-native-qrcode-svg'

import { useStores, useTheme } from '../../../store'
import { DEFAULT_DOMAIN } from '../../../config'
import { SCREEN_WIDTH, TOAST_DURATION } from '../../../constants'
import ModalWrap from './ModalWrap'
import Header from './ModalHeader'
import Button from '../Button'
import Typography from '../Typography'

export default function ShareGroup() {
  const { ui, chats } = useStores()
  const theme = useTheme()

  function copy() {
    Clipboard.setString(uuid)
    Toast.showWithGravity('Tribe QR Copied!', TOAST_DURATION, Toast.CENTER)
  }

  async function share() {
    try {
      await Share.open({ message: uuid })
    } catch (e) {}
  }

  function close() {
    ui.setShareTribeUUID(null)
  }

  const uuid = ui.shareTribeUUID
  const host = chats.getDefaultTribeServer().host
  const qr = `${DEFAULT_DOMAIN}://?action=tribe&uuid=${uuid}&host=${host}`

  return useObserver(() => (
    <ModalWrap visible={ui.shareTribeUUID ? true : false}>
      <Header title='Community QR Code' onClose={close} />
      <View style={styles.wrap}>
        <View
          style={{
            ...styles.content
          }}
        >
          <QRCode value={qr} size={SCREEN_WIDTH / 1.3} />
          {/* <Typography color={theme.subtitle}>{qr}</Typography> */}
          <View style={styles.buttonsWrap}>
            <Button onPress={() => share()} w={120}>
              Share
            </Button>
            <Button onPress={() => copy()} w={120}>
              Copy
            </Button>
          </View>
        </View>
      </View>
    </ModalWrap>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingTop: 20
  },
  content: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH / 1.3
  },
  buttonsWrap: {
    paddingTop: 40,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  }
})
