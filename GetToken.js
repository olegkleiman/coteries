import React from 'react';
import { connect } from 'react-redux';
import { View,
         Text,
         StyleSheet,
         AsyncStorage,
         ActivityIndicator }
from 'react-native';
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


class GetToken extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      smsCode: '',
      isLoading: false,
      isError: false,
      errorMessage: ''
    };
  };

  _saveTokens = (accessToken, refreshToken) => {

      AsyncStorage.setItem('@CoteriesStore:accessToken', accessToken);
      AsyncStorage.setItem('@CoteriesStore:refreshToken', refreshToken);
      AsyncStorage.setItem('@CoteriesStore:userId', this.props.userId);
  }

  _handleGetToken = () => {

      const smsCode = this.state.smsCode;

      const url ='https://api.tel-aviv.gov.il/auth/api/token';

      this.setState({
          isLoading: true
      });

      const self = this;

      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: smsCode
        })
      })
      .then( (response) => {

          self.setState({
            isLoading: false
          });

          if( !response.ok ) {

            self.setState({
                isError: true,
                errorMessage: response._bodyText
            });
            return;

          }

          let jsonResponse = JSON.parse(response._bodyText);
          if( jsonResponse.hasOwnProperty('error') ) {
            self.setState({
                isError: true,
                errorMessage: jsonResponse.error
            });
            return;
          } else {

            console.log(jsonResponse.access_token);
            console.log(jsonResponse.refresh_token);

            self._saveTokens(jsonResponse.access_token,
                            jsonResponse.refresh_token);
            // .then(res) {
            //   console.log('Tokens were stored');
            // };

            self.props.navigation.navigate('Home');
          }

      })
  }

  render() {

    const errorMessage = this.state.isError ?
                          <Text style={styles.error}>{this.state.errorMessage}</Text> :
                          null;

    const loader =  this.state.isLoading ?
                       <ActivityIndicator size="large" style={styles.loginControl}/> :
                       <Button primary style={styles.loginControl}
                            onPress={this._handleGetToken}>
                          <Text style={styles.loginText}>Send SMS</Text>
                        </Button>;

    return (<Container>
                <View style={styles.appBar}>
                  <Text style={styles.navigationLeft}></Text>
                  <Text style={styles.navigationTitle}>Login. Step 2 of 2</Text>
                  <Ionicons style={styles.navigationRight}
                    onPress={() => this.props.navigation.goBack(null) }
                    name="ios-arrow-round-forward"
                    size={28}/>
                </View>
                <Content>
                  <Form>
                  <Item style={styles.idItem}>
                      <Icon active ios='ios-person' android='person' />
                      <Label>ID</Label>
                      <Text>{this.props.userId}</Text>
                    </Item>
                    <Item floatingLabel>
                      <Icon active ios='ios-send' android='send' />
                      <Label>SMS Code</Label>
                      <Input maxLength={9}
                             multiline = {false}
                             keyboardType={'numeric'}
                             ref = {(el) => { this.smsCode = el; }}
                             onChangeText={(smsCode) => this.setState({smsCode,
                                                                        isError: false,
                                                                        errorMessage: ''})}
                             value={this.state.smsCode}
                       />
                    </Item>
                    <View style={{ flexDirection: 'row'}}>
                      {loader}
                    </View>
                    <View>
                      {errorMessage}
                    </View>

                  </Form>
                </Content>

            </Container>);
  }

};

GetToken.navigationOptions = {
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
  content: {
    flexDirection: 'column',
    alignItems: 'stretch',
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

  loginControl: {
    flex: 1,
    justifyContent: 'center',
    margin: 5
  },
  loginText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'HelveticaNeue-Thin',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Thin',
    flex: 1
  },
  idItem: {
    marginTop: 20
  }
});

function mapStateToProps(state) {
  return {
    userId: state.userId
  };
};

export default connect(mapStateToProps)(GetToken);
