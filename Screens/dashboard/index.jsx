import React from 'react'
import { Dimensions, Platform } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import MyJobs from './MyJobs';
import ProfileScreen from './ProfileScreen';

const Tab = createMaterialBottomTabNavigator();

const Dashboard = () => {
  return(
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
        backgroundColor: '#f2f2f2',
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
        name="MyJobs" 
        component={MyJobs} 
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="work" color={color} size={22} />
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