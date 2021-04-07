import React from 'react'
import { Button as PaperButton } from 'react-native-paper'

export default function Button(props) {
  const { mode, accessibilityLabel, style, btnHeight, loading, disabled, onPress, dark, icon, children } = props

  return (
    <PaperButton mode={mode} accessibilityLabel={accessibilityLabel} loading={loading} disabled={disabled} onPress={onPress} style={style} contentStyle={{ height: btnHeight }} dark={dark} icon={icon}>
      {children}
    </PaperButton>
  )
}

Button.defaultProps = {
  mode: 'contained',
  btnHeight: 60
}
