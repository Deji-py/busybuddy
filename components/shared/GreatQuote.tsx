import { View, Image } from 'react-native';
import Typography from '../ui/Typography';
import { Card, CardFooter } from '../ui/Card';
import { Row } from '../layout/Layout';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/context/theme-provider';

const GreatQuote = () => {
  const { theme } = useTheme();
  return (
    <Card variant="filled">
      <Typography
        type="h6"
        color="#000000"
        style={{ lineHeight: 25, fontFamily: 'Figtree_6,00SemiBold', paddingRight: 20 }}>
        The beautiful thing about learning is nobody can take it away from you
      </Typography>
      <CardFooter
        style={{
          paddingTop: spacing.md,
          borderStyle: 'dashed',
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          marginTop: spacing.lg,
        }}>
        <Row gap="sm">
          <View
            style={{
              width: 30,
              height: 30,
              backgroundColor: 'white',
              borderRadius: 100,
              overflow: 'hidden',
            }}>
            <Image
              style={{ width: '100%', height: '100%' }}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUDOahYIwrACE3t6rNZDKG33fABISL2QYh4Q&s"
            />
          </View>
          <Typography type="h6" color="#00000090" style={{ fontFamily: 'Figtree_700Bold' }}>
            BB. King
          </Typography>
        </Row>
      </CardFooter>
    </Card>
  );
};

export default GreatQuote;
