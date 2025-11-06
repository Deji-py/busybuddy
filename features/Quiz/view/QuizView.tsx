import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
} from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { RadioGroupComponent, RadioOption } from '@/components/ui/RadioGroup';
import { theme } from '@/theme';

const { width } = Dimensions.get('window');

// Types
interface MultiChoiceQuestion {
  id: number;
  question: string;
  type: 'multichoice';
  options: RadioOption[];
  correctAnswer: string;
}

interface VoiceQuestion {
  id: number;
  question: string;
  type: 'voice';
  correctAnswer: string;
}

interface TextQuestion {
  id: number;
  question: string;
  type: 'text';
  correctAnswer: string;
}

type QuizQuestion = MultiChoiceQuestion | VoiceQuestion | TextQuestion;

interface QuizViewProps {
  quizData?: QuizQuestion[];
  onQuizComplete?: (score: number, total: number) => void;
  onQuizExit?: () => void;
}

interface AnswersMap {
  [key: number]: string | null;
}

// Default Quiz Data
const DEFAULT_QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is Compilation process, and its ability to compile',
    type: 'voice',
    correctAnswer: 'compilation is the process',
  },
  {
    id: 2,
    question: 'Which of the following is a programming language?',
    type: 'multichoice',
    options: [
      { id: '1', label: 'JavaScript', value: 'JavaScript' },
      { id: '2', label: 'HTML', value: 'HTML' },
      { id: '3', label: 'CSS', value: 'CSS' },
      { id: '4', label: 'XML', value: 'XML' },
    ],
    correctAnswer: 'JavaScript',
  },
  {
    id: 3,
    question: 'Explain the concept of object-oriented programming',
    type: 'text',
    correctAnswer: 'OOP is a programming paradigm',
  },
  {
    id: 4,
    question: 'What does API stand for?',
    type: 'multichoice',
    options: [
      { id: '1', label: 'Application Programming Interface', value: 'API' },
      { id: '2', label: 'Advanced Programming Integration', value: 'API' },
      { id: '3', label: 'Application Process Interface', value: 'API' },
      { id: '4', label: 'Automated Programming Index', value: 'API' },
    ],
    correctAnswer: 'Application Programming Interface',
  },
  {
    id: 5,
    question: 'Describe what a database is',
    type: 'text',
    correctAnswer: 'A database is an organized collection',
  },
];

