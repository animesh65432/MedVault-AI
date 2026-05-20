import { StyleSheet, Text, View } from 'react-native';
import HomeLayOut from '@/components/Home';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomeLayOut />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});