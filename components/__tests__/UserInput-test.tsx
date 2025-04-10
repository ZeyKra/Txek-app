import { fireEvent, render } from '@testing-library/react-native';
import UserInput from '@/components/UserInput';

describe('Composant UserInput', () => {
  it("S'affiche correctement avec les propriétés par défaut", () => {
    const { getByPlaceholderText } = render(
      <UserInput
        placeholder="Entrez votre email"
        autoCapitalize="none"
        backgroundColor="#fff"
        backgroundFadeColor="#B7AEAE"
        outlineColor="#6E48AD"
        outlineFadeColor="#4E3379"
        onChangeText={(text) => console.log(text)}
      />
    );

    const input = getByPlaceholderText('Entrez votre email');
    expect(input).toBeTruthy();
  });

  it('Possède les bonnes propriétés de style', () => {
    const { getByTestId } = render(
      <UserInput
        placeholder="Entrez votre email"
        autoCapitalize="none"
        backgroundColor="#fff"
        backgroundFadeColor="#B7AEAE"
        outlineColor="#6E48AD"
        outlineFadeColor="#4E3379"
        onChangeText={(text) => console.log(text)}
      />
    );

    const input = getByTestId('UserInput-TextInput');
    expect(input).toHaveStyle({
      backgroundColor: '#fff',
    });
  });

  it('Gère correctement la saisie de texte', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <UserInput
        placeholder="Entrez votre email"
        autoCapitalize="none"
        backgroundColor="#fff"
        backgroundFadeColor="#B7AEAE"
        outlineColor="#6E48AD"
        outlineFadeColor="#4E3379"
        onChangeText={mockOnChangeText}
      />
    );

    const input = getByPlaceholderText('Entrez votre email');
    fireEvent.changeText(input, 'test@example.com');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('test@example.com');
  });
});
