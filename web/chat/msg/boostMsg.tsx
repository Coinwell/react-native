import React, {useEffect,useLayoutEffect,useRef} from 'react'
import {useTheme} from '../../../src/store'
import styled from 'styled-components'
import SvgIcon from '@material-ui/core/SvgIcon';
import { useParsedJsonOrClipMsg } from '../../../src/store/hooks/msg'

export default function BoostMsg(props){
  const {sender, message_content} = props
  const params = useParsedJsonOrClipMsg(message_content)
  const {feedID, itemID, ts, amount} = params
  // const isMe = sender === 1
  const theme = useTheme()
  return <Pad>
    <span>{`Boost ${amount}`}</span>
    <Circle style={{background:theme.accent}}>
      <RocketIcon style={{height:18,width:18,fill:'white'}} />
    </Circle>
  </Pad>
}

function RocketIcon({style}){
  return <SvgIcon style={style} viewBox="0 0 24 24">
    <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8.18 17.24L6.76 15.83L2 20.59V22M2 19.17L6.09 15.09C5.88 14.79 5.73 14.47 5.64 14.12L2 17.76V19.17Z" />
  </SvgIcon>
}

const Pad = styled.div`
  padding:16px;
  max-width:440px;
  word-break: break-word;
  display:flex;
  align-items:center;
`
const Circle = styled.div`
  height:28px;
  width:28px;
  border-radius:14px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-left:10px;
`