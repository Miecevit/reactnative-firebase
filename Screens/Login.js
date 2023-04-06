import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import {firebase} from '../config.js';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const signIn = async () => {

    try{

      await firebase.auth().signInWithEmailAndPassword(email, password);
      Alert.alert("100KY - ToDo", "Giriş yapıldı.")

    }catch (error){
      console.log(error.message);
      Alert.alert("100KY - ToDo", `Hata oluştu: ${error.message}`);
    }
   
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Login" onPress={signIn} />
      <Button title="Signup" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});