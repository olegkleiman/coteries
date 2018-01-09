import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';
import { AsyncStorage } from 'react-native';

async function fetchQuery(operation, variables = {}) {

  let jwt = await AsyncStorage.getItem('@CoteriesStore:accessToken');

  return fetch('https://tlvgraphql.azurewebsites.net/graphql', {
    method: 'POST',
    headers: {
       'Accept':'application/json',
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json();
  }).catch( (error) => {
    return error;
  });

}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
})

export default environment;
