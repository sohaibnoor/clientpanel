import firebase from "firebase";
import "firebase/firestore";
//import { ReactReduxFirebaseProvider, getFirebase } from 'react-redux-firebase';
import { createFirestoreInstance } from "redux-firestore";
import { createStore, combineReducers, compose } from "redux";
import { /*reactReduxFirebase,*/ firebaseReducer } from "react-redux-firebase";
import { /*reduxFirestore,*/ firestoreReducer } from "redux-firestore";
//Reducers
import NotifyReducer from "./reducers/NotifyReducer";
import settingsReducer from "./reducers/settingsReducer";

const firebaseConfig = {
  apiKey: "AIzaSyBu2eHPb-Xs21wCpFoR8Q3dQ6jp34OzOT4",
  authDomain: "reactclientpanel-55109.firebaseapp.com",
  databaseURL: "https://reactclientpanel-55109.firebaseio.com",
  projectId: "reactclientpanel-55109",
  storageBucket: "reactclientpanel-55109.appspot.com",
  messagingSenderId: "706147360516",
  appId: "1:706147360516:web:f655f008c2a5365232ba51"
};

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};
//Init firebase instance
firebase.initializeApp(firebaseConfig);
//Init firestore
//const firestore = firebase.firestore();
// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose()(createStore);
// reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
//reduxFirestore(firebase) // <- needed if using firestore

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
  notify: NotifyReducer,
  settings: settingsReducer
});
//check for settings in local storage
if (localStorage.getItem("settings") === null) {
  //then set default settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };
  //set/send to localstorage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}
//create initial state
const initialState = { settings: JSON.parse(localStorage.getItem("settings")) };

//create Store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    //reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance // <- needed if using firestore
};

export default store;
