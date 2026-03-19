import 'react-native-gesture-handler';
import React from 'react';
import { enableScreens } from 'react-native-screens';
enableScreens();

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreateAccount from './screens/create_account';
import login1 from './screens/login1';
import login2 from './screens/login2';
import Signup from './screens/Signup';
import DashboardScreen from './screens/landing_page';
import CreateArticle from './screens/create_article';
import BottomTabs from './components/bottomTabs'; 
import notifications from './screens/notifications';
import MyArticles from './screens/my_articles';

import forgot_password from './screens/forgot_password';
//import create_new_password from './screens/create_new_password';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="create_account" component={CreateAccount} />
          <Stack.Screen name="bottomTabs" component={BottomTabs} />
          <Stack.Screen name="login1" component={login1} />
          <Stack.Screen name="login2" component={login2} />
          {<Stack.Screen name="Signup" component={Signup} />}
          <Stack.Screen name="landing_page" component={DashboardScreen} />
          <Stack.Screen name="forgot_password" component={forgot_password} />
          {/*<Stack.Screen name="create_new_password"  component={create_new_password}*/}
          <Stack.Screen name="create_article" component={CreateArticle} />
          <Stack.Screen name="notifications" component={notifications} />
          <Stack.Screen name="my_articles" component={MyArticles} />


    
          
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
