import React from 'react'
import { StyleSheet, ScrollView } from 'react-native';
import { 
  Text, Button, 
  VStack, 
  TextInput,
  Box,
} from '@react-native-material/core';
import { useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const login_user = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

  const checkFields = () => {
    if(username.length > 0 && password.length > 0){
      return true;
    }
    return false;
  }

  const [login, { loading }] = useMutation(login_user, {
    variables: {
      username,
      password,
    },
    onCompleted: data => {
      console.log(data.login.token);
      AsyncStorage.setItem('token', data.login.token);
      // navigation.navigate('Dashboard');
    },
    onError: error => {
      console.log(error);
      setErrorMsg(error.message);
    }
  });
  
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}>
      <Box style={styles.objectItem}>
        <Box style={[styles.objectItem, {marginLeft: 30, backgroundColor: '#ffcfbc'}]} />
      </Box>
      <VStack mv={25}>
        <Text variant="h5" color='#2e1113' style={styles.headText}>Login</Text>
        <Text variant="subtitle2" color='#2e1113'>Please enter your credentials.</Text>
        <Text variant='body1' color='error' style={{marginTop: 15, alignSelf: 'center'}}>{errorMsg}</Text>
      </VStack>
      <TextInput
        label="Username"
        variant="outlined"
        value={username}
        color="#2e1113"
        onChangeText={(text) => setUsername(text)}
        style={{marginBottom: 10}}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        variant="outlined"
        value={password}
        color="#2e1113"
        onChangeText={(text) => setPassword(text)}
        style={{marginBottom: 10}}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <Text variant="body2" color='#2e1113' style={{alignSelf: 'flex-end'}}>Forgot Password?</Text>
      <Button
        disabled={checkFields() ? false : true}
        onPress={() => login()}
        variant="contained"
        title="Login"
        color="#b86f5f"
        tintColor='#fff'
        style={{marginTop: 10, marginBottom: 40, height: 40, justifyContent: 'center'}}
        uppercase={false}
        loading={loading}
        oadingIndicatorPosition="trailing"
      />
    </ScrollView>
  )
}

export default LoginScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    padding: 30
  },
  objectItem: {
    width: 80,
    height: 150,
    backgroundColor: '#ed9e8c',
    borderRadius: 100,
    marginVertical: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    alignSelf: 'center'
  },
  headText: {
    fontWeight: 'bold',
    lineHeight: 40,
  }
});