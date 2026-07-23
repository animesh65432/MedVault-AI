import { TEMPLATE_QUESTIONS } from "@/utils/contensnt"
import { fs } from '@/utils/fs'
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

type Props = {
    onSelect: (question: string) => void
}

const TemplateQuestions: React.FC<Props> = ({ onSelect }) => {
    return (
        <View style={styles.wrapper}>
            {TEMPLATE_QUESTIONS.map((q) => (
                <TouchableOpacity
                    key={q}
                    style={styles.chip}
                    onPress={() => onSelect(q)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.chipText}>{q}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scale(8),
        paddingHorizontal: scale(16),
        paddingVertical: vScale(12),
    },
    chip: {
        backgroundColor: "#234338",
        borderRadius: scale(20),
        paddingVertical: vScale(8),
        paddingHorizontal: scale(14),
    },
    chipText: {
        color: "#EEF6A2",
        fontFamily: "Aeonik-Medium",
        fontSize: fs(13),
    },
})

export default TemplateQuestions