import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';

interface TxekButtonProps {
  onPress: () => void;
  text: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  custom?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  buttonColor?: string;
  buttonShadowColor?: string;
  testID?: string; // Ajouter cette prop
}

export const TxekButton = ({
  onPress,
  text,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  buttonColor,
  buttonShadowColor,
  testID, // Ajouter ici
}: TxekButtonProps) => {
  return (
    <TouchableOpacity
      testID={testID || 'TxekButton'} // Utiliser testID personnalisé ou par défaut
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        styles[variant],
        styles[size],
        (buttonColor && buttonShadowColor) && { backgroundColor: buttonColor, borderColor: buttonShadowColor },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`], textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E03C38',
    padding: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    color: 'white',
    borderBottomWidth: 5,
    borderColor: '#CB1612',
    transform: [{ translateY: -4 }],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: .3,
    shadowRadius: 4,
    elevation: 8,
    marginVertical: 3, // Added margin between buttons
  },

  // Variant styles
  primary: {
    backgroundColor: '#E03C38',
    borderColor: '#CB1612',
  },
  secondary: {
    backgroundColor: '#56BB4F',
    borderColor: '#40853B',
  },
  danger: {
    backgroundColor: '#DDBF5C',
    borderColor: '#A99349',
  },
  
  // Size styles
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  
  // Text base style
  text: {
    fontFamily: 'FeatherBold',
    fontWeight: 'bold',
  },
  
  // Text variant styles
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#ffffff',
  },
  dangerText: {
    color: '#ffffff',
  },
  
  // Text size styles
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Disabled state
  disabled: {
    opacity: 0.6,
    backgroundColor: '#777777',
    borderColor: '#373737',
  },
});

export default TxekButton;
