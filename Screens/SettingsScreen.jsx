import React from 'react'
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { Text, Button, Switch, ListItem, AppBar, HStack } from '@react-native-material/core';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({navigation}) => {
  const [theme, setTheme] = React.useState('light');
  const [checked, setChecked] = React.useState(false);
  
  React.useEffect(() => {
    const getTheme = async() => {
      const theme = await AsyncStorage.getItem('theme');
      if(theme === 'dark') {
        setTheme('dark');
        setChecked(true);
      } else {
        setTheme('light');
        setChecked(false);
      }
    }
    getTheme();
  }, [theme])

  const toggleSwitch = async() => {
    setChecked(!checked);
    if (checked) {
      setTheme('light');
      await AsyncStorage.setItem('theme', 'light');
    } else {
      setTheme('dark');
      await AsyncStorage.setItem('theme', 'dark');
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: checked ? 'black' : 'white',
      },
      headerTitleStyle: {
        color: checked ? 'white' : 'black',
      }
    });
  })

  return (
    <View style={checked ? styles.darkContainer : styles.container}>
      <StatusBar backgroundColor={checked ? '#121212' : '#593739'} barStyle='light-content' />
      {Platform.OS !== 'ios' && <AppBar 
        title="Settings"
        color={checked ? '#121212' : '#593739'}
        leading={
          <Ionicons name="arrow-back-outline" size={24} color="white" onPress={() => navigation.goBack()} />
        }
      />}
      <HStack justify="space-between" items="center" p={10}>
        <Text color={checked ? '#f2f2f2' : '#000'} variant="body1">Dark Theme</Text>
        <Switch
          value={checked}
          onValueChange={toggleSwitch}
          thumbColor={checked ? '#ed9e8c' : '#e2e2e2'}
          trackColor={{ false: '#c2c2c2', true: '#ffcfbc70' }}
        />
      </HStack>
      <Text>{theme}</Text>
      <Button 
        title="Logout"
        color={checked ? "#ffcfbc40" : "#b86f5f"}
        tintColor={checked ? "#ffcfbc" : '#fff'}
        variant="contained"
        titleStyle={{fontSize: 16}}
        uppercase={false}
        style={{marginHorizontal: 12, marginTop: 10}}
        onPress={async() => {
          await AsyncStorage.removeItem('token');
        }}
      />
    </View>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: StatusBar.currentHeight
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: StatusBar.currentHeight
  },
})