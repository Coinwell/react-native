import React, { useState, useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../store'
import ModalWrap from './modalWrap'
import Header from './modalHeader'

const apps = [{ name: 'cash', label: 'Cash App', url: 'https://cash.app/$', img: require('../../../android_assets/apps/cash.png') }]

export default function AddSatsWrap({ visible }) {
  const { ui } = useStores()

  function close() {
    ui.setAddSatsModal(false)
  }

  return (
    <ModalWrap onClose={close} visible={visible}>
      {visible && <AddSats close={close} />}
    </ModalWrap>
  )
}

function AddSats({ close }) {
  const [selectedApp, setSelectedApp] = useState(null)

  function selectApp(a) {
    setSelectedApp(a)
  }

  return useObserver(() => (
    <>
      <Header title='Add Sats' onClose={close} />

      {(!selectedApp ? true : false) && <Apps selectApp={selectApp} />}

      {(selectedApp ? true : false) && <Do app={selectedApp} />}
    </>
  ))
}

function Apps({ selectApp }) {
  const theme = useTheme()
  return (
    <View style={styles.appsWrap}>
      {apps.map(app => {
        return (
          <TouchableOpacity key={app.name} style={{ ...styles.appWrap, borderColor: theme.border, backgroundColor: theme.main }} onPress={() => selectApp(app)}>
            <FastImage source={app.img} style={{ height: 48, width: 48, marginRight: 12 }} />
            <Text style={{ ...styles.appLabel, color: theme.title }}>{app.label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

function Do({ app }) {
  const { name, label, url, img } = app
  const { ui, queries } = useStores()
  const theme = useTheme()

  const [loading, setLoading] = useState(true)
  const [addy, setAddy] = useState('')
  const [err, setErr] = useState('')
  const [spd, setSpd] = useState(5000)
  const [canLink, setCanLink] = useState(false)

  async function gen() {
    setLoading(true)
    console.log('get onchain address for', name)
    const addy = await queries.onchainAddress(name)
    if (!addy) {
      return setErr('Could not generate address')
    }
    setLoading(false)
    setAddy(addy)
  }

  async function getExchangeRate() {
    const spd = await queries.satsPerDollar()
  }

  useEffect(() => {
    gen()
    getExchangeRate()
  }, [])

  function openLink() {
    Linking.openURL(url)
  }

  function copyAddy() {
    Clipboard.setString(addy)
    Toast.showWithGravity('Address Copied!', Toast.SHORT, Toast.TOP)

    setCanLink(true)
  }

  return (
    <View style={styles.do}>
      {/* <View style={styles.buttonWrap}>
      <Button onPress={gen} mode="contained" dark={true}
        style={styles.addButton} loading={loading}>
        Get Onchain Address
      </Button>
    </View> */}
      <View style={styles.stuffWrap}>
        <Text style={{ ...styles.addyLabel, color: theme.subtitle }}>Bitcoin Address:</Text>
        <TextInput mode='outlined' placeholder='Bitcoin Address' value={addy} editable={false} style={styles.input} />
        <Button onPress={copyAddy} disabled={!addy ? true : false} loading={loading}>
          <Text style={{ color: theme.subtitle }}>Tap to Copy</Text>
        </Button>
        <TouchableOpacity style={{ ...styles.linkWrap, opacity: canLink ? 1 : 0.5 }} onPress={openLink} disabled={!canLink}>
          <FastImage source={img} style={{ height: 48, width: 48, marginRight: 12 }} />
          <Text style={{ ...styles.appLabel, color: theme.title }}>{`Open ${label} ➞`}</Text>
        </TouchableOpacity>
        <View style={styles.pleaseWrap}>
          <Text style={{ color: theme.subtitle }}>Please send between 0.0005 and 0.005 Bitcoin. After the transaction is confirmed, it will be added to your account.</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButton: {
    backgroundColor: '#6289FD',
    borderRadius: 30,
    width: '75%',
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 28
  },
  appsWrap: {
    display: 'flex',
    padding: 12
  },
  appWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderRadius: 6,
    width: '100%'
  },
  appLabel: {
    fontSize: 18
  },
  do: {
    display: 'flex'
  },
  input: {
    maxHeight: 55,
    minWidth: 200,
    marginBottom: 20,
    marginTop: 2
  },
  linkWrap: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  addyLabel: {
    marginBottom: 5,
    marginTop: 30
  },
  stuffWrap: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column'
  },
  pleaseWrap: {
    marginTop: 25
  }
})
