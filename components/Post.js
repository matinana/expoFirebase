import React from 'react';
import { Text, Image, StyleSheet, Dimensions, FlatList } from 'react-native';

class Post extends React.Component {
  renderPost({ item }) {
    return (
      <React.Fragment>
        <Image style={styles.image} source={{ uri: item.imgUrl }} />
        <Text style={styles.phrase}>#{item.phrase}</Text>
      </React.Fragment>
    );
  }

  render() {
    return (
      <FlatList
        contentContainerStyle={{ alignItems: 'center' }}
        data={[...this.props.allPosts].sort(
          (a, b) => b.postIndex - a.postIndex,
        )}
        keyExtractor={item => item.phrase}
        renderItem={this.renderPost}
      />
    );
  }
}

const deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  image: {
    height: deviceWidth / 2,
    width: deviceWidth / 2,
    borderRadius: 12,
  },
  phrase: {
    color: '#AAA',
    fontSize: 14,
    textAlign: 'center',
    width: deviceWidth / 2,
    marginVertical: 5,
  },
});

export default Post;
