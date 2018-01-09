import React from 'react';
import PropTypes from 'prop-types';
import { View,
         TouchableOpacity,
         ScrollView,
         Image,
         Dimensions,
         Platform,
         ActivityIndicator,
         PermissionsAndroid,
         StyleSheet } from 'react-native';

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

import MapView, { MAP_TYPES } from 'react-native-maps';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import placeMarker from './assets/images/air/placeMarker64.png';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class TestLayout extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
        cache: true,
        loading: false,
        progress: 0,
        error: false,
        fabActive: 'true'
    };
  }

  render() {

    let loader = this.state.loading ?
      <View style={[styles.progress, {alignSelf: 'center'}]}>
        <Text>{this.state.progress}%</Text>
        <ActivityIndicator size="large" style={{marginLeft:5}}/>
      </View> : null;

    let image = this.state.error ?
      <Text>{this.state.error}</Text> :
      <Image source={{uri: 'https://happyintlv.net/imagecache/c_crop,h_400,w_1000/wp-content/uploads/2016/05/Grande-article-price.png'}}
              style={{height: 100, width: width-30, flex: 1}}
              onLoadStart={(e) => this.setState({loading: true})}
              onLoad={ () => this.setState({loading: false})}
              onError={(e) => this.setState({error: e.nativeEvent.error, loading: false})}
              onProgress={(e) => this.setState({progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total)})}
      />

    let name = this.props.navigation.state.params.item.name;

    return (<View style={styles.container}>
              <View style={styles.appBar}>
                <Text style={styles.navigationLeft}></Text>
                <Text style={styles.navigationTitle}>{name}</Text>
                <Ionicons style={styles.navigationRight}
                  onPress={() => this.props.navigation.goBack(null) }
                  name="ios-arrow-round-forward"
                  size={28}
                />
              </View>
              <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    /*provider="google"*/
                    cacheEnabled={this.state.cache}
                    zoomEnabled
                    scrollingEnabled
                    loadingIndicatorColor="#666666"
                    loadingBackgroundColor="#eeeeee"
                    onMapReady={ () => console.log('Map is ready')}
                    initialRegion={{
                      latitude: 32.111767,
                      longitude: 34.801361,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA,
                    }}>
                      <MapView.Marker coordinate={{latitude:32.111767,
                                                   longitude: 34.801361}}
                                      title={'title'}
                                      description={'This is a description'}
                                      image={placeMarker}>
                          <MapView.Callout style={styles.calloutPlainView}
                            tooltip>
                            <View>
                              <Text>Address here</Text>
                            </View>
                          </MapView.Callout>
                      </MapView.Marker>
                  </MapView>
                </View>
                <View style={styles.form}>
                  <Content>
                    <Card>
                      <CardItem header>
                        <Text>Name</Text>
                      </CardItem>
                      <CardItem cardBody
                                style={{ flexDirection: 'column',
                                         justifyContent: 'space-around'}}>
                        {loader}
                        {image}
                      </CardItem>
                      <CardItem>
                        <Body>
                          <View style={styles.caption}>
                            <Image
                                 style={{width: 50, height: 50}}
                                 source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
                               />
                            <Text style={{marginLeft: 20}}>Description</Text>
                          </View>
                        </Body>
                      </CardItem>
                      <CardItem footer>
                        <Text note>Published by XXX</Text>
                      </CardItem>
                    </Card>
                  </Content>
                  <View>
                    <Fab
                         direction="down"
                         position="bottomRight"
                         containerStyle={{ }}
                         onPress={() => this.setState({ active: !this.state.active })}>
                      <Icon name="share" />
                      <Button style={{ backgroundColor: '#34A34F' }}>
                        <Icon name="logo-whatsapp" />
                      </Button>
                      <Button style={{ backgroundColor: '#3B5998' }}>
                        <Icon name="logo-facebook" />
                      </Button>
                      <Button disabled style={{ backgroundColor: '#DD5144' }}>
                        <Icon name="mail" />
                      </Button>
                    </Fab>
                  </View>
                </View>
              </ScrollView>
            </View>
      );
  };

};

TestLayout.navigationOptions = {
  drawerLabel: 'Coterie',
  drawerIcon: ({ tintColor }) => (
    <FeatherIcons name="info" size={24} style={{ color: tintColor }} />
  ),
};

TestLayout.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  container : {
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

  mapContainer: {
    height: 200,
    backgroundColor: 'green',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'center'
  },
  calloutPlainView: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  form: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  caption: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  formButton: {
    alignSelf: 'center'
  },
  progress: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default TestLayout;
