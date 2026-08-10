import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import Feather from '@expo/vector-icons/Feather';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    children: ReactNode;
    fallback?: (error: Error, reset: () => void) => ReactNode;
};

type State = {
    hasError: boolean;
    error: Error | null;
};

class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
        error: null,
    };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Wire this to Sentry/Bugsnag/etc when you add crash reporting.
        console.error('[ErrorBoundary] Uncaught render error:', error, errorInfo.componentStack);
    }

    reset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.reset);
            }
            return <DefaultFallback error={this.state.error} onReset={this.reset} />;
        }

        return this.props.children;
    }
}

const DefaultFallback: React.FC<{ error: Error; onReset: () => void }> = ({ error, onReset }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrap}>
                <Feather name="alert-triangle" size={28} color="#234338" />
            </View>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
                The app hit an unexpected error. Your data is safe — try again below.
            </Text>

            {__DEV__ && (
                <View style={styles.debugBox}>
                    <Text style={styles.debugText}>{error.message}</Text>
                </View>
            )}

            <TouchableOpacity style={styles.retryButton} onPress={onReset} activeOpacity={0.85}>
                <Text style={styles.retryButtonText}>Try again</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(32),
        backgroundColor: '#FFFFFF',
        gap: vScale(10),
    },
    iconWrap: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        backgroundColor: '#EEF6A2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: vScale(8),
    },
    title: {
        fontSize: fs(18),
        fontFamily: 'Aeonik-Medium',
        color: '#0D1F1C',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: fs(13.5),
        fontFamily: 'Aeonik-Regular',
        color: '#5F5E5A',
        textAlign: 'center',
        lineHeight: fs(20),
        marginBottom: vScale(8),
    },
    debugBox: {
        backgroundColor: '#FAFAF8',
        borderRadius: scale(10),
        borderWidth: 1,
        borderColor: '#E5E4DD',
        padding: scale(12),
        marginBottom: vScale(8),
        width: '100%',
    },
    debugText: {
        fontSize: fs(11),
        fontFamily: 'Aeonik-Regular',
        color: '#B4483F',
    },
    retryButton: {
        backgroundColor: '#234338',
        borderRadius: scale(20),
        paddingHorizontal: scale(28),
        paddingVertical: scale(12),
        marginTop: vScale(8),
    },
    retryButtonText: {
        fontSize: fs(14),
        fontFamily: 'Aeonik-Medium',
        color: '#EEF6A2',
    },
});

export default ErrorBoundary;