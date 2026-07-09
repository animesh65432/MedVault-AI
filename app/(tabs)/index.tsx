import HomeLayOut from '@/components/Home';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomeLayOut />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});