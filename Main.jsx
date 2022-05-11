import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './Screens/LandingScreen';
import LoginScreen from './Screens/auths/LoginScreen';
import Dashboard from './Screens/dashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewJobScreen from './Screens/ViewJobScreen';
import SettingsScreen from './Screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const Main = () => {

  const [isSignedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    async function checkLogin() {
      const token = await AsyncStorage.getItem('token');
      if(token) {
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    }
    checkLogin();
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <>
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="ViewJob"
              component={ViewJobScreen}
              options={({route}) => ({
                title: route.params.name,
                headerShown: Platform.OS === 'ios' ? true : false
              })}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: Platform.OS === 'ios' ? true : false
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Landing"
              component={LandingScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main