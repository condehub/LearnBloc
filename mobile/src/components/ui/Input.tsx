import React from 'react';
import styled from 'styled-components/native';
import { TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const Container = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  width: 100%;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledInput = styled.TextInput<{ hasError?: boolean }>`
  background-color: ${({ theme }) => theme.colors.background};
  border-width: 1px;
  border-color: ${({ theme, hasError }) => (hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
`;

const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.small.fontSize}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <StyledInput hasError={!!error} placeholderTextColor="#94a3b8" {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};
