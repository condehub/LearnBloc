import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Map as MapIcon, ChevronRight } from 'lucide-react-native';
import { api } from '../../src/api/client';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const TrailCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  margin: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  flex-direction: row;
  align-items: center;
`;

const IconContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.primaryLight}30;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const Info = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function TrailsScreen() {
  const router = useRouter();
  
  const { data: trails, isLoading } = useQuery({
    queryKey: ['trails'],
    queryFn: () => api.get('/trails'),
  });

  if (isLoading) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4338ca" />
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={trails}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/trail/${item.id}`)}>
            <TrailCard>
              <IconContainer>
                <MapIcon color="#4338ca" size={24} />
              </IconContainer>
              <Info>
                <Title>{item.title}</Title>
                <Description numberOfLines={2}>{item.description}</Description>
              </Info>
              <ChevronRight color="#94a3b8" size={20} />
            </TrailCard>
          </TouchableOpacity>
        )}
      />
    </Container>
  );
}
