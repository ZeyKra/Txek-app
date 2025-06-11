import { useTheme } from '@react-navigation/native';
import type React from 'react';
import { 
  TextInput, 
  StyleSheet, 
  View, 
  useColorScheme
} from 'react-native';
import type { TextInputProps } from 'react-native';

interface UserInputProps extends TextInputProps {
  backgroundColor?: string;
  backgroundFadeColor?: string; 
  outlineColor?: string;
  outlineFadeColor?: string;
  inputType?: 'email' | 'password' | 'text';
}

const UserInput: React.FC<UserInputProps> = ({
  placeholder = 'Joueur x',
  value,
  onChangeText,
  style = {},
  backgroundColor = 'white',
  backgroundFadeColor = 'red',
  outlineColor = 'yellow',
  outlineFadeColor = 'green',
  inputType = 'text',
  ...otherProps
}) => {
  // Configure input properties based on type
  const getInputProps = () => {
    switch (inputType) {
      case 'email':
        return {
          keyboardType: 'email-address' as const,
          autoCapitalize: 'none' as const,
          autoCorrect: false,
        };
      case 'password':
        return {
          secureTextEntry: true,
          autoCapitalize: 'none' as const,
          autoCorrect: false,
        };
      default:
        return {};
    }
  };

  return (
    <View style={styles.container} testID='UserInput'>
      {/* Main outline shadow layer */}
      <View style={[
        styles.outlineShadow,
        { backgroundColor: outlineFadeColor }
      ]}>
        {/* Main outline layer */}
        <View style={[
          styles.outline,
          { borderColor: outlineColor }
        ]}>
          {/* Mauvais code a cause d'un bug react native et les shadow buggés*/}
            <View style={[{
                  backgroundColor: backgroundColor,
                  borderRadius: 8,
                  marginBottom: 1.5,
                  shadowColor: backgroundFadeColor,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity :11,
                  shadowRadius: 0,
                  elevation: 3,
            }]}>
            <TextInput testID='UserInput-TextInput'
              style={[styles.input, [{ outline: 'none'},{ backgroundColor: backgroundColor }], style]}
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              placeholderTextColor="#999"
              {...getInputProps()}
              {...otherProps}
            />
            </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginVertical: 8,
  },
  outlineShadow: {
    borderRadius: 12,
  },
  outline: {
    borderWidth: 3,
    borderRadius: 12,
    backgroundColor: '#FFF',
    transform: [{ translateY: -4 }],
    borderStyle: 'solid',
  },
  innerShadow: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 1.5,
    shadowColor: 'red',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity :11,
    shadowRadius: 0,
    elevation: 3,
  },
  input: {
    height: 40,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFF',
    minWidth: 200,
    color: '#333',
  },
});

export default UserInput;