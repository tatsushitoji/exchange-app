import * as React from 'react';
import { AppLoading } from 'expo';
import {
  Container,
  Header,
  Content,
  Input,
  Label,
  Icon,
  Button,
  Text,
  List,
  ListItem,
  Card, CardItem, Body, Spinner,
} from 'native-base';
import { StyleSheet, View, Keyboard } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { OXR_APP_ID } from 'react-native-dotenv';

class ButtonScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isReady: false, isLoading: false, base: '', result: null };
  }

  async loadRequiredFonts() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    return Promise.resolve();
  }

  getExchangeRates(navigate) {
    this.setState({ isLoading: true });
    fetch(`https://openexchangerates.org/api/latest.json?app_id=${OXR_APP_ID}&base=USD`)
      .then((response) => response.json())
      .then((responseJson) => {
        // const result = Math.round(responseJson.rates.JPY * this.state.jpy);
        this.setState({ result: responseJson.rates });
        console.log(this.state.result);
        this.setState({ isLoading: false });
        navigate('List', {
          result: this.state.result
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.loadRequiredFonts}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
    return (
      <Container style={styles.container}>
        <Card style={styles.card}>
          <CardItem style={styles.cardItem}>
            <Body style={styles.cardItemBody}>
              <View style={styles.cardItemBodyView}>
                <Text note>Sorry, Base Amount is 1 USD only...</Text>
              </View>
              { this.state.isLoading ?
                <View style={styles.loadingView}>
                  <Spinner color='gray' />
                </ View>
              :
                <Button
                  onPress={() => {
                    this.getExchangeRates(navigate);
                  }}
                  block
                  style={styles.submitButton}
                >
                  <Text>GET Current Exchange Rates</Text>
                </Button>
              }
            </Body>
          </CardItem>
        </Card>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#263238',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 160,
    paddingBottom: 160,
    paddingRight: 40,
    paddingLeft: 40,
  },
  card: {
    flex: 1,
    width: '100%',
  },
  cardItem: {
    flex: 1,
    width: '100%',
  },
  cardItemBody: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardItemBodyView: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    width: '100%',
  },
});


const ListScreen = ({ navigation }) => {console.log(navigation); return(
  <Container>
    <Content>
      <List>
        {Object.keys(navigation.state.params.result).map((key, index) => (
          <ListItem key={index}>
            <Text>[ {key} ]  {navigation.state.params.result[key]}</Text>
          </ListItem>
        ))}
      </List>
    </Content>
  </Container>
)};

export default StackNavigator({
  Button: { screen: ButtonScreen },
  List: { 
    screen: ListScreen,
    navigationOptions: {
      headerTitle: 'Country List',
    }
  },
}, {
  initialRouteName: 'Button',
});