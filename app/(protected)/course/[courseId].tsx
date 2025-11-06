import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { TabPage } from '@/components/ui/Tabbar';
import { ArrowLeft } from 'lucide-react-native';
import { View, TouchableOpacity } from 'react-native';
import Busybot from '@/assets/busybot.svg';
import { useTheme } from '@/context/theme-provider';
import { Stack } from '@/components/layout/Layout';
import { OutlineCard } from '@/features/Outline/component/OutlineCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import StudyView from '@/features/study/view/StudyView';
import { router } from 'expo-router';
import Chip from '@/components/ui/Chip';
import QuizView from '@/features/Quiz/view/QuizView';

const CourseID = () => {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
        keyboardVerticalOffset={0}>
        <View
          style={{
            backgroundColor: theme.colors.background,
            paddingHorizontal: 16,
            paddingTop: 16,
          }}>
          <Card variant="filled" style={{ paddingBottom: 0 }}>
            <CardHeader
              style={{
                borderBottomWidth: 1,
                borderColor: theme.colors.border,
                paddingBottom: 8,
                borderStyle: 'dashed',
              }}
              leftComponent={
                <TouchableOpacity onPress={() => router.back()}>
                  <ArrowLeft size={20} color="#000" />
                </TouchableOpacity>
              }
              title="Intro to Compiler"
              rightComponent={<Busybot width={28} height={24} />}
            />
            <CardContent style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Chip
                label="Compilation Process and engineering"
                onPress={() => console.log('Pressed')}
                variant="filled"
                size="medium"
                selected={true}
                color="#5500CC"
              />

              {/* <Row gap="sm" style={{ alignItems: 'center', marginTop: 6 }}>
                <Typography
                  type="small"
                  numberOfLines={1}
                  style={{ maxWidth: '60%' }}
                  color={`${theme.colors.mutedForeground}`}>
                  intro to compiler for hnd 2....
                </Typography>

                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme.colors.mutedForeground,
                  }}
                />
                <Typography type="small" color={theme.colors.mutedForeground}>
                  file-type: pdf
                </Typography>
              </Row> */}
            </CardContent>
          </Card>
        </View>
        <TabPage
          style={{ marginTop: 8 }}
          tabs={['Outline', 'Study', 'Quiz']}
          onTabChange={(index) => console.log('Tab:', index)}>
          <Stack gap="xs" spacingHorizontal="sm" style={{ flex: 1, marginTop: 16 }}>
            <OutlineCard
              title="Compilation Process"
              confidenceRate={10}
              concepts={['Lexical', 'Syntax', 'Semantic', 'Optimization', 'orver the air']}
              description="Learn how code is transformed from source to executable form through various compilation stages."
              buttonTitle="Study"
              onPress={() => console.log('Study pressed')}
            />
            <OutlineCard
              title="Compilation Process"
              confidenceRate={10}
              concepts={['Lexical', 'Syntax', 'Semantic', 'Optimization', 'orver the air']}
              description="Learn how code is transformed from source to executable form through various compilation stages."
              buttonTitle="Study"
              onPress={() => console.log('Study pressed')}
            />
          </Stack>

          <StudyView />
          <QuizView />
        </TabPage>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CourseID;
