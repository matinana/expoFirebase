import firebase from 'firebase';
import 'firebase/firestore';
import { config } from './config';

class Fire {
  constructor() {
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
    });
  }

  uploadPost = async ({ url, phrase, postIndex }) => {
    const uploadRef = await this.postCollection.doc(phrase);
    uploadRef
      .set({
        imgUrl: url,
        phrase,
        postIndex,
      })
      .then(() => {
        console.log('書き込みができました');
      });
  };

  getPosts = async () => {
    const querySnapshot = await this.postCollection.get();
    const res = [];
    querySnapshot.forEach(doc => {
      res.push(doc.data());
    });
    return res;
  };

  get userCollection() {
    return firebase.firestore().collection('users');
  }

  get postCollection() {
    return this.userCollection.doc(this.uid).collection('posts');
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
}

Fire.shared = new Fire();
export default Fire;
