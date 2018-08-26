# Expo Push message with expo and firebase cloud message service

# Step1: Setup Firebase Project

https://console.firebase.google.com/u/0/project/webfirebasedb/settings/cloudmessaging/android:com.yuanyu

# Step2: Create Expo Project

```create-react-native-app push-demo```

# Step3: Write registerNotification Logic

```code
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
    console.log(token);
    this.subscription = Notifications.addListener(this.handleNotification);

    this.setState({
      token
    });
  }
```

# Step4: Push Notification logic

```code
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
```

# Step5: Setup app.json

```code
{
  "expo": {
    "sdkVersion": "27.0.0",
    "android": {
      "package":"com.yuanyu",
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

# Step6: download the google-services.json for app
 