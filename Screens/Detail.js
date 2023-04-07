import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import {firebase} from '../config.js';
import {useNavigation} from '@react-navigation/native';

const Detail = ({route, signOut}) => {

  const todoRef = firebase.firestore().collection('ky_todo');
  const [text, setText] = useState(route.params.item.heading);
  const navigation = useNavigation();

  const updateTodo = () => {

    if(text && text.length > 0){

      todoRef
        .doc(route.params.item.id)
        .update({
          heading: text,
        })
        .then(() => {
          navigation.navigate('Home');
        })
        .catch((error) => {
          console.log(error.message);
        });

    }

  }

  return(

    <View style={styles.container}>
      <TextInput
        style={styles.textField}
        onChangeText={setText}
        value={text}
        placeholder="Update Todo"
        />
        <TouchableOpacity
          style={styles.buttonUpdate}
          onPress = { () => {
            updateTodo();
          }}>
          <Text>UPDATE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSignOut} onPress={signOut}>
          <Text style={styles.buttonSignOutText}>SignOut</Text>
        </TouchableOpacity>
    </View>      


  );

}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginLeft: 15,
    marginRight: 15,
  },
  textField: {
    marginBottom: 10,
    padding: 10,
    fontSize: 15,
    color: '#000000',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  buttonUpdate: {
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: '#0de065',
  },
buttonSignOut: {
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: '#ff2e2e',
  },
  buttonSignOutText: {
    color: 'white',
    fontSize: 20,
  },
});

export default Detail;