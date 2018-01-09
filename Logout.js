import React from 'react';
import { View,
         Text,
         StyleSheet,
         AsyncStorage } from 'react-native';
import { Container,
         Header,
         Content,
         Form,
         Item,
         Input,
         Button,
         Icon,
         Label }
from 'native-base';

import FeatherIcons from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

class Logout extends React.Component {

  _handleLogout = () => {
    AsyncStorage.setItem('@CoteriesStore:accessToken', '');
    AsyncStorage.setItem('@CoteriesStore:refreshToken', '');
    AsyncStorage.setItem('@CoteriesStore:userId', '');

    this.props.navigation.navigate('Home');
  }

  render() {
    return (<Container>
              <View style={styles.appBar}>
                <Text style={styles.navigationLeft}></Text>
                <Text style={styles.navigationTitle}>Logout</Text>
                <Ionicons style={styles.navigationRight}
                  onPress={() => this.props.navigation.goBack(null) }
                  name="ios-arrow-round-forward"
                  size={28}/>
              </View>
              <View style={styles.logoutContainer}>
                <Button style={styles.loginControl} onPress={this._handleLogout}>
                  <Text>Logout</Text>
                </Button>
              </View>
            </Container>);
  }

};

Logout.navigationOptions = {
  drawerLabel: 'Logout',
  drawerIcon: ({ tintColor }) => (
    <FeatherIcons name="log-out" size={24} style={{ color: tintColor }} />
  ),
};


const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    marginTop: '8%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'blue',
    height: 40
  },

  navigationLeft: {
    flex: 1
  },
  navigationTitle: {
    flex: 8,
    fontSize: 20,
    fontFamily: 'HelveticaNeue-Thin',
    textAlign: 'center',
    color: 'white'
  },
  navigationRight: {
    flex: 1,
    color: 'white'
  },

  logoutContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  loginControl: {
    flex: 1,
    justifyContent: 'center',
    margin: 5
  },
});

export default Logout;
