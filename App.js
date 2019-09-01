import React from 'react';
import { StyleSheet, View, YellowBox } from 'react-native';
import PostsScreen from './screens/PostsScreen';

// シュミレーター上でRemote debuggerのエラーを出さないように設定
YellowBox.ignoreWarnings(['Remote debugger']);

export default function App() {
  return (
    <View style={styles.container}>
      <PostsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
