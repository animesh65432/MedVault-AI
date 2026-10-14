import { scale } from '@/utils/scale';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { TypeTabs } from '../index';

type Props = {
    activeTab: TypeTabs;
    setActiveTab: React.Dispatch<React.SetStateAction<TypeTabs>>;
};

const Tabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
    const tabs: TypeTabs[] = ['Documents', 'Records'];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab;

                return (
                    <Pressable
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[
                            styles.tab,
                            isActive && styles.activeTab,
                        ]}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: isActive }}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                isActive && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '94%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F3F1',
        padding: scale(4),
        borderRadius: scale(16),
    },

    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scale(12),
        borderRadius: scale(13),
    },

    activeTab: {
        backgroundColor: '#23423B',
        elevation: 2,
    },

    tabText: {
        fontSize: scale(14),
        fontWeight: '500',
        color: '#6E827B',
    },

    activeTabText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});

export default Tabs;
