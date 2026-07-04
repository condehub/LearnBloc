import React, { useState } from 'react';
import { ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { api } from '../../../src/api/client';
import { Button } from '../../../src/components/ui/Button';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const Content = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const QuestionText = styled.Text`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const OptionButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: ${({ theme, isSelected }) => (isSelected ? theme.colors.primaryLight + '20' : theme.colors.background)};
  border-width: 2px;
  border-color: ${({ theme, isSelected }) => (isSelected ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const OptionText = styled.Text<{ isSelected: boolean }>`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme, isSelected }) => (isSelected ? theme.colors.primary : theme.colors.text)};
`;

const Footer = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { data: lesson, isLoading } = useQuery<any>({
    queryKey: ['lesson', id],
    queryFn: () => api.get(`/lessons/${id}`),
  });

  const submitExerciseMutation = useMutation({
    mutationFn: (data: { exerciseId: number; answer: string }) => 
      api.post('/progress/exercise', data),
    onSuccess: () => {
      // Se foi sucesso, avançar para a próxima
      const exercises = lesson.exercises || [];
      if (currentIndex < exercises.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        // Finalizar Lição
        completeLessonMutation.mutate({ lessonId: Number(id) });
      }
    },
    onError: (error: any) => {
      Alert.alert('Resposta Incorreta', error.error || 'Tente novamente.');
      // O usuário pode tentar de novo porque não avançou
    }
  });

  const completeLessonMutation = useMutation({
    mutationFn: (data: { lessonId: number }) => 
      api.post('/progress/lesson', data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      queryClient.invalidateQueries({ queryKey: ['trail'] });
      
      let message = 'Lição concluída!';
      if (data.leveledUp) message += `\nVocê subiu para o nível ${data.newLevel}!`;
      if (data.badgesAwarded?.length > 0) message += `\nVocê ganhou ${data.badgesAwarded.length} nova(s) conquista(s)!`;

      Alert.alert('Parabéns!', message, [
        { text: 'OK', onPress: () => router.replace('/(tabs)/trails') }
      ]);
    }
  });

  if (isLoading || !lesson) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4338ca" />
      </Container>
    );
  }

  const exercises = lesson.exercises || [];
  const currentExercise = exercises[currentIndex];

  if (!currentExercise) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <QuestionText>Nenhum exercício encontrado.</QuestionText>
      </Container>
    );
  }

  const handleNext = () => {
    if (!selectedOption) return;
    submitExerciseMutation.mutate({ 
      exerciseId: currentExercise.id, 
      answer: selectedOption 
    });
  };

  return (
    <Container>
      <Stack.Screen options={{ title: `Exercício ${currentIndex + 1} de ${exercises.length}` }} />
      <ScrollView>
        <Content>
          <QuestionText>{currentExercise.question}</QuestionText>
          
          {currentExercise.options?.map((opt: string, idx: number) => (
            <OptionButton 
              key={idx} 
              isSelected={selectedOption === opt}
              onPress={() => setSelectedOption(opt)}
            >
              <OptionText isSelected={selectedOption === opt}>{opt}</OptionText>
            </OptionButton>
          ))}
        </Content>
      </ScrollView>
      
      <Footer>
        <Button 
          title="Verificar" 
          disabled={!selectedOption}
          isLoading={submitExerciseMutation.isPending || completeLessonMutation.isPending}
          onPress={handleNext} 
        />
      </Footer>
    </Container>
  );
}
