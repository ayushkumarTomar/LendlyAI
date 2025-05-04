import 'react-native-reanimated';


import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { NavigationContainer, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { StatusBar } from 'expo-status-bar';
import ChatScreen from './ChatScreen';
import CalendarScreen from './CalendarScreen';
const Tab = createMaterialTopTabNavigator();



function RootNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer theme={NavigationDarkTheme}>
      <SafeAreaView style={styles.safeArea}>
        <Tab.Navigator
          initialRouteName="Chat"
          screenOptions={{
            tabBarIndicatorStyle: { backgroundColor: '#4a90e2' },
            tabBarLabelStyle: { fontWeight: '600', color: '#fff' },
            tabBarStyle: { elevation: 0, backgroundColor: '#1a1a1a', paddingTop: insets.top },
          }}
        >
          <Tab.Screen name="Chat" component={ChatScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ActionSheetProvider>
        <>
          <StatusBar style="light" backgroundColor="#1a1a1a" translucent={false} />
          <RootNavigator />
        </>
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  }
});
