// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  Platform,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  Text,
  View
} from 'react-native';
import { QueryRenderer, graphql } from 'react-relay';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';

import environment from './Environment';

const customerQuery = graphql`
  query SettingsQuery($id: String!) {
    customer(id: $id) {
      lastName
      firstName
    }
  }
`;

var userId = { "id": "313069486" };

class Settings extends React.Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      vars: ''
    }
  }

  async componentDidMount() {
    let userId = await AsyncStorage.getItem('@CoteriesStore:userId');
    this.setState({
        vars: {
          id: userId
        }
    });
  }

  renderCustomerProfile = ({error, props, retry}) => {
    if (error) {
      return <Text>{error.message}</Text>;
    } else if (props) {
      return (<View>
                <Text>{props.customer.firstName}</Text>
                <Text>{props.customer.lastName}</Text>
              </View>);
    }

    return <ActivityIndicator />;
  }


  render() {

    let userControl = ( this.state.vars ) ?
                        <QueryRenderer
                                    environment={environment}
                                    query={customerQuery}
                                    variables={this.state.vars}
                                    render={this.renderCustomerProfile}
                                  /> :
                        null;
    return (
      <View style={styles.container}>

          <View style={styles.appBar}>
                <Text style={styles.navigationLeft}></Text>
                <Text style={styles.navigationTitle}>הגדרות</Text>
                <MaterialIcons style={styles.navigationRight}
                  name="menu"
                  onPress={() => this.props.navigation.navigate('DrawerOpen')}
                  size={28}
                />
          </View>

          {userControl}

      </View>
    );
  }

};
Settings.navigationOptions = {
  drawerLabel: 'הגדרות',
  drawerIcon: ({ tintColor }) => (
    <FeatherIcons name="settings" size={24} style={{ color: tintColor }} />
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
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
});

function mapStateToProps(state) {
  return {
    userId: state.userId
  };
};

export default connect(mapStateToProps)(Settings);
