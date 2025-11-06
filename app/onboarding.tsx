import { Container } from '@/components/layout/Container';
// import BusyBot from '../assets/busybot.svg';
import { Stack } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { SCREEN_WIDTH } from '@/lib/constants';
import { setOnboarded } from '@/lib/util';
import { spacing } from '@/theme/spacing';
import { router } from 'expo-router';
import { Image, View } from 'react-native';
import BusyBot from '../assets/busybot.svg';
import GreatQuote from '@/components/shared/GreatQuote';

const OnboardingPage = () => {
  return (
    <Container>
      <Stack gap="xs">
        <BusyBot />
        <Typography style={{ paddingRight: '10%', marginTop: spacing.lg }} type="h2">
          Hey there! I’m BusyBuddy AI, your study sidekick.
        </Typography>
        <Typography style={{ paddingRight: 20, color: '#1E1E1E70' }} type="h4">
          Let’s ace those exams
        </Typography>
      </Stack>
      <Stack spacingVertical="2xl">
        <GreatQuote />
      </Stack>
      <View style={{ flex: 1 }}>
        <Image
          style={{
            width: SCREEN_WIDTH,
            height: 200,
            position: 'absolute',
            left: -25,
            bottom: '20%',
          }}
          source={require('../assets/aimage.png')}
        />
      </View>
      <Stack gap="md" spacingTop="md">
        <Button
          title="Let's go"
          variant="primary"
          onPress={() => {
            setOnboarded();
            router.replace('/(auth)/signup');
          }}
        />
        <Button
          title="Log in"
          variant="secondary"
          onPress={() => {
            setOnboarded();
            router.replace('/');
          }}
        />
      </Stack>
    </Container>
  );
};

export default OnboardingPage;
