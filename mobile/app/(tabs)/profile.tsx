import React from 'react';
import styled from 'styled-components/native';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Button } from '../../src/components/ui/Button';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
`;

const Avatar = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const AvatarText = styled.Text`
  font-size: 36px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textInverse};
`;

const Name = styled.Text`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Email = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <Container>
      <Content>
        <Avatar>
          <AvatarText>{user.name.charAt(0).toUpperCase()}</AvatarText>
        </Avatar>
        <Name>{user.name}</Name>
        <Email>{user.email}</Email>
        
        <Button 
          title="Sair" 
          variant="outline" 
          onPress={() => logout()} 
          style={{ width: '100%', marginTop: 32 }}
        />
      </Content>
    </Container>
  );
}
