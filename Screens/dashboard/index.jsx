import React from 'react'
import { Dimensions, Platform } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { AntDesign, Entypo } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import NotificationScreen from './NotificationScreen';

const Tab = createMaterialBottomTabNavigator();
const IOSTab = createBottomTabNavigator();

const Dashboard = () => {
  const [darkTheme, setDarkTheme] = React.useState(false);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    const getTheme = async() => {
      const theme = await AsyncStorage.getItem('theme');
      if(theme === 'dark') {
        setDarkTheme(true);
      } else {
        setDarkTheme(false);
      }
    }
    if(isFocused) {
      getTheme();
    }
  }, [darkTheme, isFocused])

  return(
  Platform.OS === 'ios' ? 
    <IOSTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#b86f5f',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: darkTheme ? '#000' : '#fff'
        }
      }}
      tabBarShowLabel={false}
      keyboardHidesNavigationBar
    >
      <IOSTab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{
        headerShown: false,
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => (
          <AntDesign name="home" color={color} size={22} />
        ),
      }}
      />
      <IOSTab.Screen 
        name="Notifications" 
        component={NotificationScreen} 
        options={{
          headerShown: false,
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color }) => (
            <Entypo name="bell" color={color} size={22} />
          ),
        }}
      />
      <IOSTab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" color={color} size={22} />
          ),
        }}
      />
    </IOSTab.Navigator> :
    <Tab.Navigator
      initialRouteName="Home"
      // activeColor="#ffcfbc"
      activeColor="#b86f5f"
      inactiveColor="#a1a1a1"
      labeled={false}
      keyboardHidesNavigationBar
      barStyle={{ 
        height: Platform.OS === 'ios' ? 70 : 65,
        // backgroundColor: '#182224',
        backgroundColor: darkTheme ? '#182224' : '#f2f2f2',
        borderRadius: 20,
        width: Dimensions.get('window').width - 30,
        maxWidth: 380,
        padding: 8,
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        left: Platform.OS === 'web' ? 0 : 15,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationScreen} 
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color }) => (
            <Entypo name="bell" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" color={color} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default Dashboard