import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { TextInput } from 'react-native-paper'
import Video from 'react-native-video'
import { useNavigation } from '@react-navigation/native'

import { useStores, useTheme, hooks } from '../../../../store'
import { DEFAULT_TRIBE_SERVER } from '../../../../config'
import { SCREEN_HEIGHT } from '../../../../constants'
import { setTint } from '../../StatusBar'
import Header from '../ModalHeader'
import Button from '../../Button'
import Avatar from '../../Avatar'
import Typography from '../../Typography'
import SlideUp from '../../Animations/SlideUp'

const { useTribes } = hooks

export default function JoinTribeWrap(props) {
  return <>{props.visible && <JoinTribe {...props} />}</>
}

function JoinTribe(props) {
  const { visible, close, tribe } = props
  const { ui, chats } = useStores()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [finish, setFinish] = useState(false)
  const [alias, setAlias] = useState('')
  const navigation = useNavigation()

  const tribes = useTribes()
  const tribeToCheck = tribes && tribes.find(t => t.uuid === tribe.uuid)
  let joined = false
  if (tribeToCheck) {
    joined = tribeToCheck.joined
  }

  async function joinTribe() {
    setLoading(true)
    setFinish(true)
    setLoading(false)
    setTimeout(() => setTint('dark'), 500)
  }

  async function done() {
    await chats.joinTribe({
      name: tribe.name,
      group_key: tribe.group_key,
      owner_alias: tribe.owner_alias,
      owner_pubkey: tribe.owner_pubkey,
      host: tribe.host || DEFAULT_TRIBE_SERVER,
      uuid: tribe.uuid,
      img: tribe.img,
      amount: tribe.price_to_join || 0,
      is_private: tribe.private,
      ...(alias && { my_alias: alias })
    })

    close()
    navigation.navigate('Tribe', { tribe: { ...tribeToCheck } })
    setTimeout(() => setTint(theme.dark ? 'dark' : 'light'), 150)
  }

  let prices = []
  if (tribe) {
    prices = [
      { label: 'Price to Join', value: tribe.price_to_join },
      { label: 'Price per Message', value: tribe.price_per_message },
      { label: 'Amount to Stake', value: tribe.escrow_amount }
    ]
  }

  const hasImg = tribe && tribe.img ? true : false

  return useObserver(() => {
    return (
      <>
        <Modal
          visible={visible}
          animationType='slide'
          presentationStyle='fullScreen'
          onDismiss={close}
        >
          <SafeAreaView style={{ ...styles.wrap, backgroundColor: theme.bg }}>
            <KeyboardAvoidingView
              behavior='padding'
              style={{ flex: 1 }}
              keyboardVerticalOffset={1}
            >
              <Header title='Join Community' onClose={() => close()} />
              <ScrollView>
                {tribe && (
                  <View style={{ ...styles.content }}>
                    <Avatar photo={hasImg && tribe.img} size={160} round={90} />
                    <Typography
                      size={20}
                      fw='500'
                      style={{
                        marginTop: 10
                      }}
                    >
                      {tribe.name}
                    </Typography>
                    <Typography
                      color={theme.subtitle}
                      style={{
                        marginTop: 10,
                        marginBottom: 10,
                        maxWidth: 340,
                        textAlign: 'center',
                        marginHorizontal: 'auto'
                      }}
                    >
                      {tribe.description}
                    </Typography>
                    <View style={{ ...styles.table, borderColor: theme.border }}>
                      {prices &&
                        prices.map((p, i) => {
                          return (
                            <View
                              key={i}
                              style={{
                                ...styles.tableRow,
                                borderBottomColor: theme.border,
                                borderBottomWidth: i === prices.length - 1 ? 0 : 1
                              }}
                            >
                              <Typography color={theme.title}>{`${p.label}`}</Typography>
                              <Typography fw='500'>{p.value || 0}</Typography>
                            </View>
                          )
                        })}
                    </View>
                    {!joined ? (
                      <>
                        <TextInput
                          placeholder='Your Name in this Tribe'
                          onChangeText={e => setAlias(e)}
                          value={alias}
                          style={{
                            ...styles.input,
                            backgroundColor: theme.bg,
                            color: theme.placeholder
                          }}
                          underlineColor={theme.border}
                        />
                        <Button
                          style={{ marginBottom: 20 }}
                          onPress={joinTribe}
                          loading={loading}
                          size='large'
                          w={240}
                        >
                          Join
                        </Button>
                      </>
                    ) : (
                      <>
                        <Typography
                          size={16}
                          color={theme.subtitle}
                          style={{
                            marginTop: 10,
                            maxWidth: 340,
                            textAlign: 'center'
                          }}
                        >
                          You already joined this community.
                        </Typography>
                        <Button w={300} onPress={done} style={{ marginVertically: 20 }}>
                          Go to {tribeToCheck.name}
                        </Button>
                      </>
                    )}
                  </View>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>

          {finish && <MemoizedVideoView tribe={tribeToCheck} done={done} />}
        </Modal>
      </>
    )
  })
}

function VideoView({ tribe, done }) {
  const theme = useTheme()
  const network = require('../../../../assets/videos/network-nodes-blue.mp4')

  return (
    <SlideUp>
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: theme.black,
          height: SCREEN_HEIGHT
        }}
      >
        <Video
          source={network}
          resizeMode='cover'
          style={{
            height: SCREEN_HEIGHT
          }}
        />

        {tribe && (
          <View
            style={{
              position: 'absolute',
              bottom: 100,
              right: 0,
              left: 0,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1
            }}
          >
            <Button w={300} onPress={done}>
              Go to {tribe.name}
            </Button>
          </View>
        )}
      </View>
    </SlideUp>
  )
}

const MemoizedVideoView = React.memo(VideoView)

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  table: {
    borderWidth: 1,
    borderRadius: 5,
    width: 240,
    marginTop: 25,
    marginBottom: 25
  },
  tableRow: {
    borderBottomWidth: 1,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  input: {
    height: 50,
    maxHeight: 50,
    minWidth: 240,
    marginBottom: 40
  }
})