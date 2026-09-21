import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { AntDesign, Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const GREEN = '#0D483F';
const LIME = '#D9F99D';

const HeroSection: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={[styles.card, styles.cardLab]}>
                <Feather
                    name="thermometer"
                    size={scale(22)}
                    color="#7F77DD"
                />
                <Text style={styles.cardLabel} numberOfLines={1}>
                    Lab report
                </Text>
            </View>

            <View style={[styles.card, styles.cardScan]}>
                <Feather name="activity" size={scale(22)} color="#378ADD" />
                <Text style={styles.cardLabel} numberOfLines={1}>
                    Scan / X-ray
                </Text>
            </View>

            <View style={[styles.card, styles.cardRx]}>
                <Feather name="file-text" size={scale(24)} color="#639922" />
                <Text style={styles.cardLabel} numberOfLines={1}>
                    Prescription
                </Text>
            </View>

            <View style={styles.badge}>
                <AntDesign name="lock" size={scale(15)} color={LIME} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: scale(300),
        height: vScale(200),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        position: 'absolute',
        width: scale(112),
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: '#E5E3D8',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: GREEN,
        shadowOpacity: 0.14,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
    },
    cardLab: {
        height: vScale(132),
        left: scale(12),
        top: vScale(74),
        transform: [{ rotate: '-12deg' }],
        zIndex: 1,
    },
    cardScan: {
        height: vScale(132),
        left: scale(176),
        top: vScale(74),
        transform: [{ rotate: '12deg' }],
        zIndex: 1,
    },
    cardRx: {
        width: scale(122),
        height: vScale(148),
        left: scale(89),
        top: vScale(30),
        transform: [{ rotate: '-3deg' }],
        zIndex: 2,
    },
    cardLabel: {
        fontSize: fs(11),
        color: '#5F5E5A',
        fontFamily: 'Aeonik-Regular',
        textAlign: 'center',
    },
    badge: {
        position: 'absolute',
        width: scale(46),
        height: scale(46),
        borderRadius: 23,
        backgroundColor: GREEN,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#F6F5EE',
        // anchored exactly at container center, on the seam where the three cards overlap
        left: scale(150) - scale(23),
        top: vScale(150) - scale(23),
        zIndex: 3,
        shadowColor: GREEN,
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
});

export default HeroSection;