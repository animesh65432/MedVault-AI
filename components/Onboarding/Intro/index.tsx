import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Props = {
    onPressStart: () => void;
};

const Intro = ({ onPressStart }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.ImageContainer}>
                <Image
                    source={require('../../../assets/images/Intro.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.DescriptionContainer}>
                <View style={styles.LogoTextContainer}>
                    <Image
                        style={styles.LogoContainer}
                        resizeMode="cover"
                        source={require('../../../assets/images/icon.png')}
                    />
                    <View>
                        <Text style={styles.title}>
                            MedVault AI
                        </Text>
                    </View>
                </View>

                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitle}>
                        Your health records,
                    </Text>
                    <Text style={styles.subtitleText}>
                        finally organized.
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={onPressStart}
                >
                    <Text style={styles.buttonText}>
                        Get Started
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(20)
    },
    image: {
        width: scale(320),
        height: "95%",
        alignSelf: 'center',
        marginTop: "auto",
    },
    title: {
        fontSize: scale(24),
        textAlign: 'center',
        fontFamily: 'Aeonik-Medium'
    },
    subtitleContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(8)
    },
    subtitle: {
        fontSize: fs(32),
        textAlign: 'center',
        fontFamily: 'Aeonik-Medium',
    },

    button: {
        width: scale(350),
        backgroundColor: '#1F4D43',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale(40),
        height: vScale(56),
        borderRadius: scale(10)
    },
    buttonText: {
        color: 'white',
        fontSize: fs(20),
        fontFamily: 'Aeonik-Medium',
    },
    ImageContainer: {
        width: scale(350),
        height: vScale(520),
        backgroundColor: '#1F4D43',
        marginTop: "auto",
        borderRadius: scale(15),
    },
    DescriptionContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(10),
        marginTop: vScale(20)
    },
    LogoContainer: {
        width: scale(60),
        height: vScale(60),
    },
    LogoTextContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitleText: {
        fontSize: fs(32),
        textAlign: 'center',
        fontFamily: 'Aeonik-Medium',
        color: '#1F4D43',
    },
});

export default Intro;
