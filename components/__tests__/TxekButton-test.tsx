import { render } from '@testing-library/react-native';
import TxekButton from '@/components/TxekButton';

describe('TxekButton', () => {
  it("Le boutton s'affiche correctement", () => {
    const { getByTestId } = render(<TxekButton text="Test Button" onPress={() => {}} />);
    const button = getByTestId('TxekButton'); 
    expect(button).toBeTruthy();
  });

  it("Affiche le bon text", () => {
    const { getByText } = render(<TxekButton text="Test Button" onPress={() => {}} />);
    const buttonText = getByText('Test Button');
    expect(buttonText).toBeTruthy();
  });

  it("gère correctement l'état désactivé (disabled)", () => {
    const { getByTestId } = render(<TxekButton text="Test Button" onPress={() => {}} disabled={true} />);
    const button = getByTestId('TxekButton');  // Update this line
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it("applique les styles personnalisés lorsqu\'ils sont fournis", () => {
    const customStyle = { backgroundColor: "red" };
    const { getByTestId } = render(
      <TxekButton text="Test Button" onPress={() => {}} style={customStyle} />
    );
    const button = getByTestId('TxekButton');
    
    expect(button).toHaveStyle({ backgroundColor: "red" })
  });
});
