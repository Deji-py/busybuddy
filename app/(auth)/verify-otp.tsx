/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container } from '@/components/layout/Container';
import { Box, Stack } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';
import Typography from '@/components/ui/Typography';
import { theme } from '@/theme';
import { spacing } from '@/theme/spacing';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import GreatQuote from '@/components/shared/GreatQuote';

const VerifyOTPPage = ({ email = 'adebay***@gmail.com' }) => {
  const otpRef = useRef<OtpInputRef>(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // API call to verify OTP
      // const response = await verifyOTPAPI(otp);
      // if (response.success) {
      //   router.replace('/(auth)/home');
      // } else {
      //   setError('Invalid OTP. Please try again.');
      //   otpRef.current?.clear();
      // }

      // Mock verification
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.replace('/setup');
    } catch (err: any) {
      setError('Verification failed. Please try again.');
      otpRef.current?.clear();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (canResend) {
      setResendTimer(60);
      setCanResend(false);
      setOtp('');
      otpRef.current?.clear();
      // API call to resend OTP
      // await resendOTPAPI(email);
    }
  };

  return (
    <Container>
      <Stack gap="lg" style={{ flex: 1 }}>
        {/* Mail Icon */}
        <View style={{ alignItems: 'center', paddingTop: spacing.xl }}>
          <Svg width="80" height="80" viewBox="0 0 68 68" fill="none">
            <Path
              d="M19.8334 24.0833L28.169 29.0133C33.0282 31.8863 34.969 31.8863 39.831 29.0133L48.1667 24.0833"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M5.712 38.182C5.89616 46.8661 5.98966 51.2096 9.19416 54.4255C12.3987 57.6441 16.8583 57.7546 25.7805 57.9785C31.2772 58.1201 36.7228 58.1201 42.2195 57.9785C51.1417 57.7546 55.6013 57.6441 58.8058 54.4255C62.0103 51.2096 62.1038 46.8661 62.2908 38.182C62.3475 35.3883 62.3475 32.6116 62.2908 29.818C62.1038 21.1338 62.0103 16.7903 58.8058 13.5745C55.6013 10.3558 51.1417 10.2453 42.2195 10.0215C36.7407 9.88322 31.2593 9.88322 25.7805 10.0215C16.8583 10.2453 12.3987 10.3558 9.19416 13.5745C5.98966 16.7903 5.89616 21.1338 5.70916 29.818C5.64952 32.6057 5.65235 35.3943 5.712 38.182Z"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </Svg>
        </View>

        {/* Heading */}
        <Stack gap="sm" style={{ alignItems: 'center' }}>
          <Typography type="h2" style={{ textAlign: 'center' }}>
            Verify Email Address
          </Typography>
          <Typography
            type="body"
            color={theme.colors.mutedForeground}
            style={{ textAlign: 'center' }}>
            We have sent an otp to {email}
          </Typography>
        </Stack>

        {/* OTP Input */}
        <View
          style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.lg }}>
          <OtpInput
            ref={otpRef}
            numberOfDigits={6}
            autoFocus={true}
            focusColor={error ? theme.colors.error : theme.colors.primary}
            onTextChange={(text: any) => {
              setOtp(text);
              if (error) setError('');
            }}
            onFilled={() => {
              // Auto-verify on fill can be enabled here
              // handleVerifyOTP();
            }}
            blurOnFilled={false}
            disabled={loading}
            hideStick={false}
            type="numeric"
            theme={{
              containerStyle: {
                width: 'auto',
                gap: spacing.xs,
                justifyContent: 'center',
              },
              pinCodeContainerStyle: {
                height: 52,
                width: 52,
                borderRadius: 12,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: error ? theme.colors.error : theme.colors.border,
              },
              pinCodeTextStyle: {
                fontSize: 24,
                color: theme.colors.foreground,
                fontFamily: 'Inter_600SemiBold',
              },
              focusStickStyle: {
                backgroundColor: error ? theme.colors.error : theme.colors.primary,
                width: 2,
                height: 26,
              },
              focusedPinCodeContainerStyle: {
                borderWidth: 1,
                borderColor: error ? theme.colors.error : theme.colors.secondary,
                backgroundColor: 'transparent',
              },
              filledPinCodeContainerStyle: {
                borderColor: error ? theme.colors.error : theme.colors.secondary,
                backgroundColor: 'transparent',
              },
              disabledPinCodeContainerStyle: {
                opacity: 0.6,
                backgroundColor: 'transparent',
              },
            }}
          />
        </View>

        {/* Error Message */}
        {error && (
          <Typography
            type="small"
            color={theme.colors.error}
            style={{ textAlign: 'center', marginTop: spacing.sm }}>
            {error}
          </Typography>
        )}

        {/* Verify Button */}
        <Button
          title="Verify OTP"
          variant="primary"
          onPress={handleVerifyOTP}
          loading={loading}
          disabled={otp.length !== 6 || loading}
        />
        {/* Resend Section */}
        <View style={{ alignItems: 'center', paddingTop: spacing.lg }}>
          <TouchableOpacity onPress={canResend ? handleResendOTP : () => {}}>
            <Typography
              type="body"
              color={theme.colors.mutedForeground}
              style={{ textAlign: 'center' }}>
              {!canResend ? ` Resend in ${resendTimer} sec` : 'Resend OTP'}
            </Typography>
          </TouchableOpacity>
        </View>
      </Stack>
      <Box style={{ flex: 1 }} />
      <GreatQuote />
    </Container>
  );
};

export default VerifyOTPPage;
