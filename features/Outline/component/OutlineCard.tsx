import { useTheme } from '@/context/theme-provider';
import { forwardRef } from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import Typography from '@/components/ui/Typography';

type OutlineCardProps = {
  title: string;
  confidenceRate: number;
  concepts: string[];
  description: string;
  buttonTitle?: string;
  onPress?: () => void;
  style?: ViewStyle;
} & TouchableOpacityProps;

export const OutlineCard = forwardRef<View, OutlineCardProps>(
  (
    {
      title,
      confidenceRate,
      concepts,
      description,
      buttonTitle = 'Study',
      onPress,
      style,
      ...touchableProps
    },
    ref
  ) => {
    const { theme } = useTheme();

    const containerStyle: ViewStyle = {
      backgroundColor: '#fff',
      borderColor: theme.colors.border,
    };

    const titleStyle: TextStyle = {
      color: theme.colors.foreground,
    };

    const descriptionStyle: TextStyle = {
      color: theme.colors.mutedForeground,
    };

    return (
      <TouchableOpacity
        ref={ref}
        style={[styles.container, containerStyle, style]}
        onPress={onPress}
        activeOpacity={0.7}
        {...touchableProps}>
        <View style={styles.headerContainer}>
          <View style={styles.titleSection}>
            <Typography style={[styles.title, titleStyle, { fontFamily: 'Figtree_700Bold' }]}>
              {title}
            </Typography>
            <Typography style={styles.confidenceLabel}>
              Confidence rate:{' '}
              <Typography style={[styles.confidenceValue, { fontFamily: 'Figtree_700Bold' }]}>
                {confidenceRate}%
              </Typography>
            </Typography>
          </View>
          <TouchableOpacity style={styles.studyButton} onPress={onPress} activeOpacity={0.8}>
            <Typography style={styles.buttonText}>{buttonTitle}</Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.descriptionContainer}>
          <Typography style={[styles.description, descriptionStyle]}>{description}</Typography>
        </View>

        <View style={styles.badgesContainer}>
          {concepts.slice(0, 4).map((concept, index) => {
            return (
              <View
                key={`concept-${index}`}
                style={[styles.badge, { backgroundColor: theme.colors.accent }]}>
                <Typography style={[styles.badgeText, { color: theme.colors.accentForeground }]}>
                  {concept}
                </Typography>
              </View>
            );
          })}
          {concepts.length > 4 && (
            <View style={[styles.badge, styles.moreBadge]}>
              <Typography style={[styles.badgeText, styles.moreText]}>
                +{concepts.length - 4} more
              </Typography>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

OutlineCard.displayName = 'OutlineCard';

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  confidenceLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  confidenceValue: {
    color: '#FF6B6B',
    fontWeight: '700',
  },
  studyButton: {
    backgroundColor: '#2C2C2C',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  moreBadge: {
    backgroundColor: '#E0E0E0',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moreText: {
    color: '#666',
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  description: {
    fontSize: 14,
    flex: 1,
    paddingRight: 16,
    lineHeight: 20,
  },
});
