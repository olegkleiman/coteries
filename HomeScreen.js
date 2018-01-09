import React from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  Platform,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import { Container,
        Header,
        Content,
        Card,
        CardItem,
        Body,
        Button,
        Text,
        Fab,
        Icon }
from 'native-base';

import jwt_decode from 'jwt-decode';
import moment from 'moment';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 120;// Platform.OS === 'ios' ? 60 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      fadeAnim: new Animated.Value(0),
    };

    this.mockData = [
      { id:1,
        name: 'Um',
        image: require('./assets/images/urban.png')
      },
      { id:2,
        name: 'Dois!',
        image: require('./assets/images/urban.png')
      },
      { id:3,
        name:'Três',
        image: require('./assets/images/urban.png')
      },
      { id:4,
        name:'Quatro',
        image: require('./assets/images/urban.png')
      },
      { id:5,
        name: 'Cinco',
        image: require('./assets/images/urban.png')
      },
      { id:6,
        name: 'Seis',
        image: require('./assets/images/urban.png')
      },
      { id:7,
        name: 'Sete',
        image: require('./assets/images/urban.png')
      },
      { id:8,
        name: 'Oito',
        image: require('./assets/images/urban.png')
      },
      { id:9,
        name: 'Nove',
        image: require('./assets/images/urban.png')
      },
      { id:10,
        name: 'Dez',
        image: require('./assets/images/urban.png')
      }];
  }

  _handleCardPressed = (_item) => {
    this.props.navigation.navigate('Coterie', {item: _item})
  }

  _validateToken = (jwt) => {
    var decoded = jwt_decode(jwt);
    console.log(decoded);

    const exp = moment.unix(decoded.exp);
    const now = moment({
      hour: 0,
      minute: 0,
      seconds: 0,
      milliseconds: 0
    });

    return now.isBefore(exp);
  }

  _saveTokens = (accessToken, refreshToken) => {

      AsyncStorage.setItem('@CoteriesStore:accessToken', accessToken);
      AsyncStorage.setItem('@CoteriesStore:refreshToken', refreshToken);
      AsyncStorage.setItem('@CoteriesStore:userId', this.props.userId);
  }

  componentDidMount() {

    const self = this;

    const p1 = AsyncStorage.getItem('@CoteriesStore:accessToken');
    const p2 = AsyncStorage.getItem('@CoteriesStore:userId');
    const p3 = AsyncStorage.getItem('@CoteriesStore:refreshToken');
    Promise.all([p1, p2, p3])
    .then( values => {

        let accessToken = values[0];
        const userId = values[1];
        let refreshToken = values[2];

        if( !userId || !accessToken ) {
          self.props.navigation.navigate('SendSMS');
          return;
        }

        let url = 'https://api.tel-aviv.gov.il/auth/api/refresh?token=' + refreshToken;
        if( !this._validateToken(accessToken) ) {
           fetch(url)
           .then( (response) => {
              let jsonResponse = JSON.parse(response._bodyText);
              accessToken = jsonResponse.access_token;
              self._saveTokens(jsonResponse.access_token,
                              jsonResponse.refresh_token);

              console.log(response);
           });
        };

        url ='https://api.tel-aviv.gov.il/crm/customer/' + userId;
        fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': 'bearer ' + accessToken,
            'Accept': 'application/json',
          },
        })
        .then( (response) => {
            if( response.ok ) {
              const respJSON = JSON.parse(response._bodyText);
              console.log(respJSON);
            } else {
              console.log('failure');
            }
        }).catch( (e) => {
          console.log(e);
        });

    });

  }

  render() {

    const headerHeight = this.state.scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
      });

    const headerTranslate = this.state.scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -HEADER_SCROLL_DISTANCE],
        extrapolate: 'clamp',
      });

    const titleScale = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0.8],
      extrapolate: 'clamp',
    });

    const titleTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, -8],
      extrapolate: 'clamp',
    });

    return (<View style={styles.base}>

                <View style={styles.appBar}>
                    <Text style={styles.navigationLeft}></Text>
                    <Text style={styles.navigationTitle}>ראשי</Text>
                    <MaterialIcons style={styles.navigationRight}
                      name="menu"
                      onPress={() => this.props.navigation.navigate('DrawerOpen')}
                      size={28}
                    />

                </View>

                <Animated.View style={[styles.bar,
                                       { height: headerHeight }]}>
                    <Text style={styles.title}>תוכן העמוד</Text>
                </Animated.View>

                <Animated.ScrollView style={[styles._scrollViewContent]}
                      scrollEventThrottle={16}
                      onScroll={Animated.event(
                        [
                          {
                            nativeEvent: {
                                            contentOffset:
                                              {
                                                y: this.state.scrollY
                                              }
                                          }
                          }
                        ],
                        //{ useNativeDriver: true },
                      )}>
                      <Content>
                      {
                          this.mockData.map( (item, index) => {

                              return <Card key={index}>
                                 <TouchableOpacity style = {styles.row}
                                      onPress={() => this._handleCardPressed(item)}>
                                    <Image source={item.image}
                                          style={{height: 48, width: 48}}/>

                                    <Text style={{fontFamily: 'HelveticaNeue-Thin'}}>Card {item.id}</Text>
                                 </TouchableOpacity>
                             </Card>
                          })
                      }
                      </Content>
                </Animated.ScrollView>

            </View>);

  }

};

HomeScreen.navigationOptions = {
  drawerLabel: 'ראשי',
  drawerIcon: ({ tintColor }) => (
    <MaterialIcons
      name="home"
      size={24}
      style={{ color: tintColor }}
    />
  ),
};

const styles = StyleSheet.create({
  base: {
    flex:1,
  },
  container : {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    marginTop: '8%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'blue',
    height: 40,
    marginTop: Platform.OS === 'ios' ? 26 : 0,
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

  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  row: {
    flexDirection: 'row',
    height: 40,
    margin: 16,
    //backgroundColor: '#D3D3D3',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     padding: 30,
     margin: 2,
     borderColor: '#2a4944',
     borderWidth: 1,
     backgroundColor: '#d2f7f1'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#03A9F4',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },
  title: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Thin'
  },
  bar: {
   //backgroundColor: '#03A9F4',
   backgroundColor: '#2c8ef4',
   marginTop: 0,
   alignItems: 'center',
   justifyContent: 'center',
   top: 0,
   left: 0,
   right: 0,
  },
});

function mapStateToProps(state) {
  return {
    userId: state.userId
  };
};

export default connect(mapStateToProps)(HomeScreen);
