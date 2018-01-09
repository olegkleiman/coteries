import React from 'react';
import { View,
          Text,
          StyleSheet,
          ActivityIndicator,
          TextInput} from 'react-native';
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

class SendSMS extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      phoneNum: '',
      isUserValidationError: false,
      isPhoneValidationError: false,
      isError: false,
      errorMessage: '',
      isLoading: false
    };
  }

  _validateUserId = () => {

    const useId = this.state.userId;

    let len = useId.length;
    const userValid = len == 9;
    this.setState({
      isUserValidationError: !userValid
    });
    return userValid;
  }

  _validatePhoneNumber = () => {

    const phoneNumber = this.state.phoneNum;
    let len = phoneNumber.length;
    const phomeNumberValid = len == 10;
    this.setState({
      isPhoneValidationError: !phomeNumberValid
    });

    return phomeNumberValid;
  }

  _handleLogin = () => {

    const useId = this.state.userId;
    const phoneNum = this.state.phoneNum;

    if( !this._validateUserId() || !this._validatePhoneNumber() )
      return;

    len = phoneNum.length;

    const url = 'https://api.tel-aviv.gov.il/auth/api/otp?id=' + userId + '&phoneNum=' + phoneNum;

    const self = this;
    self.setState({
        isLoading: true
    });

    fetch(url)
      .then(function(response) {

        self.setState({
            isLoading: false
        })

        if( !response.ok ) {

          self.setState({
              isError: true,
              errorMessage: response._bodyText
            });
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
                            onPress={this._handleLogin}>
                          <Text style={styles.loginText}>Send SMS</Text>
                        </Button>;

    const iconUser = this.state.isUserValidationError ?
          <Icon name='close-circle' style={{fontSize: 20, color: 'red'}} /> :
          <Icon active ios='ios-person' android='person' />;
    const phoneIcon = this.state.isPhoneValidationError ?
          <Icon name='close-circle' style={{fontSize: 20, color: 'red'}} /> :
          <Icon active ios='ios-phone-portrait' android='md-phone-portrait' />;

    return (<Container>
              <View style={styles.appBar}>
                <Text style={styles.navigationLeft}></Text>
                <Text style={styles.navigationTitle}>Login</Text>
                <Ionicons style={styles.navigationRight}
                  onPress={() => this.props.navigation.goBack(null) }
                  name="ios-arrow-round-forward"
                  size={28}
                />
              </View>
              <Content>
                <Form>
                <Item floatingLabel>
                    {iconUser}
                    <Label>ID</Label>
                    <Input maxLength={9}
                          multiline = {false}
                          keyboardType={'numeric'}
                          ref = {(el) => { this.userId = el; }}
                          onChangeText={(userId) => this.setState({userId})}
                          value={this.state.userId}
                          onEndEditing={ () => console.log('ends') }/>
                  </Item>
                  <Item floatingLabel>
                     {phoneIcon}
                     <Label>Phone Number</Label>
                     <Input maxLength={10}
                            multiline = {false}
                            keyboardType={'phone-pad'}
                            ref = {(el) => { this.phoneNum = el; }}
                            onChangeText={(phoneNum) => this.setState({phoneNum})}
                            value={this.state.phoneNum}
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

SendSMS.navigationOptions = {
  drawerLabel: 'Login',
  drawerIcon: ({ tintColor }) => (
    <FeatherIcons name="log-in" size={24} style={{ color: tintColor }} />
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
  }
});

export default SendSMS;
