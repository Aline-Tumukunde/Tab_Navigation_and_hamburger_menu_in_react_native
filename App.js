import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Switch, Image, TouchableOpacity, Alert, Button } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import HomeScreen from './screens/HomeScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import ContactScreen from './screens/ContactScreen';
import InternetConnection from './screens/InternetConnection';
import SignInScreen from './screens/SignIn';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [theme, setTheme] = useState(DefaultTheme);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [profileImage, setProfileImage] = useState();


  useEffect(() => {
    loadTheme();
    requestImagePermission();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await getTheme();
    setTheme(savedTheme === 'dark' ? DarkTheme : DefaultTheme);
    setIsDarkTheme(savedTheme === 'dark');
  };

  const toggleTheme = async () => {
    const newTheme = isDarkTheme ? 'light' : 'dark';
    setIsDarkTheme(!isDarkTheme);
    setAsyncStorageTheme(newTheme);
    setTheme(newTheme === 'dark' ? DarkTheme : DefaultTheme);
  };

  const requestImagePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setProfileImage(result.uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setProfileImage(result.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const uploadImage = async (uri) => {
  };

  const CustomDrawerContent = ({ navigation }) => {
    const drawerItems = [
      { label: 'Home', screen: 'Home', icon: <Ionicons name='home' size={24} color='gray' /> },
      { label: 'Calculator', screen: 'Calculator', icon: <Ionicons name='calculator' size={24} color='gray' /> },
      { label: 'Contacts', screen: 'Contacts', icon: <Ionicons name='person' size={24} color='gray' /> },
      { label: 'WI-FI', screen: 'WI-FI', icon: <Ionicons name='wifi' size={24} color='gray' /> },
      { label: 'Authentication', screen: 'Authentication', icon: <Ionicons name='thermometer-outline' size={24} color='gray' /> },
    ];

    const handleEditPress = () => {
      Alert.alert(
        'Edit Profile Picture',
        'Choose an option',
        [
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose from Gallery', onPress: selectImage },
          { text: 'Cancel', style: 'cancel' }
        ],
        { cancelable: true }
      );
    };

    return (
      <SafeAreaView>
        <View style={styles.drawerHeader}>
          <TouchableOpacity onPress={handleEditPress}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Image source={{ uri: 'https://picsum.photos/300' }} style={styles.profileImage} />
            )}
          </TouchableOpacity>
          <Text style={styles.profileText}>Profile</Text>
          <View style={styles.editContainer}>
            <Text>{'\n'}</Text>
            <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {drawerItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(item.screen)}
              style={styles.drawerItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.icon}
                <Text style={{ fontSize: 16, color: 'black' }}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer theme={theme}>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="Home" component={TabNavigator} />
          <Drawer.Screen name="Calculator" component={CalculatorScreen} />
          <Drawer.Screen name="Contacts" component={ContactScreen} />
          <Drawer.Screen name="WI-FI" component={InternetConnection} />
          {/* Display SignInScreen here */}
          <Drawer.Screen name="Authentication" component={SignInScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
      <View style={styles.themeSwitchContainer}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkTheme ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleTheme}
          value={isDarkTheme}
        />
      </View>
    </View>
  );
}

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          display: 'flex'
        },
        tabBarItemStyle: {
          flex: 1
        }
      }}
    >
      <Tab.Screen
        name='HomeScreen'
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={30} color={color} />
          ),
        }} />
      <Tab.Screen
        name='Calculator'
        component={CalculatorScreen}
        options={{
          tabBarLabel: "Calculator",
          tabBarIcon: ({ color }) => (
            <Ionicons name='calculator' size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Contact'
        component={ContactScreen}
        options={{
          tabBarLabel: "Contacts",
          tabBarIcon: ({ color }) => (
            <Ionicons name='person' size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='WI-FI'
        component={InternetConnection}
        options={{
          tabBarLabel: "Internet",
          tabBarIcon: ({ color }) => (
            <Ionicons name='wifi' size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    height: '35%',
  },
  profileImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  profileText: {
    fontSize: 22,
    marginHorizontal: 20,
    fontWeight: 'bold',
    color: '#111',
    fontFamily: 'Courier New'
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Courier New'
  },
  drawerItem: {
    padding: 20,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  themeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 50,
    right: 10,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  profileSubtext: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  editContainer: {
    justifyContent: 'center',
  }
});

const getTheme = async () => {
  return 'light';
};

const setAsyncStorageTheme = async (theme) => {
};

