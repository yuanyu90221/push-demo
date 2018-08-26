import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, View } from 'react-native';
import {Permissions, Notifications} from 'expo';
const url = `https://exp.host/--/api/v2/push/send`;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      notification: null,
      title: 'Hello World',
      body: 'Say something'
    };
  }

  async registerForPushNotifictions() {
    // Ask for notification permission
    const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        return;
      }
    }

    const token = await Notifications.getExpoPushTokenAsync();
    this.subscription = Notifications.addListener(this.handleNotification);
    this.setState({
      token
    });
  }

  handleNotification = notification => {
    this.setState({
      notification
    });
  };

  sendPushNotification(token = this.state.token, title = this.state.title, body = this.state.body) {
    return fetch(`${url}`, {
      body: JSON.stringify({
        to: token,
        title: title,
        body: body,
        data: {message: `${title} - ${body}` }
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
  }
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="position">
        <Text style={styles.title}>Expo Sample Notifications App</Text>
        <Text style={styles.text}>Title</Text>
        <TextInput style={styles.input} 
          onChangeText={title => this.setState({title})}
          maxLength={100}
          value = {this.state.title}
        />
        <Text style={styles.text}>Message</Text>
        <TextInput 
          style={styles.input}
          onChangeText={body => this.setState({body})}
          maxLength={100}
          value={this.state.body}
        />
        <TouchableOpacity
         onPress={()=> this.registerForPushNotifictions()}
         style={styles.touchable}
        ><Text>Register me for notifications!</Text></TouchableOpacity>
        <TouchableOpacity
          onPress={()=>this.sendPushNotification()}
          style={styles.touchable}
        ><Text>Send me a notification</Text></TouchableOpacity>
        {this.state.token? (
          <View>
            <Text style={styles.text}>Token</Text>
            <TextInput 
              style={styles.text}
              onChangeText={token => this.setState({token})}
              value={this.state.token}
            />
          </View>
        ):null}
        {this.state.notification ? (
          <View>
            <Text style={styles.text}>Last Notification</Text>
            <Text style={styles.text}>{JSON.stringify(this.state.notification.data.message)}</Text>
          </View>
        ):null}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    padding: 8
  },
  text: {
    paddingBottom:2,
    padding: 8
  },
  touchable: {
    borderWidth: 1,
    borderRadius: 4,
    margin: 8,
    padding: 8
  },
  input: {
    height: 40,
    borderWidth: 1,
    margin: 8,
    padding: 8,
    width: '95%',
  }
});
