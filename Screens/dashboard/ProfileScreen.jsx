import React from 'react'
import { View } from 'react-native'
import { Text, Button } from '@react-native-material/core'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  return (
    <View>
      <Text>ProfileScreen</Text>
      <Button 
        title="Logout"
        uppercase={false}
        onPress={async() => {
          await AsyncStorage.removeItem('token');
        }}
      />
    </View>
  )
}

export default ProfileScreen