import React from 'react'
import { StatusBar, StyleSheet, View, ScrollView, Image } from 'react-native'
import { Text, Button, ActivityIndicator, Surface, HStack, ListItem, Switch, Divider, Pressable } from '@react-native-material/core'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, gql } from "@apollo/client";
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

const get_user_data = gql`
  query {
    me {
      id
      username
      email
      fullName
    }
  }
`;

const ProfileScreen = ({navigation}) => {
  const [token, setToken] = React.useState('');
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

  React.useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setToken(token);
    }
    getToken();
  }, []);
  
  const { loading, error, data } = useQuery(get_user_data, {
    context: {
      headers: {
        authorization: 'JWT ' + token
      }
    }
  });

  return (
    <View style={darkTheme ? styles.darkContainer : styles.container}>
      {/* <StatusBar backgroundColor="#876163" barStyle='light-content' /> */}
      {loading ? (
        <ActivityIndicator />
      ) :
      error ? (
        <Text>Error! {error.message}</Text>
      ) : (
        <ScrollView style={{flex: 1}}>
          <View style={{height: 110, backgroundColor: darkTheme ? '#121212' : '#876163'}}>
            <Text variant="body1" color="white" style={{ fontSize: 18, fontWeight: 'bold', paddingVertical: 8, alignSelf: 'center'}}>Profile</Text>
            <Image
              source={{uri: 'https://picsum.photos/200'}}
              style={styles.image}
              
            />
          </View>
          <Surface elevation={3} style={[styles.card, {marginTop: 70, backgroundColor: darkTheme ? '#242424' : '#fff'}]}>
            <HStack justify="space-between" items="center">
              <Text variant="h6" color={darkTheme ? '#f2f2f2' : '#000'} style={{fontSize: 18, fontWeight: 'bold'}}>Basic Info</Text>
              <Button 
                title="Edit"
                variant="text"
                color={darkTheme ? '#ffcfbc' : '#593739'}
                leading={<MaterialIcons name="edit" size={18} color={darkTheme ? '#ffcfbc' : '#593739'} />}
              />
            </HStack>
            <Text variant="body2" color="#b86f5f" style={{marginTop: 8}}>Username</Text>
            <Text color={darkTheme ? '#f2f2f2' : '#000'}>{data.me.username}</Text>
            <Text variant="body2" color="#b86f5f" style={{marginTop: 8}}>Email</Text>
            <Text color={darkTheme ? '#f2f2f2' : '#000'}>{data.me.email}</Text>
            <Text variant="body2" color="#b86f5f" style={{marginTop: 8}}>Full Name</Text>
            <Text color={darkTheme ? '#f2f2f2' : '#000'}>{data.me.fullName}</Text>
          </Surface>
          <Pressable>
            <HStack justify="space-between" items="center" p={16}>
              <Text color={darkTheme ? '#f2f2f2' : '#000'} variant="body1">Student Details</Text>
              <Feather name="chevron-right" size={18} color={darkTheme ? '#ffcfbc' : '#593739'} />
            </HStack>
          </Pressable>
          <Divider color={darkTheme ? '#323232' : '#e2e2e2'} style={{marginHorizontal: 16}} />
          <Pressable>
            <HStack justify="space-between" items="center" p={16}>
              <Text color={darkTheme ? '#f2f2f2' : '#000'} variant="body1">Applied Jobs</Text>
              <Feather name="chevron-right" size={18} color={darkTheme ? '#ffcfbc' : '#593739'} />
            </HStack>
          </Pressable>
          <Divider color={darkTheme ? '#323232' : '#e2e2e2'} style={{marginHorizontal: 16}} />
          <Pressable>
            <HStack justify="space-between" items="center" p={16}>
              <Text color={darkTheme ? '#f2f2f2' : '#000'} variant="body1">Saved Jobs</Text>
              <Feather name="chevron-right" size={18} color={darkTheme ? '#ffcfbc' : '#593739'} />
            </HStack>
          </Pressable>
          <Divider color={darkTheme ? '#323232' : '#e2e2e2'} style={{marginHorizontal: 16}} />
          <Pressable onPress={() => navigation.navigate('Settings')}>
            <HStack justify="space-between" items="center" p={16}>
              <Text color={darkTheme ? '#f2f2f2' : '#000'} variant="body1">Settings</Text>
              <Feather name="chevron-right" size={18} color={darkTheme ? '#ffcfbc' : '#593739'} />
            </HStack>
          </Pressable>
        </ScrollView>
      )}
    </View>
  )
}

export default ProfileScreen

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
  card: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 10,
  },
  image: {
    width: 100, 
    height: 100, 
    borderRadius: 50,
    marginLeft: 'auto', 
    marginRight: 'auto',
    marginTop: 20,
    borderWidth: 3,
    borderColor: '#fff'
  }
})