/**
 * Device Spec Info Example App
 * Demonstrates the react-native-device-spec-info library
 */

import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useDeviceSpec } from 'react-native-device-spec-info';

type DeviceSpecType = 'low' | 'mid' | 'high' | null;

interface SpecDisplay {
  category: DeviceSpecType;
  color: string;
  icon: string;
  description: string;
}

interface ThemeColors {
  bg: string;
  text: string;
  secondaryText: string;
  cardBg: string;
  borderColor: string;
}

const getThemeColors = (isDarkMode: boolean): ThemeColors => ({
  bg: isDarkMode ? '#1a1a1a' : '#fff',
  text: isDarkMode ? '#fff' : '#000',
  secondaryText: isDarkMode ? '#aaa' : '#666',
  cardBg: isDarkMode ? '#2a2a2a' : '#f5f5f5',
  borderColor: isDarkMode ? '#333' : '#eee',
});

const getSpecDisplay = (spec: DeviceSpecType): SpecDisplay => {
  switch (spec) {
    case 'high':
      return {
        category: 'high',
        color: '#4CAF50',
        icon: '⚡',
        description: 'High-End Device',
      };
    case 'mid':
      return {
        category: 'mid',
        color: '#FF9800',
        icon: '⚙️',
        description: 'Mid-Range Device',
      };
    case 'low':
      return {
        category: 'low',
        color: '#F44336',
        icon: '📱',
        description: 'Low-End Device',
      };
    default:
      return {
        category: null,
        color: '#999',
        icon: '❓',
        description: 'Unknown',
      };
  }
};

interface InfoCardProps {
  label: string;
  value: string | number | boolean;
  unit?: string;
  labelColor: string;
  valueColor: string;
}

function InfoCard({
  label,
  value,
  unit = '',
  labelColor,
  valueColor,
}: InfoCardProps): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>
        {String(value)}
        {unit && ` ${unit}`}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const { spec, details, isLoading, error } = useDeviceSpec();
  const specDisplay = getSpecDisplay(spec);
  const colors = getThemeColors(isDarkMode);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Device Spec Info
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Testing react-native-device-spec-info
          </Text>
        </View>

        {/* Loading State */}
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={specDisplay.color} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Detecting device specs...
            </Text>
          </View>
        ) : error ? (
          /* Error State */
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error.message}</Text>
          </View>
        ) : (
          /* Main Content */
          <>
            {/* Spec Category Card */}
            <View
              style={[
                styles.specCard,
                {
                  backgroundColor: specDisplay.color + '20',
                  borderColor: specDisplay.color,
                },
              ]}>
              <Text style={styles.specIcon}>{specDisplay.icon}</Text>
              <Text style={[styles.specCategory, { color: specDisplay.color }]}>
                {specDisplay.description}
              </Text>
              <Text
                style={[
                  styles.specValue,
                  { color: specDisplay.color },
                ]}>
                {spec?.toUpperCase()}
              </Text>
            </View>

            {/* Device Details */}
            {details && (
              <View style={[styles.detailsCard, { backgroundColor: colors.cardBg }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Device Details
                </Text>

                <InfoCard
                  label="Total Memory"
                  value={details.totalMemory.toFixed(2)}
                  unit="GB"
                  labelColor={colors.secondaryText}
                  valueColor={colors.text}
                />
                <InfoCard
                  label="CPU Cores"
                  value={details.cpuCores}
                  labelColor={colors.secondaryText}
                  valueColor={colors.text}
                />
                <InfoCard
                  label="Screen Size"
                  value={details.screenSize.toFixed(2)}
                  unit="inches"
                  labelColor={colors.secondaryText}
                  valueColor={colors.text}
                />
                <InfoCard
                  label="Pixel Density"
                  value={details.pixelDensity.toFixed(2)}
                  unit="x"
                  labelColor={colors.secondaryText}
                  valueColor={colors.text}
                />
                <InfoCard
                  label="OS Version"
                  value={details.osVersion}
                  labelColor={colors.secondaryText}
                  valueColor={colors.text}
                />
                <InfoCard
                  label="Device Type"
                  value={details.isTablet ? 'Tablet' : 'Phone'}
                  labelColor={colors.secondaryText}
                  valueColor={colors.text}
                />
              </View>
            )}

            {/* Scoring Legend */}
            <View style={[styles.legendCard, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Scoring System
              </Text>

              <LegendItem
                label="RAM (40%)"
                value="8GB+ (high), 4-8GB (mid), <4GB (low)"
                color={colors.secondaryText}
              />
              <LegendItem
                label="CPU (30%)"
                value="8+ cores (high), 4-6 cores (mid), <4 cores (low)"
                color={colors.secondaryText}
              />
              <LegendItem
                label="Display (20%)"
                value="Screen size + pixel density"
                color={colors.secondaryText}
              />
              <LegendItem
                label="OS Version (10%)"
                value="Latest versions score higher"
                color={colors.secondaryText}
              />

              <Text style={[styles.legendScore, { color: colors.secondaryText }]}>
                Score ≥70 = High | 40-69 = Mid | &lt;40 = Low
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

interface LegendItemProps {
  label: string;
  value: string;
  color: string;
}

function LegendItem({ label, value, color }: LegendItemProps): React.JSX.Element {
  return (
    <Text style={[styles.legendText, { color }]}>
      • <Text style={styles.legendLabel}>{label}</Text>: {value}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#c33',
    fontSize: 14,
    fontWeight: '500',
  },
  specCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  specIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  specCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  specValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  detailsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  legendCard: {
    borderRadius: 12,
    padding: 16,
  },
  legendText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  legendLabel: {
    fontWeight: '600',
  },
  legendScore: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    fontWeight: '500',
  },
});

export default App;
