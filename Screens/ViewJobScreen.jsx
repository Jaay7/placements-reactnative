import React from 'react'
import { StatusBar, StyleSheet, View, Image, ScrollView, Platform, RefreshControl } from 'react-native'
import { Text, AppBar, ActivityIndicator, HStack, VStack, Button, Chip, Divider } from '@react-native-material/core'
import { Snackbar } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useQuery, gql, useMutation } from "@apollo/client";
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const get_job = gql`
  query Job($id: ID!) {
    job(id: $id) {
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

const get_saved_jobs = gql`
  query UserSavedJobs {
    userSavedJobs {
      id
      jobTitle
      companyName
      companyLogo
      jobLocation
    }
  }
`;

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

const apply_job = gql`
  mutation ApplyJob($jobId: ID!) {
    applyJob(jobId: $jobId) {
      response
    }
  }
`;

const save_job = gql`
  mutation SaveJob($jobId: ID!) {
    saveJob(jobId: $jobId) {
      response
    }
  }
`;

const remove_saved_job = gql`
  mutation RemoveSavedJob($jobId: ID!) {
    removeSavedJob(jobId: $jobId) {
      response
    }
  }
`;

const ViewJobScreen = ({navigation, route}) => {
  const { job } = route.params;
  const [darkTheme, setDarkTheme] = React.useState(false);
  const [token, setToken] = React.useState('');
  const isFocused = useIsFocused();
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState('');

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

  const { data, loading, error } = useQuery(get_job, {
    variables: { id: job }
  });

  const { data: savedJobsData, loading: loading2, error: error2 } = useQuery(get_saved_jobs, {
    context: {
      headers: {
        authorization: 'JWT ' + token
      },
    },
    pollInterval: 1000
  })

  const { data: appliedJobsData, loading: loading3, error: error3 } = useQuery(get_applied_jobs, {
    context: {
      headers: {
        authorization: 'JWT ' + token
      },
    },
    pollInterval: 500
  })

  const [applyJob] = useMutation(apply_job, {
    context: {
      headers: {
        authorization: 'JWT ' + token
      }
    },
    variables: { jobId: job },
    onCompleted: (data) => {
      setOpenSnackBar(true);
      setSnackBarMessage(data.applyJob.response);
    },
    onError: (error) => {
      setOpenSnackBar(true);
      setSnackBarMessage(error.message);
    }
  });

  const [saveJob] = useMutation(save_job, {
    context: {
      headers: {
        authorization: 'JWT ' + token
      }
    },
    variables: { jobId: job },
    onCompleted: (data) => {
      setOpenSnackBar(true);
      setSnackBarMessage(data.saveJob.response);
    },
    onError: (error) => {
      setOpenSnackBar(true);
      setSnackBarMessage(error.message);
    }
  })

  const [removeSavedJob] = useMutation(remove_saved_job, {
    context: {
      headers: {
        authorization: 'JWT ' + token
      }
    },
    variables: { jobId: job },
    onCompleted: (data) => {
      setOpenSnackBar(true);
      setSnackBarMessage(data.removeSavedJob.response);
    },
    onError: (error) => {
      setOpenSnackBar(true);
      setSnackBarMessage(error.message);
    }
  })

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        loading2 ? <ActivityIndicator /> :
        error2 ? <Text>Failed</Text> :
        loading ? <ActivityIndicator /> :
        error ? <Text>Failed</Text> :
        savedJobsData.userSavedJobs.map(savedJob => savedJob.id).includes(data.job.id) ?
        <MaterialIcons name="bookmark" size={24} onPress={() => removeSavedJob()} color={darkTheme ? '#f2f2f2' : '#000'} /> :
        <MaterialIcons name="bookmark-border" onPress={() => saveJob()} size={24} color={darkTheme ? '#f2f2f2' : '#000'} />
      ),
      headerStyle: {
        backgroundColor: darkTheme ? 'black' : 'white',
      },
      headerTitleStyle: {
        color: darkTheme ? 'white' : 'black',
      }
    })
  })

  return (
    <View style={darkTheme ? styles.darkContainer : styles.container}>
    {
      loading ? <ActivityIndicator /> :
      error ? 
      <View style={{flex: 1}}>
        <Text color={darkTheme ? '#f2f2f2' : '#000'} style={{marginTop: 10, alignSelf: 'center'}}>Error! {error.message}</Text>
      </View> :
      <>
        <StatusBar backgroundColor={darkTheme ? '#121212' : '#593739'} barStyle='light-content' />
        {Platform.OS !== 'ios' && <AppBar 
          title={data.job.companyName}
          color={darkTheme ? '#121212' : '#593739'}
          leading={
            <Ionicons name="arrow-back-outline" size={24} color="white" onPress={() => navigation.goBack()} />
          }
          trailing={
            loading2 ? <ActivityIndicator /> :
            error2 ? <Typography>Failed</Typography> :
            savedJobsData.userSavedJobs.map(savedJob => savedJob.id).includes(data.job.id) ?
            <MaterialIcons name="bookmark" onPress={() => removeSavedJob()} size={24} color="white" /> :
            <MaterialIcons name="bookmark-border" onPress={() => saveJob()} size={24} color="white" />
          }
        />}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={data.refetch}
            />
          }
        >
          <View style={styles.card}>
            <HStack justify="space-between" items="center" ph={8}>
              <VStack>
                <Text color={darkTheme ? '#f2f2f2' : '#000'} variant="body1" style={styles.jbtitle}>{data.job.jobTitle}</Text>
              </VStack>
              <View style={styles.imgLogo}>
              <Image source={{uri: data.job.companyLogo}} style={{height: 30, width: 30}} />
            </View>
            </HStack>
            <HStack items="center" wrap='wrap' style={{marginTop: 10}}>
              <MaterialIcons name="place" size={24} color={darkTheme ? '#f2f2f2' : '#000'} />
              {data.job.jobLocation.split('|').map((item, index) => {
                return <Chip 
                label={item} 
                labelStyle={{ fontSize: 12, color: darkTheme ? '#f2f2f2' : '#000' }} 
                // variant="outlined" 
                contentContainerStyle={{ margin: 0, backgroundColor: darkTheme ? '#614421' : '#eea85230' }}
                key={index} 
                style={{marginTop: 5, marginLeft: 5}}
              />
              })}
            </HStack>
            {
              loading3 ? <ActivityIndicator /> :
              error3 ? <Text>Failed</Text> :
              appliedJobsData.userAppliedJobs.map(appliedJob => appliedJob.id).includes(data.job.id) ?
              <Text variant="body2" color={darkTheme ? '#f2f2f2' : '#000'} style={{alignSelf: 'center', marginVertical: 5}}>You have Applied for this Job. <Text onPress={() => navigation.navigate('Applied Jobs')} color={darkTheme ? '#ffcfbc' : '#b86f5f'}>View all</Text></Text> :
              <Button 
              title="Apply Job"
              uppercase={false}
              variant="contained"
              color="#b86f5f"
              tintColor='#fff'
              style={{marginVertical: 10}}
              leading={(props) => <Ionicons name="add" {...props} />}
              onPress={() => applyJob()}
            />}
            <Divider style={{marginTop: 3, marginBottom: 2}} />
            <VStack>
              <Text color={darkTheme ? '#e2e2e2' : '#323232'} variant="body1" style={{marginTop: 10, fontWeight: 'bold'}}>Job Description</Text>
              {data.job.jobDescription.split('|').map((item, index) => {
                return <Text variant="body2" color='gray' key={index} style={{marginTop: 5}}>{item}</Text>
              })}
            </VStack>
            <VStack>
              <Text color={darkTheme ? '#e2e2e2' : '#323232'} variant="body1" style={{marginTop: 10, fontWeight: 'bold'}}>Job Requirements</Text>
              {data.job.jobRequirements.split('|').map((item, index) => {
                return <Text variant="body2" color='gray' key={index} style={{marginTop: 5}}>{item}</Text>
              })}
            </VStack>
            <VStack>
              <Text color={darkTheme ? '#e2e2e2' : '#323232'} variant="body1" style={{marginTop: 10, fontWeight: 'bold'}}>Job Qualifications</Text>
              {data.job.jobPrefQualifications.split('|').map((item, index) => {
                return <Text variant="body2" color='gray' key={index} style={{marginTop: 5}}>{item}</Text>
              })}
            </VStack>
            <VStack>
              <Text color={darkTheme ? '#e2e2e2' : '#323232'} variant="body1" style={{marginTop: 10, fontWeight: 'bold'}}>Education</Text>
              {data.job.jobEducation.split('|').map((item, index) => {
                return <Text variant="body2" color='gray' key={index} style={{marginTop: 5}}>{item}</Text>
              })}
            </VStack>
          </View>
        </ScrollView>
      </>
    }
    <Snackbar 
      visible={openSnackBar}
      onDismiss={() => setOpenSnackBar(false)}
      action={{
        label: 'Dismiss',
        onPress: () => setOpenSnackBar(false)
      }}
      style={styles.snackbar}
      duration={3000}
    >
      {snackBarMessage}
    </Snackbar>
    </View>
  )
}

export default ViewJobScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: StatusBar.currentHeight,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: StatusBar.currentHeight
  },
  imgLogo: {
    width: 100,
    height: 50,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  card: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 80,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 8,
  },
  jbtitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  snackbar: { 
    position: "absolute", 
    start: 16, 
    end: 16,
    bottom: 16 
  }
})