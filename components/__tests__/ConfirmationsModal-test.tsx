import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ConfirmationModal from '@/components/ConfirmationModal';

describe('ConfirmationModal', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const mockSetIsVisible = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const propsParDefaut = {
    isVisibile: true,
    setIsVisible: mockSetIsVisible,
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
    message: 'Êtes-vous sûr de vouloir continuer ?'
  };

  it('affiche le modal avec le message', () => {
    const { getByTestId } = render(<ConfirmationModal {...propsParDefaut} />);
    
    expect(getByTestId('confirmation-modal')).toBeTruthy();
    expect(getByTestId('modal-message')).toBeTruthy();
  });

  it('appelle onConfirm et setIsVisible quand le bouton de confirmation est pressé', () => {
    const { getByTestId } = render(<ConfirmationModal {...propsParDefaut} />);
    
    fireEvent.press(getByTestId('confirm-button'));
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockSetIsVisible).toHaveBeenCalledWith(false);
  });

  it('appelle onCancel et setIsVisible quand le bouton d\'annulation est pressé', () => {
    const { getByTestId } = render(<ConfirmationModal {...propsParDefaut} />);
    
    fireEvent.press(getByTestId('cancel-button'));
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockSetIsVisible).toHaveBeenCalledWith(false);
  });

  it('affiche avec du texte personnalisé pour les boutons de confirmation et d\'annulation', () => {
    const { getByTestId } = render(
      <ConfirmationModal 
        {...propsParDefaut} 
        confirmText="Supprimer"
        declineText="Annuler"
      />
    );
    
    expect(getByTestId('confirm-button')).toBeTruthy();
    expect(getByTestId('cancel-button')).toBeTruthy();
  });

  it('ne s\'affiche pas quand isVisibile est false', () => {
    const { queryByTestId } = render(
      <ConfirmationModal {...propsParDefaut} isVisibile={false} />
    );
    
    expect(queryByTestId('modal-message')).toBeNull();
  });

  it('affiche le message correct dans le modal', () => {
    const messagePersonnalise = 'Voulez-vous vraiment supprimer cet élément ?';
    const { getByTestId } = render(
      <ConfirmationModal {...propsParDefaut} message={messagePersonnalise} />
    );
    
    expect(getByTestId('modal-message')).toHaveTextContent(messagePersonnalise);
  });

  it('utilise les textes par défaut "Oui" et "Non" quand aucun texte personnalisé n\'est fourni', () => {
    const { getByTestId } = render(<ConfirmationModal {...propsParDefaut} />);
    
    const boutonConfirm = getByTestId('confirm-button');
    const boutonCancel = getByTestId('cancel-button');
    
    expect(boutonConfirm).toBeTruthy();
    expect(boutonCancel).toBeTruthy();
  });
});