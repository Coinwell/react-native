import React from 'react'
import { View, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'

import { useTheme } from '../../../store'
import { useAvatarColor } from '../../../store/hooks/msg'
import Typography from '../../common/Typography'

export default function AvatarsRow({
  aliases,
  borderColor
}: {
  aliases: string[]
  borderColor?: string
}) {
  const theAliases = aliases && aliases.slice(0, 3)
  return (
    <View style={styles.row}>
      {theAliases &&
        theAliases.map((a, i) => {
          return (
            <AvatarTiny key={i} i={i} size={22} alias={a} borderColor={borderColor} />
          )
        })}
    </View>
  )
}

function AvatarTiny(props) {
  const theme = useTheme()
  const name = props.alias || 'N2N2'
  const photo = props.photo
  const size = props.size
  const borderRadius = Math.ceil(props.size / 2)
  let initial = ''
  const arr = name.split(' ')
  arr.forEach((str, i) => {
    if (i < 2) initial += str.substring(0, 1).toUpperCase()
  })
  if (photo) {
    return (
      <View
        style={{
          ...styles.avatar,
          height: size,
          width: size,
          borderRadius,
          borderColor: props.borderColor || 'black',
          borderWidth: 1
        }}
      >
        <FastImage
          source={{ uri: photo }}
          style={{ width: size, height: size }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    )
  }
  return (
    <View
      style={{
        right: props.i * 12,
        borderColor: props.borderColor || 'black',
        borderWidth: 1,
        ...styles.wrap,
        height: size,
        width: size,
        borderRadius,
        backgroundColor: useAvatarColor(name)
      }}
    >
      <Typography size={10} color={theme.white}>
        {initial}
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginLeft: 8,
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  avatar: {
    marginLeft: 8,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    maxWidth: '100%',
    minWidth: 30
  }
})
