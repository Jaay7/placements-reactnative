import React from 'react'
import { StatusBar, StyleSheet, View, ScrollView, Image } from 'react-native'
import { Text, Button, ActivityIndicator, Surface, HStack } from '@react-native-material/core'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, gql } from "@apollo/client";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

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

const ProfileScreen = () => {
  const [token, setToken] = React.useState('');

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
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) :
      error ? (
        <Text>Error! {error.message}</Text>
      ) : (
        <ScrollView style={{flex: 1}}>
          <View style={styles.box}>
            <Text variant="body1" color="white" style={{ fontSize: 18, fontWeight: 'bold', paddingVertical: 8, alignSelf: 'center'}}>Profile</Text>
            <Image
              source={{uri: 'https://picsum.photos/200'}}
              style={styles.image}
              
            />
          </View>
          <Surface elevation={3} style={[styles.card, {marginTop: 70}]}>
            <HStack justify="space-between" items="center">
              <Text variant="h6" style={{fontSize: 18, fontWeight: 'bold'}}>Basic Info</Text>
              <Button 
                title="Edit"
                variant="text"
                color="#593739"
                leading={<MaterialIcons name="edit" size={18} color="#593739" />}
              />
            </HStack>
            <Text variant="body2" color="#b86f5f" style={{marginTop: 8}}>Username</Text>
            <Text>{data.me.username}</Text>
            <Text variant="body2" color="#b86f5f" style={{marginTop: 8}}>Email</Text>
            <Text>{data.me.email}</Text>
            <Text variant="body2" color="#b86f5f" style={{marginTop: 8}}>Full Name</Text>
            <Text>{data.me.fullName}</Text>
          </Surface>
          <Surface elevation={3} style={styles.card}>
            <HStack justify="space-between" items="center">
              <Text variant="body1">Student Details</Text>
              <Ionicons name="ios-arrow-forward" size={18} color="#593739" />
            </HStack>
          </Surface>
          <Surface elevation={3} style={styles.card}>
            <HStack justify="space-between" items="center">
              <Text variant="body1">Applied Jobs</Text>
              <Ionicons name="ios-arrow-forward" size={18} color="#593739" />
            </HStack>
          </Surface>
          <Surface elevation={3} style={styles.card}>
            <HStack justify="space-between" items="center">
              <Text variant="body1">Saved Jobs</Text>
              <Ionicons name="ios-arrow-forward" size={18} color="#593739" />
            </HStack>
          </Surface>
          <Button 
            title="Logout"
            color="#b86f5f"
            tintColor='#fff'
            variant="contained"
            titleStyle={{fontSize: 16}}
            uppercase={false}
            style={{marginHorizontal: 12, marginTop: 10}}
            onPress={async() => {
              await AsyncStorage.removeItem('token');
            }}
          />
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
  box: {
    height: 110,
    backgroundColor: '#876163'
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fff'
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