import { StyleSheet, View } from 'react-native'
import Filters from './Filters'

const NonEmpty = () => {
    return (
        <View style={styles.container}>
            <Filters />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default NonEmpty