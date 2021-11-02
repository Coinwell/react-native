import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { useTheme, useStores } from '../../../store'
import { DEFAULT_TRIBE_SERVER } from '../../../config'
import { reportError } from '../../../errorHelper'
import { verifyCommunity } from './utils'
import shared from './sharedStyles'
import BoostRow from './boostRow'
import Typography from '../../common/Typography'
import Avatar from '../../common/Avatar'
import Button from '../../common/Button'
import JoinTribe from '../../common/Modals/Tribe/JoinTribe'

interface Tribe {
  name: string
  description: string
  img: string
  uuid: string
  host?: string
}

export default function TribeMessage(props) {
  const theme = useTheme()
  const { ui, chats } = useStores()
  const [tribe, setTribe] = useState<Tribe>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showJoinButton, setShowJoinButton] = useState<boolean>(false)
  const [joinTribe, setJoinTribe] = useState({ visible: false, tribe: null })

  const navigation = useNavigation()

  async function loadTribe() {
    const p = extractURLSearchParams(props.message_content)

    const tribeParams = await getTribeDetails(p['host'], p['uuid'])

    if (tribeParams) {
      setTribe(tribeParams)
    } else {
      setError('Could not load Tribe.')
    }
    if (tribeParams) {
      const AJ = chats.chats.find((c) => c.uuid === tribeParams.uuid)
      if (!AJ) setShowJoinButton(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadTribe()
  }, [])

  function seeTribe() {
    if (showJoinButton) {
      setJoinTribe({
        visible: true,
        tribe,
      })
    } else {
      setJoinTribe({
        visible: true,
        tribe,
      })
    }
  }

  if (loading)
    return (
      <View style={styles.wrap}>
        <ActivityIndicator size='small' />
      </View>
    )
  if (!(tribe && tribe.uuid))
    return (
      <TouchableOpacity activeOpacity={0.8} style={shared.innerPad} onLongPress={props.onLongPressHandler}>
        <Typography color={theme.purple}>Could not load community...</Typography>
      </TouchableOpacity>
    )

  const hasImg = tribe.img ? true : false
  return (
    <>
      <TouchableOpacity activeOpacity={0.8} style={shared.innerPad} onLongPress={props.onLongPressHandler}>
        <Typography style={{ marginBottom: 10 }}>{props.message_content}</Typography>

        <View style={styles.tribeWrap}>
          <Avatar photo={hasImg && tribe.img} size={40} round={90} />
          <View style={styles.tribeText}>
            <Typography style={{ ...styles.tribeName }} numberOfLines={1}>
              {tribe.name}
            </Typography>
            <Typography color={theme.subtitle} numberOfLines={2}>
              {tribe.description}
            </Typography>
          </View>
        </View>

        <Button
          onPress={seeTribe}
          accessibilityLabel='see-community-button'
          ph={15}
          h={40}
          fs={12}
          round={5}
          style={{ width: '100%', marginTop: 12 }}
        >
          {showJoinButton ? 'Join Community' : 'View Community'}
        </Button>

        {props.showBoostRow && (
          <View style={{ marginTop: 8 }}>
            <BoostRow {...props} myAlias={props.myAlias} />
          </View>
        )}
      </TouchableOpacity>

      <JoinTribe
        visible={joinTribe.visible}
        tribe={joinTribe.tribe}
        close={() => {
          setJoinTribe({
            visible: false,
            tribe: null,
          })
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
    maxWidth: 440,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  tribeWrap: {
    display: 'flex',
    flexDirection: 'row',
  },
  tribeText: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 8,
    // maxWidth: 160,
    flex: 1,
  },
  tribeName: {
    marginBottom: 5,
  },
})

async function getTribeDetails(host: string, uuid: string) {
  if (!host || !uuid) return
  const theHost = host.includes('localhost') ? DEFAULT_TRIBE_SERVER : host
  try {
    const r = await fetch(`https://${theHost}/tribes/${uuid}`)
    const j = await r.json()

    if (j.bots) {
      try {
        const bots = JSON.parse(j.bots)
        j.bots = bots
      } catch (e) {
        j.bots = []
        reportError(e)
      }
    }
    return j
  } catch (e) {
    reportError(e)
  }
}

function extractURLSearchParams(url: string) {
  let regex = /[?&]([^=#]+)=([^&#]*)/g
  let match
  let params = {}
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2]
  }
  return params
}
