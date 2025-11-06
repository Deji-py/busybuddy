import { Row, Stack } from '@/components/layout/Layout';
import CircularProgress from '@/components/ui/CircularProgress';
import Typography from '@/components/ui/Typography';
import { useTheme } from '@/context/theme-provider';
import { spacing } from '@/theme/spacing';
import { useMemo } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

interface CourseCardProps {
  /**
   * Course title
   */
  title: string;

  /**
   * Course description/subtitle
   */
  description: string;

  /**
   * File type (e.g., "pdf", "video")
   */
  fileType: string;

  /**
   * Progress percentage (0-100)
   */
  progress?: number;

  /**
   * Ready status text
   */
  readyText?: string;

  /**
   * Card background color
   */
  backgroundColor?: string;

  /**
   * On card press callback
   */
  onPress?: () => void;

  /**
   * Additional container style
   */
  style?: ViewStyle;
}

/**
 * CourseCard - Course card with circular progress indicator
 *
 * @example
 * <CourseCard
 *   title="Introduction to Compiler"
 *   description="intro to compiler for hnd 2...."
 *   fileType="pdf"
 *   progress={50}
 * />
 */
const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  fileType,
  progress = 0,
  readyText = 'ready',
  backgroundColor,
  onPress,
  style,
}) => {
  const { theme } = useTheme();

  const progressColor = useMemo(() => {
    if (progress === 0) return '#ef4444';
    if (progress < 50) return '#f59e0b';
    if (progress < 100) return '#10b981';
    return '#10b981';
  }, [progress]);

  const containerStyle: ViewStyle = {
    backgroundColor: backgroundColor || theme.colors.background,
    borderBottomWidth: 0.5,
    borderColor: theme.colors.border,
    paddingVertical: spacing.sm,

    ...style,
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={containerStyle}>
      <Row
        gap="lg"
        style={{ justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8 }}>
        {/* Left Content */}
        <Stack gap="xs" style={{ flex: 1 }}>
          {/* Title */}
          <Typography
            type="h6"
            color={theme.colors.foreground}
            style={{ fontFamily: 'Figtree_600SemiBold' }}>
            {title}
          </Typography>

          {/* Description and File Type */}
          <Row gap="sm" style={{ alignItems: 'center', marginTop: 6 }}>
            <Typography
              type="small"
              numberOfLines={1}
              style={{ maxWidth: '60%' }}
              color={`${theme.colors.mutedForeground}90`}>
              {description}
            </Typography>
            {/* Divider dot */}
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: `${theme.colors.mutedForeground}90`,
              }}
            />
            <Typography type="small" color={`${theme.colors.mutedForeground}90`}>
              file-type: {fileType}
            </Typography>
          </Row>
        </Stack>

        {/* Right Content - Circular Progress */}
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <CircularProgress
            progress={progress / 100}
            size={36}
            strokeWidth={5}
            color={progressColor}
            backgroundColor={`${progressColor}20`}
            showPercentage={true}
            percentageColor={theme.colors.foreground}
            percentageFontSize={10}
          />
          <Typography
            type="small"
            color={theme.colors.mutedForeground}
            style={{ marginTop: spacing.xs }}>
            {readyText}
          </Typography>
        </View>
      </Row>
    </TouchableOpacity>
  );
};

export default CourseCard;

// ================================================================
// USAGE EXAMPLES
// ================================================================

/*
// Example 1: Basic Course Card
<CourseCard
  title="Introduction to Compiler"
  description="intro to compiler for hnd 2...."
  fileType="pdf"
  progress={50}
/>

// Example 2: Different Progress States
<Stack gap="lg">
  <CourseCard
    title="Introduction to Compiler"
    description="intro to compiler for hnd 2...."
    fileType="pdf"
    progress={0}
    readyText="not started"
  />

  <CourseCard
    title="Introduction to Compiler"
    description="intro to compiler for hnd 2...."
    fileType="pdf"
    progress={50}
    readyText="in progress"
  />

  <CourseCard
    title="Introduction to Compiler"
    description="intro to compiler for hnd 2...."
    fileType="pdf"
    progress={100}
    readyText="completed"
  />
</Stack>

// Example 3: With Press Callback
<CourseCard
  title="Introduction to Compiler"
  description="intro to compiler for hnd 2...."
  fileType="pdf"
  progress={75}
  onPress={() => navigation.navigate('CourseDetail')}
/>

// Example 4: Different File Types
<Stack gap="lg">
  <CourseCard
    title="React Native Basics"
    description="Learn the fundamentals..."
    fileType="video"
    progress={40}
  />

  <CourseCard
    title="JavaScript Advanced"
    description="Deep dive into JS concepts..."
    fileType="doc"
    progress={60}
  />

  <CourseCard
    title="Web Development"
    description="HTML, CSS, and JavaScript..."
    fileType="interactive"
    progress={80}
  />
</Stack>

// Example 5: In a List
import { FlatList } from 'react-native';

const courses = [
  {
    id: '1',
    title: 'Introduction to Compiler',
    description: 'intro to compiler for hnd 2....',
    fileType: 'pdf',
    progress: 50,
  },
  {
    id: '2',
    title: 'Advanced Algorithms',
    description: 'Master algorithm concepts...',
    fileType: 'video',
    progress: 75,
  },
  {
    id: '3',
    title: 'Data Structures',
    description: 'Understand data structures...',
    fileType: 'interactive',
    progress: 30,
  },
];

<FlatList
  data={courses}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <CourseCard
      title={item.title}
      description={item.description}
      fileType={item.fileType}
      progress={item.progress}
      onPress={() => console.log('Pressed:', item.id)}
    />
  )}
/>

// Example 6: Custom Colors
<CourseCard
  title="Custom Styled Course"
  description="With custom styling..."
  fileType="pdf"
  progress={65}
  backgroundColor="#f5f5f5"
  style={{ borderColor: '#ddd' }}
/>
*/
