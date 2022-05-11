import React from 'react'
import { Text, ActivityIndicator, TextInput, Surface, HStack, VStack, Chip, Button } from '@react-native-material/core'
import { View, StyleSheet, StatusBar, Image, Platform } from 'react-native';
import { useQuery, gql } from "@apollo/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

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

const get_all_jobs = gql`
  query AllJobs {
    jobs {
      id
      companyName
			companyDescription
			companyLogo
			companyWebsite
			companyEmail
			companyPhone
			companyAddress
			companyCity
			companyState
			jobTitle
			jobDescription
			jobRequirements
			jobSalary
			jobLocation
			jobType
			jobCategory
			jobMinQualifications
			jobPrefQualifications
			jobExperience
			jobEducation
			jobSkills
			jobStartDate
			jobCreatedAt
			jobUpdatedAt
    }
  }
`;

const HomeScreen = ({navigation}) => {
  const [search, setSearch] = React.useState('');
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
  }, [token]);
  
  const { loading, error, data } = useQuery(get_user_data, {
    context: {
      headers: {
        authorization: 'JWT ' + token
      }
    }
  });

  return (
    <View style={darkTheme ? styles.darkContainer : styles.container}>
      <StatusBar backgroundColor={darkTheme ? "#000" : "#fff"} barStyle='dark-content' />
      {loading ? (
        <ActivityIndicator />
      ) :
      error ? (
        <View style={{flex: 1}}>
          <Text color={darkTheme ? '#f2f2f2' : '#000'} style={{marginTop: Platform.OS === 'ios' ? 60 : 10}}>Error! {error.message}</Text>
        </View>
      ) : (
        <View style={styles.box}>
          <Text variant="h6" color={darkTheme ? '#f2f2f2' : '#000'}>Welcome, {data.me.username}!</Text>
          <Text variant="subtitle2" color="gray" style={{marginTop: 5}}>Here goes the available companies which are arrived at our campus.</Text>
          <TextInput 
            style={styles.search}
            dense
            placeholder="Search"
            variant='standard'
            color='#b86f5f'
            inputStyle={{color: darkTheme ? '#f2f2f2' : '#000'}}
            clearButtonMode='always'
            value={search}
            onChangeText={(text) => setSearch(text)}
            leading = {
              <MaterialIcons name="search" size={24} color="gray" />
            }
          />
          <GetJobs navigation={navigation} darkTheme={darkTheme} />
        </View>
      )}
    </View>
  )
}

export default HomeScreen

const GetJobs = ({navigation, darkTheme}) => {
  const { data, loading, error } = useQuery(get_all_jobs);

  return (
    loading ? <ActivityIndicator /> :
    error ? <Text>Oops! Something went wrong.</Text> :
    <View>
      {data.jobs.map(job => (
        <Surface elevation={1} style={styles.card} key={job.id}>
          <HStack justify="space-between" items="center" ph={8}>
            <VStack>
              <Text variant="body1" color={darkTheme ? '#f2f2f2' : '#000'} style={styles.cpname}>{job.companyName}</Text>
              <Text variant="body1" color={darkTheme ? '#f2f2f2' : '#000'} style={styles.jbtitle}>{job.jobTitle}</Text>
            </VStack>
            <View style={styles.imgLogo}>
              <Image source={{uri: job.companyLogo}} style={{height: 30, width: 30}} />
            </View>
          </HStack>
          <HStack items="center" wrap='wrap' style={{marginTop: 10}}>
            <MaterialIcons name="place" size={24}  color={darkTheme ? '#f2f2f2' : '#000'} />
            <Text variant="subtitle2" color={darkTheme ? '#f2f2f2' : '#000'} style={styles.location}>+{job.jobLocation.split('|').length}</Text>
            {job.jobLocation.split('|').sort().slice(0, 3).map((item, index) => {
              return <Chip 
                label={item} 
                labelStyle={{ fontSize: 12, color: darkTheme ? '#f2f2f2' : '#000' }} 
                // variant={darkTheme ? "outlined" : "filled"} 
                contentContainerStyle={{ margin: 0, backgroundColor: darkTheme ? '#614421' : '#eea85230' }}
                key={index} 
                style={{marginTop: 5, marginLeft: 5}}
              />
            })}
          </HStack>
          <HStack justify="space-between" items="center" ph={8} style={{marginTop: 6}}>
            <MaterialIcons name="bookmark-border" size={24} color={darkTheme ? '#f2f2f2' : '#000'} />
            <Button 
              title="View Job"
              uppercase={false}
              variant="contained"
              color="#b86f5f"
              tintColor='#fff'
              onPress={() => navigation.navigate('ViewJob', {job: job.id, name: job.companyName})}
            />
          </HStack>
        </Surface>
      ))}
    </View>
  )
}

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
  box: {
    flex: 1,
    padding: 20,
    marginTop: Platform.OS === 'ios' ? 40 : 0
  },
  imgLogo: {
    width: 100,
    height: 50,
    borderRadius: 100,
    resizeMode: 'cover',
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
    marginTop: 20,
  },
  cpname: {
    fontSize: 18,
  },
  jbtitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})