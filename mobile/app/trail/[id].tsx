import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Lock, Unlock, CheckCircle } from 'lucide-react-native';
import { api } from '../../src/api/client';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderInfo = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.textInverse};
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textInverse};
  opacity: 0.9;
`;

const LessonCard = styled.View<{ isLocked: boolean; isCompleted: boolean }>`
  background-color: ${(props: any) => (props.isLocked ? props.theme.colors.background : props.theme.colors.surface)};
  margin: ${(props: any) => props.theme.spacing.sm}px ${(props: any) => props.theme.spacing.md}px;
  border-radius: ${(props: any) => props.theme.borderRadius.md}px;
  padding: ${(props: any) => props.theme.spacing.md}px;
  border-width: 1px;
  border-color: ${(props: any) => (props.isCompleted ? props.theme.colors.success : props.theme.colors.border)};
  flex-direction: row;
  align-items: center;
  opacity: ${(props: any) => (props.isLocked ? 0.6 : 1)};
`;

const IconContainer = styled.View<{ isLocked: boolean; isCompleted: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props: any) => {
    if (props.isCompleted) return props.theme.colors.success + '30';
    if (props.isLocked) return props.theme.colors.border;
    return props.theme.colors.primaryLight + '30';
  }};
  align-items: center;
  justify-content: center;
  margin-right: ${(props: any) => props.theme.spacing.md}px;
`;

const LessonInfo = styled.View`
  flex: 1;
`;

const LessonTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const LessonOrder = styled.Text`
  font-size: ${({ theme }) => theme.typography.small.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function TrailDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { data: trail, isLoading } = useQuery<any>({
    queryKey: ['trail', id],
    queryFn: () => api.get(`/trails/${id}`),
  });

  if (isLoading || !trail) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4338ca" />
      </Container>
    );
  }

  return (
    <Container>
      <Stack.Screen options={{ title: 'Trilha' }} />
      <FlatList
        ListHeaderComponent={
          <HeaderInfo>
            <Title>{trail.name}</Title>
            <Description>{trail.description}</Description>
          </HeaderInfo>
        }
        data={trail.lessons}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => {
          const isLocked = item.isLocked;
          const isCompleted = item.isCompleted;

          return (
            <TouchableOpacity 
              disabled={isLocked}
              onPress={() => router.push(`/lesson/${item.id}`)}
            >
              <LessonCard isLocked={isLocked} isCompleted={isCompleted}>
                <IconContainer isLocked={isLocked} isCompleted={isCompleted}>
                  {isCompleted ? (
                    <CheckCircle color="#10b981" size={20} />
                  ) : isLocked ? (
                    <Lock color="#94a3b8" size={20} />
                  ) : (
                    <Unlock color="#4338ca" size={20} />
                  )}
                </IconContainer>
                <LessonInfo>
                  <LessonTitle>{item.title}</LessonTitle>
                  <LessonOrder>Lição {item.order}</LessonOrder>
                </LessonInfo>
              </LessonCard>
            </TouchableOpacity>
          );
        }}
      />
    </Container>
  );
}
