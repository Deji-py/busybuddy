import { Container } from '@/components/layout/Container';
import { Box, Row, Stack } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { RadioGroupComponent } from '@/components/ui/RadioGroup';
import Typography from '@/components/ui/Typography';
import { spacing } from '@/theme/spacing';
import { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '@/context/theme-provider';
import BusyBot from '../../assets/busybot.svg';
import { useAudioPlayer } from 'expo-audio';
import { SCREEN_WIDTH } from '@/lib/constants';
import { router } from 'expo-router';

const HurraySound = require('../../assets/sounds/cheering.mp3');

interface QuizData {
  examType?: string;
  mainGoal?: string;
  studyPreference?: string;
  confidence?: string;
  challenge?: string;
}

const QUIZ_STEPS = [
  {
    id: 'examType',
    title: 'Which exam are you preparing for?',
    question: 'Which exam are you preparing for?',
    options: [
      { id: 'university', label: 'University/ Polytechnic Exam', value: 'university' },
      { id: 'professional', label: 'Professional / Certification Exam', value: 'professional' },
    ],
  },
  {
    id: 'mainGoal',
    title: "What's your main goal?",
    question: "What's your main goal?",
    options: [
      { id: 'good_grades', label: 'Pass with good grades', value: 'good_grades' },
      { id: 'top_score', label: 'Get a top score / distinction', value: 'top_score' },
      { id: 'weak_subjects', label: 'Improve weak subjects', value: 'weak_subjects' },
      {
        id: 'build_confidence',
        label: 'Build confidence & consistency',
        value: 'build_confidence',
      },
    ],
  },
  {
    id: 'studyPreference',
    title: 'How do you prefer to study?',
    question: 'How do you prefer to study?',
    options: [
      { id: 'reading', label: 'Reading summaries & notes', value: 'reading' },
      { id: 'past_questions', label: 'Practicing past questions', value: 'past_questions' },
      { id: 'lessons', label: 'Watching lessons or tutorials', value: 'lessons' },
      { id: 'quizzes', label: 'Interactive quizzes & games', value: 'quizzes' },
    ],
  },
  {
    id: 'confidence',
    title: 'How confident do you feel about your exam prep right now?',
    question: 'How confident do you feel about your exam prep right now?',
    options: [
      { id: 'very_confident', label: 'Very confident', value: 'very_confident' },
      { id: 'somewhat_ready', label: 'Somewhat ready', value: 'somewhat_ready' },
      { id: 'unsure', label: 'A bit unsure', value: 'unsure' },
      { id: 'not_confident', label: 'Not confident yet', value: 'not_confident' },
    ],
  },
  {
    id: 'challenge',
    title: "What's your biggest challenge with studying?",
    question: "What's your biggest challenge with studying?",
    options: [
      { id: 'staying_consistent', label: 'Staying consistent', value: 'staying_consistent' },
      {
        id: 'difficult_topics',
        label: 'Understanding difficult topics',
        value: 'difficult_topics',
      },
      { id: 'time_management', label: 'Time management', value: 'time_management' },
      { id: 'distractions', label: 'Distractions / focus', value: 'distractions' },
      { id: 'motivation', label: 'Lack of Motivation', value: 'motivation' },
    ],
  },
];

const SuccessScreen = ({ onComplete }: { onComplete: () => void }) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const Player = useAudioPlayer(HurraySound);

  useEffect(() => {
    playSound();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 1.2,
      }),
    ]).start();

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    setTimeout(() => {
      onComplete();
    }, 3500);
  }, []);

  const playSound = async () => {
    try {
      Player.play();
    } catch (error) {
      console.log('Sound play error:', error);
    }
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <Container
        style={{
          paddingTop: spacing.xl,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Stack gap="lg" style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          {/* Confetti Animation */}
          <LottieView
            source={require('../../assets/animations/confetti.json')}
            autoPlay
            loop={false}
            style={{
              width: SCREEN_WIDTH,
              height: 400,
              position: 'absolute',
              top: -50,
            }}
          />

          {/* Success Icon with Animation */}
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              zIndex: 10,
            }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 60,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 10,
                borderColor: `${theme.colors.secondary}20`,
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: theme.colors.secondary,
                  borderRadius: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 10,
                  borderColor: `${theme.colors.secondary}20`,
                }}>
                <Typography type="h1" color="#fff" style={{ fontSize: 40 }}>
                  ✓
                </Typography>
              </View>
            </View>
          </Animated.View>

          {/* Success Text */}
          <Typography
            type="h2"
            color={theme.colors.foreground}
            style={{ textAlign: 'center', marginTop: spacing.xl, zIndex: 10 }}>
            Well Done! Friend
          </Typography>

          <Typography
            type="body"
            color={theme.colors.mutedForeground}
            style={{
              textAlign: 'center',
              zIndex: 10,
              paddingHorizontal: spacing['2xl'],
            }}>
            You did a very good job, Please wait while we prepare your experience
          </Typography>

          {/* Loading Indicator */}
        </Stack>
        {!isLoading && (
          <View
            style={{
              marginBottom: spacing.xl,
              zIndex: 10,
              position: 'absolute',
              bottom: spacing.lg,
            }}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}
      </Container>
    </Animated.View>
  );
};

const OnboardingQuizScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const step = QUIZ_STEPS[currentStep];
  const progress = (currentStep + 1) / QUIZ_STEPS.length;
  const isLastStep = currentStep === QUIZ_STEPS.length - 1;

  const handleNext = () => {
    if (!selectedOption) return;

    // Save current selection
    setQuizData({
      ...quizData,
      [step.id]: selectedOption,
    });

    // Move to next step or finish
    if (isLastStep) {
      handleFinish();
    } else {
      setCurrentStep(currentStep + 1);
      setSelectedOption('');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedOption(quizData[step.id as keyof QuizData] || '');
    }
  };

  const handleFinish = () => {
    // Log final quiz data
    const finalData = {
      ...quizData,
      [step.id]: selectedOption,
    };

    console.log('Final Quiz Data:', finalData);

    // Show success modal
    setShowSuccessModal(true);
  };

  const handleSuccessComplete = () => {
    setShowSuccessModal(false);
    // Navigate to home or next screen
    router.replace('/home');
  };

  if (showSuccessModal) {
    return <SuccessScreen onComplete={handleSuccessComplete} />;
  }

  return (
    <Container style={{ paddingTop: spacing.lg }}>
      <Stack gap="lg" spacingTop="lg" style={{ flex: 1 }}>
        {/* Header Section */}
        <Stack gap="sm" style={{ alignItems: 'center' }}>
          <BusyBot />
          <Typography type="h3" style={{ textAlign: 'center', marginTop: spacing.md }}>
            {step.title}
          </Typography>
        </Stack>

        {/* Progress Bar */}
        <ProgressBar
          progress={progress}
          size="sm"
          variant="default"
          showPercentage={false}
          helperText="Before we dive in please kindly answer a few questions"
        />

        {/* Radio Group */}
        <View style={{ flex: 1, marginTop: spacing.lg }}>
          <RadioGroupComponent
            options={step.options}
            selectedId={selectedOption}
            onSelect={setSelectedOption}
            size="md"
            orientation="vertical"
            itemVariant="card"
          />
        </View>

        {/* Action Buttons */}
        <Row
          gap="sm"
          style={{
            justifyContent: 'space-between',
            marginTop: spacing.lg,
          }}>
          {currentStep > 0 ? (
            <Button
              title="Back"
              variant="secondary"
              onPress={handleBack}
              disabled={currentStep === 0}
              style={{ paddingHorizontal: 60, height: 50 }}
            />
          ) : (
            <Box />
          )}

          <Button
            title={isLastStep ? 'Finish' : 'Next'}
            variant="primary"
            onPress={handleNext}
            disabled={!selectedOption}
            style={{ paddingHorizontal: 60, height: 50 }}
          />
        </Row>
      </Stack>
    </Container>
  );
};

export default OnboardingQuizScreen;
