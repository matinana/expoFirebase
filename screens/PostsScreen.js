import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import firebase from 'firebase';
import Fire from '../utils/Fire';
import Post from '../components/Post';
import AddPostModal from '../components/AddPostModal';

class PostsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allPosts: [],
      isAddPostModalVisible: false,
    };
    this.downloadAllPosts();
  }

  togglePostModal = () => {
    this.setState({
      isAddPostModalVisible: !this.state.isAddPostModalVisible,
    });
  };

  updateAddedPostState = childState => {
    this.setState({
      allPosts: [...this.state.allPosts, ...childState],
    });
  };

  async downloadAllPosts() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const posts = await Fire.shared.getPosts();
        this.setState({
          allPosts: posts,
        });
      }
    });
  }

  render() {
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    return (
      <View style={styles.container}>
        <Button
          containerStyle={styles.addPostBtnContainer}
          buttonStyle={styles.addPostBtn}
          title="写真を追加"
          onPress={this.togglePostModal}
        />
        <Modal
          isVisible={this.state.isAddPostModalVisible}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          animationIn="fadeIn"
          animationInTiming={300}
          style={styles.modal}
        >
          <Button
            buttonStyle={styles.cancelBtn}
            titleStyle={styles.cancelBtnText}
            title="キャンセル"
            onPress={this.togglePostModal}
          />
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={120}>
            <AddPostModal
              updateAddedPostState={this.updateAddedPostState}
              togglePostModal={this.togglePostModal}
              postIndex={this.state.allPosts.length}
            />
          </KeyboardAvoidingView>
        </Modal>
        <Post allPosts={this.state.allPosts} />
      </View>
    );
  }
}

const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: deviceHeight,
  },
  addPostBtnContainer: {
    padding: 10,
    marginTop: 50,
    alignItems: 'center',
  },
  addPostBtn: {
    borderRadius: 45,
    width: 200,
  },
  modal: {
    backgroundColor: 'white',
    maxHeight: deviceHeight / 1.5,
    marginTop: 50,
  },
  cancelBtn: {
    borderRadius: 50,
    width: 100,
    margin: 10,
  },
  cancelBtnText: {
    fontSize: 14,
  },
});

export default PostsScreen;
