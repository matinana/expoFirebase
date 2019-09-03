import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Button, Icon } from 'react-native-elements';
import { Fumi } from 'react-native-textinput-effects';
import { FontAwesome } from '@expo/vector-icons';

import firebase from 'firebase';
import Fire from '../utils/Fire';

class AddPostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
      phrase: '',
      addedPost: [],
    };
  }

  async onPressAdd() {
    await this.uploadPostImg();
    const { imgUrl, phrase } = await this.state;
    const postIndex = this.props.postIndex;

    this.uploadPost(imgUrl, phrase, postIndex);

    this.setState(
      {
        addedPost: [
          {
            imgUrl,
            phrase,
            postIndex,
          },
        ],
        imgUrl: '',
        phrase: '',
      },
      () => this.updateAddedPostState(),
      this.props.togglePostModal(),
    );
  }

  onAddImagePressed = async () => {
    // カメラロールへのアクセスを許可する
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      // イメージピッカーを立ち上げる
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.cancelled) {
        // リサイズ処理
        const actions = [];
        // heightは選択画像のwidthとの比率で決定
        actions.push({ resize: { width: 350 } });

        const manipulatorResult = await ImageManipulator.manipulateAsync(
          result.uri,
          actions,
          {
            compress: 0.4,
          },
        );
        this.setState({
          imgUrl: manipulatorResult.uri,
        });
      }
    }
  };

  uploadPostImg = async () => {
    const metadata = {
      contentType: 'image/jpeg',
    };
    const phrase = this.state.phrase;
    const storage = firebase.storage();
    const imgURI = this.state.imgUrl;
    const response = await fetch(imgURI);
    const blob = await response.blob();
    const uploadRef = storage.ref('images').child(`${phrase}`);

    // storageにダウンロードURLを保存
    await uploadRef.put(blob, metadata).catch(() => {
      alert('画像の保存に失敗しました');
    });

    // storageのダウンロードURLをfirestoreへ記述
    await uploadRef
      .getDownloadURL()
      .then(url => {
        this.setState({
          imgUrl: url,
        });
      })
      .catch(() => {
        alert('失敗しました');
      });
  };

  uploadPost(url, phrase, postIndex) {
    Fire.shared.uploadPost({
      url,
      phrase,
      postIndex,
    });
  }

  updateAddedPostState() {
    this.props.updateAddedPostState(this.state.addedPost);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => this.onAddImagePressed()}
        >
          {this.state.imgUrl ? (
            <Image style={styles.image} source={{ uri: this.state.imgUrl }} />
          ) : (
            <Icon
              name="camera-retro"
              type="font-awesome"
              size={50}
              containerStyle={styles.cameraIcon}
              color="gray"
            />
          )}
        </TouchableOpacity>
        <Fumi
          label={'キャッチコピーをつけてね'}
          iconClass={FontAwesome}
          iconName={'hashtag'}
          iconColor={'#f4d29a'}
          inputPadding={16}
          inputStyle={{ color: '#444' }}
          labelStyle={{ color: '#ddd' }}
          style={styles.textContainer}
          onChangeText={phrase => this.setState({ phrase })}
          value={this.state.phrase}
        />
        <Button
          buttonStyle={[
            styles.addPostBtn,
            { display: this.state.imgUrl ? 'flex' : 'none' },
          ]}
          title="追加"
          onPress={() => {
            if (this.state.phrase.length >= 1) {
              this.onPressAdd();
            } else {
              Alert.alert('キャッチコピーを入力してね', '');
            }
          }}
        />
      </View>
    );
  }
}

const deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    height: deviceWidth / 3.2,
    width: deviceWidth / 3.2,
    borderRadius: 20,
    backgroundColor: '#e6e6e6',
    marginTop: 20,
  },
  image: {
    height: deviceWidth / 3.2,
    width: deviceWidth / 3.2,
    borderRadius: 12,
  },
  cameraIcon: {
    marginTop: 36,
  },
  textContainer: {
    borderWidth: 0.3,
    borderColor: 'red',
    width: 300,
    marginTop: 20,
  },
  addPostBtn: {
    backgroundColor: 'blue',
    borderRadius: 45,
    width: 200,
    marginTop: 10,
  },
});
export default AddPostModal;
