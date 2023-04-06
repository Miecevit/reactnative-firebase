import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = (props) => {

  const [todoList, setTodoList] = useState([]);
  const todoRef = firebase.firestore().collection('ky_todo');
  const [addData, setAddData] = useState('');
  const {user} = props;

  useEffect(() => {
    if(!user) return;

    todoRef
      .where('userId', '===', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const todoList = [];
        querySnapshot.forEach((doc) => {
          const {heading} = doc.data();
          todoList.push({
            id: doc.id,
            heading,
          });
        });
        setTodoList(todoList);
      })

  }, [user]);


  const addTodo = () => {

    if(addData && addData.length > 0){
      const timestamp = firebase.firestore.FieldValue.serverTimeStamp();
      const user = firebase.auth().currentUser;

        if(user){
          const data = {
            heading: addData,
            createdAt: timestamp,
            userId: user.uid,
          };

          todoRef
            .add(data)
            .then(() => {
              setAddData('');
              Keyboard.dismiss();
            })
            .catch((error) => {
              console.log(error);
            });
        } 
      }
  }

  return (

    <SafeAreaView style={ {flex: 1} }>

      <View style={styles.textHeadingContainer}>
        <Text style={styles.textHeading}>100KY - ToDo</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add New ToDo"
          placeholderTextColor= "#cceeff"
          value={addData}
          onChangeText={(heading) => setAddData(heading)}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          />
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todoList}
        numColumns={1}
        renderItem= {( {item} ) => (
          <View style={styles.container}>
            <Text style={styles.itemHeading}> {item.heading} </Text>
          </View>
        )}
        />
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
    container: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHeadingContainer: {
    paddingVertical: 20,
    alignContent: 'center',
    alignItems: 'center',
  },
  textHeading: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 45,
  },
  itemHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 22,
  },
  formContainer: {
    flexDirection: 'row',
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 40,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },

  todoIcon: {
    marginTop: 5,
    fontSize: 20,
    marginLeft: 14,
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
