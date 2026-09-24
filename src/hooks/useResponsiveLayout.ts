import { useWindowDimensions } from 'react-native';

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const isTablet = width >= 768;
  const columns = width >= 768 ? 3 : width >= 540 ? 2 : 1;

  const cardGap = 14;
  const horizontalPadding = 16;

  const totalGaps = cardGap * (columns - 1);
  const totalPadding = horizontalPadding * 2;
  const cardWidth = Math.floor((width - totalPadding - totalGaps) / columns);

  return {
    width,
    height,
    isLandscape,
    isTablet,
    columns,
    cardWidth,
    cardGap,
    horizontalPadding,
  };
}
