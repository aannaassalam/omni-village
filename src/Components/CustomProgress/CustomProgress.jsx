import React from 'react'
import * as Progress from 'react-native-progress';


export default function CustomProgress({color}) {
  return (
    <>
    <Progress.Bar progress={0.3} width={55} color={color} />
    </>
  )
}
