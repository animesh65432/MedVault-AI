import React from 'react';
import { Text } from 'react-native';
import { models, useLLM } from 'react-native-executorch';

const LocalAI: React.FC = () => {
    const {
        downloadProgress,
        isReady,
        error,
    } = useLLM({
        model: models.llm.gemma4_e2b_multimodal(),
    });

    if (error) {
        return <Text>Error: {String(error)}</Text>;
    }

    if (!isReady) {
        return (
            <Text>
                Downloading {Math.round(downloadProgress * 100)}%
            </Text>
        );
    }

    return (
        <Text>✅ On-device AI is ready</Text>
    )
}

export default LocalAI