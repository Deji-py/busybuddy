import { Stack } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import CourseCard from '../components/CourseCard';
import Typography from '@/components/ui/Typography';
import SheetModal from '@/components/ui/SheetModal';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import Input from '@/components/ui/Input';
import useSheet from '@/hooks/useSheet';
import { FileUploader } from '@/components/ui/FileUploader';
import { router } from 'expo-router';

type CourseType = {
  title: string;
  description: string;
  fileType: 'pdf' | 'image';
  progress: number;
  readyText: 'ready' | 'in progress' | 'not ready';
};

const EmptyCourses = () => {
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
      <Svg width="78" height="78" viewBox="0 0 78 78" fill="none">
        <Path
          d="M57.0765 29.9715L55.367 32.9875C53.7582 35.8248 52.9522 37.2418 51.2005 37.3653C49.4455 37.4888 48.7045 36.4748 47.2193 34.4468C45.5682 32.1751 44.5093 29.5279 44.1383 26.7443C43.7905 24.1475 43.6183 22.8508 43.1958 22.2105C42.5263 21.1933 41.1743 20.6343 40.1668 20.0428C37.5115 18.4828 36.1823 17.7028 35.8345 16.3735C35.4835 15.0508 36.2505 13.6988 37.7845 10.9948C39.3185 8.29076 40.0855 6.93876 41.3887 6.58451C42.6887 6.22701 44.0213 7.01026 46.6765 8.57026C47.684 9.16501 48.8345 10.0718 50.037 10.1563C50.791 10.2083 51.9838 9.71101 54.366 8.71976C56.9216 7.6498 59.7102 7.25798 62.4617 7.58226C64.9317 7.87801 66.1667 8.02751 66.9337 9.62976C67.7072 11.2385 66.9013 12.6555 65.2925 15.4928L63.583 18.5023M57.0765 29.9715L58.487 30.8003C59.2274 31.2338 60.0468 31.5153 60.8973 31.6282C61.7479 31.741 62.6124 31.683 63.4402 31.4575C64.268 31.232 65.0425 30.8436 65.7183 30.315C66.3941 29.7863 66.9576 29.1282 67.3758 28.379C68.2413 26.859 68.4766 25.0603 68.0313 23.3688C67.5859 21.6773 66.4953 20.2277 64.9935 19.331L63.583 18.5023M57.0765 29.9715L63.583 18.5023M22.75 42.25C22.75 43.9739 22.0652 45.6272 20.8462 46.8462C19.6272 48.0652 17.9739 48.75 16.25 48.75C14.5261 48.75 12.8728 48.0652 11.6538 46.8462C10.4348 45.6272 9.75 43.9739 9.75 42.25C9.75 40.5261 10.4348 38.8728 11.6538 37.6538C12.8728 36.4348 14.5261 35.75 16.25 35.75C17.9739 35.75 19.6272 36.4348 20.8462 37.6538C22.0652 38.8728 22.75 40.5261 22.75 42.25Z"
          stroke="black"
          strokeOpacity="0.5"
          strokeWidth="2"
        />
        <Path
          d="M19.5 39L42.25 22.75"
          stroke="black"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <Path
          d="M22.75 71.5H45.5M19.5 48.75L35.75 71.5"
          stroke="black"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
      <Typography
        type="h5"
        style={{
          fontFamily: 'Figtree_700Bold',
          marginTop: 18,
        }}>
        No study history yet
      </Typography>
      <Typography color="#10101080">You can start by adding a course below</Typography>
    </View>
  );
};

const MyCoursesView = () => {
  const [course, setCourse] = useState<CourseType[]>([
    {
      title: 'Mathematics',
      description: 'Mathematics is the study of numbers, shapes, and patterns.',
      fileType: 'pdf',
      progress: 0,
      readyText: 'ready',
    },
  ]);
  const { ref, open } = useSheet();

  return (
    <View style={{ flex: 1, width: '100%' }}>
      {course.length > 0 ? (
        <View style={{ flex: 1 }}>
          <Stack gap="xs" spacingHorizontal="sm">
            {course.map((item, index) => (
              <CourseCard
                onPress={() => router.push('/course/1')}
                key={index}
                title={item.title}
                description={item.description}
                fileType={item.fileType}
                progress={item.progress}
                readyText={item.readyText}
              />
            ))}
          </Stack>
        </View>
      ) : (
        <EmptyCourses />
      )}

      <View style={{ width: '100%', paddingHorizontal: 16, paddingVertical: 24 }}>
        <Button onPress={() => open()} iconLeft={<Plus color={'#fff'} />} title="Add New Course" />
      </View>

      {/* Upload Course Modal */}
      <SheetModal enableOverDrag={false} ref={ref}>
        <BottomSheetView>
          <Stack spacingHorizontal="sm" spacingBottom="xl" gap="sm">
            <Input placeholder="Course Name" />
            <FileUploader />
            <Button title="Add Course" />
          </Stack>
        </BottomSheetView>
      </SheetModal>
    </View>
  );
};

export default MyCoursesView;
