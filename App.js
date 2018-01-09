/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import {
  Platform,
  StyleSheet,
  AsyncStorage,
  Text,
  View
} from 'react-native';
import { DrawerNavigator } from 'react-navigation';

import HomeScreen from './HomeScreen';
import SendSMS from './SendSMS';
import GetToken from './GetToken';
import Coterie from './Coterie';
import Settings from './Settings';
import Logout from './Logout';
import TestLayout from './TestLayout';

// AsyncStorage.setItem('@CoteriesStore:accessToken', '')
// .then( () => {
//   console.log('Cleaned');
// });

const App = DrawerNavigator(
  {
    Home: {
      path: '/',
      screen: HomeScreen,
    },
    Coterie: {
      path: '/coterie',
      screen: Coterie,
    },
    Settings: {
      path: '/settings',
      screen: Settings
    },
    SendSMS: {
      path: '/reg',
      screen: SendSMS
    },
    GetToken: {
      path: '/token',
      screen: GetToken
    },
    Logout: {
      path: '/logout',
      screen: Logout
    }
  },
  {
    initialRouteName: 'Home',
    drawerPosition: 'right',
    drawerBackgroundColor: 'white',
    contentOptions: {
      activeTintColor: '#e91e63',
    },
  }
);

let store = createStore(reducers);

class ReduxApp extends React.Component {

  render() {
    return (<Provider store={store}>
              <App />
            </Provider>);
  };

};

export default ReduxApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
