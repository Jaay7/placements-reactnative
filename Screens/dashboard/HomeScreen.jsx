import React from 'react'
import { Text, ActivityIndicator, TextInput, Surface, HStack, VStack, Chip, Button } from '@react-native-material/core'
import { View, StyleSheet, StatusBar, Image } from 'react-native';
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

const HomeScreen = () => {
  const [search, setSearch] = React.useState('');
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
        <View style={styles.box}>
          <Text variant="h6">Welcome, {data.me.username}!</Text>
          <Text variant="subtitle2" color="gray" style={{marginTop: 5}}>Here goes the available companies which are arrived at our campus.</Text>
          <TextInput 
            style={styles.search}
            dense
            placeholder="Search"
            variant='standard'
            color='#b86f5f'
            clearButtonMode='always'
            value={search}
            onChangeText={(text) => setSearch(text)}
            leading = {
              <MaterialIcons name="search" size={24} color="gray" />
            }
          />
          <GetJobs />
        </View>
      )}
    </View>
  )
}

export default HomeScreen

const GetJobs = () => {
  const { data, loading, error } = useQuery(get_all_jobs);

  return (
    loading ? <ActivityIndicator /> :
    error ? <Text>Oops! Something went wrong.</Text> :
    <View>
      {data.jobs.map(job => (
        <Surface elevation={2} style={styles.card} key={job.id}>
          <HStack justify="space-between" items="center" ph={8}>
            <VStack>
              <Text style={styles.cpname}>{job.companyName}</Text>
              <Text style={styles.jbtitle}>{job.jobTitle}</Text>
            </VStack>
            <View style={styles.imgLogo}>
              <Image source={{uri: job.companyLogo}} style={{height: 30, width: 30}} />
            </View>
          </HStack>
          <HStack items="center" wrap='wrap' style={{marginTop: 10}}>
            <MaterialIcons name="place" size={24} color="black" />
            <Text style={styles.location}>+{job.jobLocation.split('|').length}</Text>
            {job.jobLocation.split('|').sort().slice(0, 3).map((item, index) => {
              return <Chip label={item} variant="outlined" key={index}  style={{marginTop: 5, marginLeft: 5}} />
            })}
          </HStack>
          <HStack justify="space-between" items="center" ph={8} style={{marginTop: 6}}>
            <MaterialIcons name="bookmark-border" size={24} color="black" />
            <Button 
              title="View Job"
              uppercase={false}
              variant="contained"
              color="#b86f5f"
              tintColor='#fff'
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
  box: {
    flex: 1,
    padding: 20,
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