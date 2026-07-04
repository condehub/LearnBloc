import React from 'react';
import { ScrollView, ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { api } from '../../src/api/client';
import { Button } from '../../src/components/ui/Button';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const Content = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const TheoryText = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const Footer = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => api.get(`/lessons/${id}`),
  });

  if (isLoading || !lesson) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4338ca" />
      </Container>
    );
  }

  return (
    <Container>
      <Stack.Screen options={{ title: 'Lição' }} />
      <ScrollView>
        <Content>
          <Title>{lesson.title}</Title>
          <TheoryText>{lesson.content}</TheoryText>
        </Content>
      </ScrollView>
      
      <Footer>
        <Button 
          title="Iniciar Exercícios" 
          onPress={() => router.push(`/lesson/${id}/exercise`)} 
        />
      </Footer>
    </Container>
  );
}
