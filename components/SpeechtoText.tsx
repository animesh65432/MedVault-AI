import { RecentSearchContext } from "@/context/RecentSearch";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import Feather from "@expo/vector-icons/Feather";
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import React, { useContext, useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text } from "react-native";

type Props = {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchQuery: string;
};

const SpeechtoText: React.FC<Props> = ({ searchQuery, visible, setVisible, setSearchQuery }) => {
    const { addRecentSearch } = useContext(RecentSearchContext);
    const [recognizing, setRecognizing] = useState(false);

    useSpeechRecognitionEvent("start", () => setRecognizing(true));

    useSpeechRecognitionEvent("end", () => {
        setRecognizing(false);
        setVisible(false);
    });

    useSpeechRecognitionEvent("result", (event) => {
        const transcript = event.results[0]?.transcript ?? "";
        setSearchQuery(transcript);
        if (event.isFinal && transcript.trim()) {
            addRecentSearch(transcript.trim());
        }
    });

    useSpeechRecognitionEvent("error", (event) => {
        console.log("Speech error:", event.error, event.message);
        setRecognizing(false);
        setVisible(false);
    });

    const startSpeech = async () => {
        const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!permission.granted) {
            setVisible(false);
            return;
        }
        setSearchQuery("");
        ExpoSpeechRecognitionModule.start({
            lang: "en-IN",
            interimResults: true,
            continuous: false,
        });
    };

    useEffect(() => {
        if (visible) {
            startSpeech();
        }
        return () => {
            ExpoSpeechRecognitionModule.abort();
        };
    }, [visible]);

    console.log(searchQuery.length, "hey")

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={() => setVisible(false)}
        >
            <Pressable
                style={styles.overlay}
                onPress={() => setVisible(false)}
            >
                <Pressable style={styles.modal} onPress={() => { }}>
                    <Text style={styles.text}>
                        {searchQuery}
                    </Text>
                    <Pressable
                        style={styles.micButton}
                        onPress={() =>
                            recognizing
                                ? ExpoSpeechRecognitionModule.stop()
                                : startSpeech()
                        }
                    >
                        <Feather
                            name={recognizing ? "mic-off" : "mic"}
                            size={vScale(32)}
                            color="white"
                        />
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "white",
        padding: scale(20),
        minHeight: vScale(200),
        borderRadius: scale(40),
        width: "75%",
        justifyContent: "center",
        alignItems: "center",
        gap: vScale(24),
    },
    text: {
        fontSize: scale(18),
        textAlign: "center",
        color: "#23423B",
    },
    micButton: {
        width: vScale(70),
        height: vScale(70),
        borderRadius: vScale(35),
        backgroundColor: "#0D483F",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default SpeechtoText;