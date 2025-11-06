import { ReactNode, forwardRef } from 'react';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet';
import { useTheme } from '@/context/theme-provider';
import { spacing } from '@/theme/spacing';

interface SheetModalProps extends Omit<BottomSheetModalProps, 'children'> {
  children: ReactNode | ReactNode[];
  showBackdrop?: boolean;
  snapIndex?: number;
  disableDragToClose?: boolean;
}

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0} // or the index where the backdrop should appear
    disappearsOnIndex={-1} // or the index where the backdrop should disappear
    opacity={0.5}
    pressBehavior="close"
    style={{ backgroundColor: 'rgba(0,0,0,1)' }}
  />
);

const SheetModal = forwardRef<BottomSheetModal, SheetModalProps>(
  (
    { children, onChange, detached, showBackdrop = true, disableDragToClose, snapIndex, ...props },
    ref
  ) => {
    const { theme } = useTheme();
    return (
      <BottomSheetModal
        ref={ref}
        index={snapIndex}
        enableDynamicSizing={snapIndex === undefined}
        onChange={onChange}
        enablePanDownToClose={!disableDragToClose}
        backdropComponent={showBackdrop ? renderBackdrop : undefined}
        detached={detached}
        bottomInset={detached ? spacing['2xl'] : undefined}
        backgroundStyle={{
          backgroundColor: theme.colors.background,
          marginHorizontal: detached ? spacing.base : undefined,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.muted,
        }}
        {...props}>
        {children}
      </BottomSheetModal>
    );
  }
);

SheetModal.displayName = 'SheetModal';

export default SheetModal;