const QuizViewContent: React.FC<{
  quiz: QuizQuestion[];
  currentQuestion: number;
  setCurrentQuestion: (q: number) => void;
  answers: AnswersMap;
  setAnswers: React.Dispatch<React.SetStateAction<AnswersMap>>;
  setShowResults: (s: boolean) => void;
  onQuizExit?: () => void;
  onQuizComplete?: (score: number, total: number) => void;
}> = ({
  quiz,
  currentQuestion,
  setCurrentQuestion,
  answers,
  setAnswers,
  setShowResults,
  onQuizExit,
  onQuizComplete,
}) => {
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [voiceText, setVoiceText] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const question: QuizQuestion = quiz[currentQuestion];
  const progress: number = ((currentQuestion + 1) / quiz.length) * 100;

  // Helper type guards
  const isMultiChoiceQuestion = (q: QuizQuestion): q is MultiChoiceQuestion =>
    q.type === 'multichoice';

  const isVoiceQuestion = (q: QuizQuestion): q is VoiceQuestion => q.type === 'voice';

  const isTextQuestion = (q: QuizQuestion): q is TextQuestion => q.type === 'text';

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
      } catch (error) {
        console.error('Error setting audio mode:', error);
      }
    };
    initializeAudio();
  }, []);

  const handleRecordingStart = async (): Promise<void> => {
    try {
      if (!recorderState.canRecord) {
        const { granted } = await requestRecordingPermissionsAsync();
        if (!granted) {
          return;
        }
      }

      if (!recorderState.isRecording) {
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
      } else {
        await audioRecorder.stop();
        setVoiceText('Compilation is the process of converting source code into executable code');
        setAnswers(
          (prev: AnswersMap): AnswersMap => ({
            ...prev,
            [currentQuestion]:
              'Compilation is the process of converting source code into executable code',
          })
        );
      }
    } catch (error) {
      console.error('Error with recording:', error);
    }
  };

  const handleRerecord = async (): Promise<void> => {
    try {
      setVoiceText('');
      setAnswers(
        (prev: AnswersMap): AnswersMap => ({
          ...prev,
          [currentQuestion]: null,
        })
      );
      await audioRecorder.prepareToRecordAsync();
    } catch (error) {
      console.error('Error rerecording:', error);
    }
  };

  const handleMultiChoiceAnswer = (option: string): void => {
    setAnswers(
      (prev: AnswersMap): AnswersMap => ({
        ...prev,
        [currentQuestion]: option,
      })
    );
  };

  const handleNext = (): void => {
    if (isTextQuestion(question)) {
      setAnswers(
        (prev: AnswersMap): AnswersMap => ({
          ...prev,
          [currentQuestion]: textAnswer,
        })
      );
    }

    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setVoiceText('');
      setTextAnswer('');
    } else {
      setShowResults(true);
      const finalScore = calculateScore();
      if (onQuizComplete) {
        onQuizComplete(finalScore, quiz.length);
      }
    }
  };

  const calculateScore = (): number => {
    let correct: number = 0;
    quiz.forEach((q: QuizQuestion, idx: number) => {
      if (answers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View>
            <Text style={styles.categoryLabel}>adaptive</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
          <Text style={styles.questionCounter}>
            question: {currentQuestion + 1} of {quiz.length}
          </Text>
        </View>

        {/* Question Meta */}
        <View style={styles.questionMeta}>
          <Text style={styles.questionLabel}>Question {currentQuestion + 1}</Text>
          <Text style={styles.responseType}>
            response type: <Text style={styles.responseTypeValue}>{question.type}</Text>
          </Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>{question.question}</Text>
        </View>
        <Box style={{ flex: 1 }} />
        {/* Answer Input Area */}
        <View style={styles.answerCard}>
          {isVoiceQuestion(question) && (
            <View style={styles.voiceContainer}>
              {!voiceText ? (
                <View style={styles.recordingSection}>
                  <TouchableOpacity
                    style={[
                      styles.micButton,
                      recorderState.isRecording && styles.micButtonRecording,
                    ]}
                    onPress={handleRecordingStart}>
                    <Ionicons
                      name={recorderState.isRecording ? 'mic' : 'mic-outline'}
                      size={48}
                      color={recorderState.isRecording ? '#fff' : '#999'}
                    />
                  </TouchableOpacity>
                  <Text style={styles.recordingText}>
                    {recorderState.isRecording ? 'Recording...' : 'Tap to start recording'}
                  </Text>
                </View>
              ) : (
                <View style={styles.voiceResultSection}>
                  <View style={styles.answerBox}>
                    <Text style={styles.answerText}>{voiceText}</Text>
                  </View>
                  <Button title="Re-answer" onPress={handleRerecord} variant="secondary" />
                </View>
              )}
            </View>
          )}

          {isMultiChoiceQuestion(question) && (
            <RadioGroupComponent
              options={question.options}
              selectedId={selectedOption}
              onSelect={setSelectedOption}
              size="md"
              orientation="vertical"
              itemVariant="card"
            />
          )}

          {isTextQuestion(question) && (
            <TextInput
              style={[styles.textInput, textAnswer ? styles.textInputFocused : {}]}
              placeholder="Type your answer..."
              placeholderTextColor={theme.colors.mutedForeground}
              multiline
              numberOfLines={4}
              value={textAnswer}
              onChangeText={setTextAnswer}
            />
          )}
        </View>

        {/* Next Button */}
        <Button
          title="Next"
          onPress={handleNext}
          //   disabled={!hasAnswer && !isVoiceQuestion(question)}
          variant="primary"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const ResultsScreen: React.FC<{
  quiz: QuizQuestion[];
  answers: AnswersMap;
  onTryAgain: () => void;
  onExit?: () => void;
}> = ({ quiz, answers, onTryAgain, onExit }) => {
  const calculateScore = (): number => {
    let correct: number = 0;
    quiz.forEach((q: QuizQuestion, idx: number) => {
      if (answers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score: number = calculateScore();
  const percentage: number = Math.round((score / quiz.length) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.resultsContainer}
        showsVerticalScrollIndicator={false}>
        {/* Celebration Icon */}
        <View style={styles.celebrationContainer}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
        </View>

        {/* Results Content */}
        <View style={styles.resultsContent}>
          <Text style={styles.resultsTitle}>Quiz Complete</Text>

          {/* Score */}
          <View style={styles.scoreSection}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Your Score</Text>
              <Text style={styles.scoreText}>
                {score}/{quiz.length}
              </Text>
            </View>

            {/* Confidence Circle */}
            <View style={styles.confidenceBox}>
              <View style={styles.confidenceCircle}>
                <Text style={styles.percentageText}>{percentage}%</Text>
              </View>
              <Text style={styles.confidenceLabel}>Confidence Rate</Text>
            </View>
          </View>

          {/* Today's Summary */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Today&apso;s summary</Text>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryText}>
                Last Score:{' '}
                <Text style={styles.summaryValue}>
                  {score}/{quiz.length}
                </Text>
              </Text>
              <Text style={styles.summaryText}>
                concept understanding: <Text style={styles.summaryValue}>{percentage}%</Text>
              </Text>
              <Text style={styles.summaryText}>
                accuracy: <Text style={styles.summaryValue}>{percentage}%</Text>
              </Text>
            </View>
          </View>

          {/* Last summary */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>last summary</Text>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryText}>
                Last Score: <Text style={styles.summaryValue}>40/100</Text>
              </Text>
              <Text style={styles.summaryText}>
                concept understanding: <Text style={styles.summaryValue}>50%</Text>
              </Text>
              <Text style={styles.summaryText}>
                accuracy: <Text style={styles.summaryValue}>60%</Text>
              </Text>
            </View>
          </View>

          {/* Motivational Message */}
          <View style={styles.motivationalBox}>
            <Text style={styles.motivationalEmoji}>📚</Text>
            <Text style={styles.motivationalText}>
              You are doing a very good job, you can continue studying to increase your knowledge.
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <Button title="Keep Studying" onPress={onTryAgain} variant="primary" />
      </ScrollView>
    </SafeAreaView>
  );
};

const QuizView: React.FC<QuizViewProps> = ({
  quizData = DEFAULT_QUIZ_DATA,
  onQuizComplete,
  onQuizExit,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const quiz: QuizQuestion[] = quizData;

  const handleTryAgain = (): void => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    return (
      <ResultsScreen
        quiz={quiz}
        answers={answers}
        onTryAgain={handleTryAgain}
        onExit={onQuizExit}
      />
    );
  }

  return (
    <QuizViewContent
      quiz={quiz}
      currentQuestion={currentQuestion}
      setCurrentQuestion={setCurrentQuestion}
      answers={answers}
      setAnswers={setAnswers}
      setShowResults={setShowResults}
      onQuizExit={onQuizExit}
      onQuizComplete={onQuizComplete}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#Fff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    marginBottom: 12,
  },
  tab: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  tabActive: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 8,
  },
  progressSection: {
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#EFEFEF',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
  },
  questionCounter: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
  },
  questionMeta: {
    marginBottom: 8,
  },
  questionLabel: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
  },
  responseType: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  responseTypeValue: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    lineHeight: 26,
  },
  answerCard: {
    borderRadius: 12,
    marginBottom: 32,
  },
  voiceContainer: {
    alignItems: 'center',
  },
  recordingSection: {
    alignItems: 'center',
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  micButtonRecording: {
    backgroundColor: '#FF4444',
    borderColor: '#FF4444',
  },
  recordingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  voiceResultSection: {
    width: '100%',
  },
  answerBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  answerText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  optionSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  optionDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 10,
  },
  optionDotSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  optionTextSelected: {
    color: '#fff',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#000',
    textAlignVertical: 'top',
    minHeight: 100,
    backgroundColor: '#F9FAFB',
  },
  textInputFocused: {
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  buttonBase: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: '#1F1F1F',
  },
  buttonSecondary: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextPrimary: {
    color: '#fff',
  },
  buttonTextSecondary: {
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  footerText: {
    fontSize: 11,
    color: '#FF4444',
    fontWeight: '600',
  },
  footerLink: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '600',
  },
  // Results Screen
  resultsContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultsContent: {
    flex: 1,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  celebrationEmoji: {
    fontSize: 48,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreBox: {
    flex: 1,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000',
  },
  confidenceBox: {
    flex: 1,
    alignItems: 'center',
  },
  confidenceCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#059669',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#999',
  },
  summaryBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  summaryContent: {
    gap: 6,
  },
  summaryText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  summaryValue: {
    fontWeight: '600',
    color: '#000',
  },
  motivationalBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  motivationalEmoji: {
    fontSize: 20,
  },
  motivationalText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    flex: 1,
  },
});

export default QuizView;
