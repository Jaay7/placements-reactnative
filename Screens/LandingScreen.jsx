import React from 'react'
import { View, StyleSheet, Image } from 'react-native';
import { 
  Text, Button, 
  VStack, 
} from '@react-native-material/core';

const LandingScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoView}>
        <Image source={require('../assets/hire.png')} style={styles.logo} />
      </View>
      <VStack>
        <Text variant="body1" color='#593739'>Welcome to,</Text>
        <Text variant="h4" color='#593739' style={styles.headText}>University </Text>
        <Text variant="h4" color='#593739' style={styles.headText}>Recruitment</Text>
        <Text variant="h4" color='#593739' style={styles.headText}>Portal.</Text>
      </VStack>
      <Button 
        variant="contained" 
        title="Get Started" 
        color="#593739" 
        style={{marginTop: 40, height: 40, justifyContent: 'center'}} 
        uppercase={false}
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  )
}

export default LandingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffcfbc',
    width: '100%',
    justifyContent: 'center',
    padding: 20
  },
  logoView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    alignSelf: 'center',
    marginBottom: 40,
    aspectRatio: 2
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  headText: {
    fontWeight: 'bold',
    lineHeight: 40,
  }
});
