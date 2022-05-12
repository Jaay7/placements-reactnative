import React from 'react'
import { ActivityIndicator, Text, AppBar, HStack, VStack, Button, Surface } from '@react-native-material/core'
import { StatusBar, StyleSheet, View, Platform, Image, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';

const get_applied_jobs = gql`
  query UserAppliedJobs {
    userAppliedJobs {
      id
      jobTitle
      companyName
      companyLogo
      jobLocation
    }
  }
`;

const AppliedJobsScreen = ({navigation}) => {
  const [token, setToken] = React.useState('');
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
  }, [darkTheme, isFocused]);

  React.useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setToken(token);
    }
    if(isFocused) {
      getToken();
    }
  }, [token, isFocused]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: darkTheme ? 'black' : 'white',
      },
      headerTitleStyle: {
        color: darkTheme ? 'white' : 'black',
      }
    });
  })

  const { data, loading, error } = useQuery(get_applied_jobs, {
    context: {
      headers: {
        authorization: 'JWT ' + token
      }
    },
    pollInterval: 500
  });

  return (
    <View style={darkTheme ? styles.darkContainer : styles.container}>
      <StatusBar backgroundColor={darkTheme ? '#121212' : '#593739'} barStyle='light-content' />
      {Platform.OS !== 'ios' && <AppBar 
        title="Applied Jobs"
        color={darkTheme ? '#121212' : '#593739'}
        leading={
          <Ionicons name="arrow-back-outline" size={24} color="white" onPress={() => navigation.goBack()} />
        }
      />}
    {
      loading ? <ActivityIndicator /> :
      error ?
      <View style={{flex: 1}}>
        <Text color={darkTheme ? '#f2f2f2' : '#000'} style={{marginTop: 10, alignSelf: 'center'}}>Error! {error.message}</Text>
      </View> :
      <>
        <ScrollView style={{padding: 10, flex: 1}}>
        { data.userAppliedJobs.length > 0 ? data.userAppliedJobs.map(regJob => (
          <Surface style={styles.card} key={regJob.id}>
            <HStack justify="space-between" items="center" ph={8}>
              <VStack>
                <Text variant="body1" color={darkTheme ? '#f2f2f2' : '#000'} style={styles.cpname}>{regJob.companyName}</Text>
                <Text variant="body1" color={darkTheme ? '#f2f2f2' : '#000'} style={styles.jbtitle}>{regJob.jobTitle}</Text>
              </VStack>
              <View style={styles.imgLogo}>
                <Image source={{uri: regJob.companyLogo}} style={{height: 30, width: 30}} />
              </View>
            </HStack>
            <HStack justify="flex-end" alignItems="center" mt={10}>
              <Button 
                title="View Job"
                onPress={() => navigation.navigate('ViewJob', {job: regJob.id, name: regJob.companyName})}
                variant="text"
                uppercase={false}
                color="#b86f5f"
                tintColor='#fff'
              />
              <Button 
                title="Remove"
                style={{ marginLeft: 10 }}
                uppercase={false}
                color="#b86f5f"
                tintColor='#fff'
                // color={darkTheme ? "#ffcfbc40" : "#b86f5f"}
                // tintColor={darkTheme ? "#ffcfbc" : '#fff'}
              />
            </HStack>
          </Surface>
        )) : 
          <Text color={darkTheme ? '#f2f2f2' : '#000'} style={{alignSelf: 'center'}}>You haven't applied for any jobs</Text>
        }
        </ScrollView>
      </>
    }
    </View>
  )
}

export default AppliedJobsScreen

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
    paddingHorizontal: 8,
    paddingVertical: 16,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#eea85230',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eea85274'
  },
  darkCard: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#232323',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#404040'
  },
  cpname: {
    fontSize: 18,
  },
  jbtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6
  },
})