//IMPORTLAR
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
import { SafeAreaView } from 'react-native-safe-area-context'; //Ios cihazlarda güvenli ekran boşluğunu kendisi belirleyen component (çentik, yukardan aşağı çektiğimiz ayarların olduğu pili falan gösteren yer vb.)

import {firebase} from '../config.js'; //FIREBASE Giriş ayarlarımızı çağırıyoruz (MySQL kimlik gibi)

const Home = (props) => {

  const [todoList, setTodoList] = useState([]); //Kullanıcının veritabanındaki todo öğelerini tutacak array
  const todoRef = firebase.firestore().collection('ky_todo'); //Bağlantı kimliği (mysql.query gibi)
  const [addData, setAddData] = useState(''); //Kullanıcının "input"la oluşturduğu todo öğesi
  const {user} = props; //proptan gelen (App.js STACK) user
  const {signOut} = props; //proptan gelen (App.js STACK) signOut fonksiyonu

  useEffect(() => { //useEffect her bu sayfa açıldığında devreye girer

    if(!user) return; // eğer user yoksa (auth mevcut değil) boş dön

    todoRef //Kimlik objesine emirler veriyoruz
      .where('userId', '==', user.uid) //Bu koşulu gerçekleştiren yerde
      .orderBy('createdAt', 'desc') // createdAt'e göre sıralarak (azalan)
      .onSnapshot((querySnapshot) => { //veritabanındaki bilgileri al
        const todoListesi = []; //todoListesi diye bir array oluştur (STANDAR ARRAY - UseState'siz)
        querySnapshot.forEach((doc) => { //veritabanından aldığımız her öğe için (map) öğere "doc" ismini vererek
          const {heading} = doc.data(); //heading değişkenine doc'un data kısmını yaz
          todoListesi.push({ //todoListesi array'ine ekle
            id: doc.id, //doc'taki id'yi
            heading, //doc'taki data kısmını heading olarak almıştık
          });
        });
        setTodoList(todoListesi); //UseState'li array'e normal array'i eşitle
      });

  }, [user]); //UseEffect çalışırken user objesi mevcut olsun


 const addTodo = () => {

  if (addData && addData.length > 0) { //Kullanicinin girdiği bilgi varsa ve boş değilse

    const timestamp = firebase.firestore.FieldValue.serverTimestamp(); //server'ın saat bilgisini al
    const user = firebase.auth().currentUser; //firebase üzerine user kontrolü varsa getir
    if (user) { //Eğer user tamamsa
      const data = { //data değişkeni JSON
        heading: addData, // heading'e kullanıcın girdiği yazıyı yaz
        createdAt: timestamp, //createdAt'e server'ın saatini koy
        userId: user.uid, //userId'ye kullanıcı id kodunu yaz
      };
      // Oluşturduğumuz json paketini (data) todoRef'e veritabanına eklemesi için vereceğiz
      todoRef
        .add(data) //add fonksiyonu (INSERT INTO VALUE)
        .then(() => { //Ekledikten sonra
          setAddData(''); // useState'li addData değişkenini boş hale getir
          Keyboard.dismiss(); // Ekranda klavye varsa yok et
        })
        .catch((error) => {
          alert(error);

        });
    }
  }
};

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
            <Text style={styles.itemHeading}> {item.heading} 
            </Text>
          </View>
        )}
        />
        <TouchableOpacity style={styles.buttonSignOut} onPress={signOut}>
          <Text style={styles.buttonSignOutText}>SignOut</Text>
        </TouchableOpacity>
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

export default Home; 