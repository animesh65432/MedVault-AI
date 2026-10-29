import { scale } from '@/utils/scale';
import { Entypo } from '@expo/vector-icons';
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
            {tabs.map((tab, index) => {
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

                        {index === 0 &&
                            <Entypo
                                name='folder'
                                size={scale(24)}
                                color={isActive ? '#FFFFFF' : '#23423B'}
                            />
                        }
                        {index === 1 &&
                            <Entypo
                                name="text-document"
                                size={scale(24)}
                                color={isActive ? '#FFFFFF' : '#23423B'}
                            />
                        }

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
        display: "flex",
        flexDirection: "row",
        gap: scale(8),
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
        fontSize: scale(16),
        color: '#23423B',
        fontFamily: "Aeonik-Medium",
    },

    activeTabText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});

export default Tabs;
