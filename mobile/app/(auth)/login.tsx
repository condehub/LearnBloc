import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { api } from '../../src/api/client';
import { useAuthStore } from '../../src/store/useAuthStore';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const Content = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl}px;
  justify-content: center;
`;

const Header = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xxl}px;
  align-items: center;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.h1.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const Form = styled.View`
  width: 100%;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

const FooterText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
`;

const FooterLink = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
`;

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      await login(response.token, response.user);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Erro no login', error.error || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Content>
            <Header>
              <Title>LearnBloc</Title>
              <Subtitle>Sua jornada de aprendizado em blocos começa aqui.</Subtitle>
            </Header>

            <Form>
              <Input
                label="E-mail"
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <Input
                label="Senha"
                placeholder="Sua senha secreta"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              
              <Button 
                title="Entrar" 
                onPress={handleLogin} 
                isLoading={isLoading} 
                style={{ marginTop: 16 }}
              />
            </Form>

            <Footer>
              <FooterText>Ainda não tem conta? </FooterText>
              <FooterLink onPress={() => router.push('/(auth)/register')}>
                Cadastre-se
              </FooterLink>
            </Footer>
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
