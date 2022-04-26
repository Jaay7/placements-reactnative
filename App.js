import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Main from './Main';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://54.86.111.224:8000/graphql/',
  cache: new InMemoryCache()
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={{flex: 1}}>
        <Main />
        <StatusBar style="auto" />
      </View>
    </ApolloProvider>
  );
}