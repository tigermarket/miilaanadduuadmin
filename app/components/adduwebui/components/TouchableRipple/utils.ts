import type { ColorValue } from 'react-native';

import color from '../../utils/color';

import type { InternalTheme } from '../../types';

const getUnderlayColor = ({
  theme,
  calculatedRippleColor,
  underlayColor,
}: {
  theme: InternalTheme;
  calculatedRippleColor: ColorValue;
  underlayColor?: string;
}) => {
  if (underlayColor != null) {
    return underlayColor;
  }

  
    return color(calculatedRippleColor.toString()).rgb().string();
   

   
};

const getRippleColor = ({
  theme,
  rippleColor,
}: {
  theme: InternalTheme;
  rippleColor?: ColorValue;
}) => {
  if (rippleColor) {
    return rippleColor;
  }

  
    return color(theme.colors.onSurface).alpha(0.12).rgb().string();
 
};

export const getTouchableRippleColors = ({
  theme,
  rippleColor,
  underlayColor,
}: {
  theme: InternalTheme;
  rippleColor?: ColorValue;
  underlayColor?: string;
}) => {
  const calculatedRippleColor = getRippleColor({ theme, rippleColor });
  return {
    calculatedRippleColor,
    calculatedUnderlayColor: getUnderlayColor({
      theme,
      calculatedRippleColor,
      underlayColor,
    }),
  };
};
