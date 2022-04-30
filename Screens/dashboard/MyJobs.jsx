import React from 'react'
import { Text } from '@react-native-material/core'
import { StatusBar, StyleSheet, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyJobs = () => {
  const [darkTheme, setDarkTheme] = React.useState(false);

  React.useEffect(() => {
    const getTheme = async() => {
      const theme = await AsyncStorage.getItem('theme');
      if(theme === 'dark') {
        setDarkTheme(true);
      } else {
        setDarkTheme(false);
      }
    }
    getTheme();
  }, [darkTheme]);

  return (
    <View style={darkTheme ? styles.darkContainer : styles.container}>
      <Text color={darkTheme ? '#f2f2f2' : '#000'}>MyJobs</Text>
    </View>
  )
}

export default MyJobs

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