import React from 'react'
import { StatusBar, StyleSheet, View, Image, ScrollView, Platform } from 'react-native'
import { Text, AppBar, ActivityIndicator, HStack, VStack, Button, Chip, Divider, Surface, FAB } from '@react-native-material/core'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useQuery, gql } from "@apollo/client";

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

const ViewJobScreen = ({navigation, route}) => {
  const { job } = route.params;
  const { data, loading, error } = useQuery(get_job, {
    variables: { id: job }
  });
  return (
    <View style={styles.container}>
    {
      loading ? <ActivityIndicator /> :
      error ? 
      <View style={{flex: 1}}>
        <Text style={{marginTop: Platform.OS === 'ios' ? 60 : 10}}>Error! {error.message}</Text>
      </View> :
      <>
        <StatusBar backgroundColor="#593739" barStyle='light-content' />
        <AppBar 
          title={data.job.companyName}
          color='#593739'
          leading={
            <Ionicons name="arrow-back-outline" size={24} color="white" onPress={() => navigation.goBack()} />
          }
          trailing={
            <MaterialIcons name="bookmark-border" size={24} color="white" />
          }
        />
        <ScrollView>
          <Surface elevation={1} style={styles.card}>
            <HStack justify="space-between" items="center" ph={8}>
              <VStack>
                <Text variant="body1" style={styles.jbtitle}>{data.job.jobTitle}</Text>
              </VStack>
              <View style={styles.imgLogo}>
              <Image source={{uri: data.job.companyLogo}} style={{height: 30, width: 30}} />
            </View>
            </HStack>
            <HStack items="center" wrap='wrap' style={{marginTop: 10}}>
              <MaterialIcons name="place" size={24} color="black" />
              {data.job.jobLocation.split('|').map((item, index) => {
                return <Chip 
                label={item} 
                labelStyle={{ fontSize: 12 }} 
                // variant="outlined" 
                key={index} 
                style={{marginTop: 5, marginLeft: 5}}
              />
              })}
            </HStack>
            <Divider style={{marginTop: 3, marginBottom: 2}} />
            <VStack>
              <Text variant="body1" style={{marginTop: 10, fontWeight: 'bold'}}>Job Description</Text>
              {data.job.jobDescription.split('|').map((item, index) => {
                return <Text variant="body2" color='#464646' key={index} style={{marginTop: 5}}>{item}</Text>
              })}
            </VStack>
            <VStack>
              <Text variant="body1" style={{marginTop: 10, fontWeight: 'bold'}}>Job Requirements</Text>
              {data.job.jobRequirements.split('|').map((item, index) => {
                return <Text variant="body2" color='#464646' key={index} style={{marginTop: 5}}>{item}</Text>
              })}
            </VStack>
            <VStack>
              <Text variant="body1" style={{marginTop: 10, fontWeight: 'bold'}}>Job Qualifications</Text>
              {data.job.jobPrefQualifications.split('|').map((item, index) => {
                return <Text variant="body2" color='#464646' key={index} style={{marginTop: 5}}>{item}</Text>
              })}
            </VStack>
            <VStack>
              <Text variant="body1" style={{marginTop: 10, fontWeight: 'bold'}}>Education</Text>
              {data.job.jobEducation.split('|').map((item, index) => {
                return <Text variant="body2" color='#464646' key={index} style={{marginTop: 5}}>{item}</Text>
              })}
            </VStack>
          </Surface>
        </ScrollView>
        <FAB
          icon={props => <Ionicons {...props} name="add"/>}
          label="Apply Job"
          size='mini'
          variant="extended"
          color="#b86f5f"
          tintColor='#fff'
          style={styles.fab}
        />
      </>
    }
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    padding: 6,
  }
})