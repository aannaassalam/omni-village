import { Box, Text } from '@react-native-material/core'
import React from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'

export default function Home({navigation,route}) {
  return (
    <SafeAreaView>
        <ScrollView>
            <Box>
                <Text variant='h2'>Hello from {route?.name}</Text>
            </Box>
        </ScrollView>
    </SafeAreaView>
  )
}
