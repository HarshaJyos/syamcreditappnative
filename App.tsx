import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import store from './src/store';
import AuthContextProvider, { useAuth } from './src/context/AuthContext';
import theme from './src/theme';
import SplashScreen from './src/screens/SplashScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import SurveyScreen from './src/screens/SurveyScreen';
import HomeScreen from './src/screens/HomeScreen';
import CardsListScreen from './src/screens/CardsListScreen';
import CardDetailsScreen from './src/screens/CardDetailsScreen';
import CompareScreen from './src/screens/CompareScreen';
import ApplicationsScreen from './src/screens/ApplicationsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import messaging from '@react-native-firebase/messaging';

// ✅ Request permission for push notifications
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Push notification permission granted:', authStatus);
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    // Send token to your backend if needed
  }
}

// ✅ Handle foreground messages
// In App.tsx, inside useFirebaseNotifications
function useFirebaseNotifications() {
  React.useEffect(() => {
    console.log('Requesting push notification permission...');
    requestUserPermission()
      .then(() => {
        console.log('Notification permission setup complete');
      })
      .catch(err => {
        console.error('Notification permission error:', err);
      });

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
    });

    return unsubscribeOnMessage;
  }, []);
}

const AuthStack = createStackNavigator();
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Survey" component={SurveyScreen} />
  </AuthStack.Navigator>
);

const Tab = createBottomTabNavigator();
const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: '#000000' },
      tabBarActiveTintColor: '#00FF00',
      tabBarInactiveTintColor: '#FFFFFF',
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Cards"
      component={CardsListScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="credit-card" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Applications"
      component={ApplicationsScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons
            name="file-document"
            color={color}
            size={26}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="bell" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

const RootStack = createStackNavigator();
const RootNavigator = () => {
  const { user, loading } = useAuth();
  useFirebaseNotifications();

  if (loading) return <SplashScreen />;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <RootStack.Screen name="Main" component={MainNavigator} />
          <RootStack.Screen name="CardDetails" component={CardDetailsScreen} />
          <RootStack.Screen name="Compare" component={CompareScreen} />
        </>
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

const App = () => (
  <Provider store={store}>
    <AuthContextProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AuthContextProvider>
  </Provider>
);

export default App;
