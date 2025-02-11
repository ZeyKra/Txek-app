import type React from 'react';
import { 
  TextInput, 
  StyleSheet, 
  View, 
  type TextInputProps 
} from 'react-native';

interface UserInputProps extends TextInputProps {
  outlineColor?: string;
}

const UserInput: React.FC<UserInputProps> = ({
  placeholder = 'Joueur x',
  value,
  onChangeText,
  style = {},
  outlineColor = 'yellow'
}) => {
  return (
    <View style={styles.container}>
      {/* Main outline shadow layer */}
      <View style={[
        styles.outlineShadow,
        { backgroundColor: 'red' }
      ]}>
        {/* Main outline layer */}
        <View style={[
          styles.outline,
          { borderColor: outlineColor }
        ]}>
          {/* Inner white content with shadow */}
          <View style={styles.innerShadow}>
            <TextInput
              style={[styles.input, style]}
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              placeholderTextColor="#999"
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
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