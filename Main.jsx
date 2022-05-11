import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './Screens/LandingScreen';
import LoginScreen from './Screens/auths/LoginScreen';
import Dashboard from './Screens/dashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewJobScreen from './Screens/ViewJobScreen';
import SettingsScreen from './Screens/SettingsScreen';
import { useQuery, gql } from '@apollo/client';
import AppliedJobsScreen from './Screens/AppliedJobsScreen';
import SavedJobsScreen from './Screens/SavedJobsScreen';

const get_user_data = gql`
  query Me {
    me {
      id
      username
      email
      fullName
    }
  }
`;

const Stack = createNativeStackNavigator();

const Main = () => {
  const [token, setToken] = React.useState('');
  const [isSignedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    async function checkLogin() {
      const token = await AsyncStorage.getItem('token');
      if(token) {
        setToken(token);
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    }
    checkLogin();
  }, [token]);

  const {data, loading, error} = useQuery(get_user_data, {
    context: {
      headers: {
        authorization: 'JWT ' + token
      }
    },
    pollInterval: 1000,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if(data.me) {
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    }
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
            <Stack.Screen
              name="Applied Jobs"
              component={AppliedJobsScreen}
              options={{
                headerShown: Platform.OS === 'ios' ? true : false
              }}
            />
            <Stack.Screen
              name="Saved Jobs"
              component={SavedJobsScreen}
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