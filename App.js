import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Screen from './components/Screen';

export default function App() {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Todos</Text>
        <Screen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 42,
    color: 'grey',
    opacity: .3,
    padding: 10,
    top: 10,
  },
});
