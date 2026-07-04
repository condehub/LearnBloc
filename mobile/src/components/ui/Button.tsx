import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

const ButtonContainer = styled.TouchableOpacity<{ variant: string }>`
  background-color: ${({ theme, variant }) => {
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return theme.colors.primary;
    }
  }};
  border-width: ${({ variant }) => (variant === 'outline' ? '2px' : '0px')};
  border-color: ${({ theme, variant }) => (variant === 'outline' ? theme.colors.primary : 'transparent')};
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  flex-direction: row;
`;

const ButtonText = styled.Text<{ variant: string }>`
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.textInverse;
    }
  }};
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
`;

export const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', isLoading, ...props }) => {
  return (
    <ButtonContainer variant={variant} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#4338ca' : '#fff'} />
      ) : (
        <ButtonText variant={variant}>{title}</ButtonText>
      )}
    </ButtonContainer>
  );
};
