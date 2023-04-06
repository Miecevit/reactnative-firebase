import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyD_qTo55CA3nMP1m521dDPqMhUgVmGVcEc",
  authDomain: "ky-todo-f835a.firebaseapp.com",
  projectId: "ky-todo-f835a",
  storageBucket: "ky-todo-f835a.appspot.com",
  messagingSenderId: "760946462448",
  appId: "1:760946462448:web:c44bd08fca945dc11bfc35",
  measurementId: "G-JRN188QNVZ"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export { firebase };