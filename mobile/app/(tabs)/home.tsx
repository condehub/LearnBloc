import React from 'react';
import { ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useQuery } from '@tanstack/react-query';
import { Flame, Star, Award } from 'lucide-react-native';
import { api } from '../../src/api/client';
import { useAuthStore } from '../../src/store/useAuthStore';
import { ActivityHeatmap } from '../../src/components/dashboard/ActivityHeatmap';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
`;

const Greeting = styled.Text`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.textInverse};
`;

const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StatCard = styled.View`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  flex: 1;
  margin-horizontal: 4px;
`;

const StatValue = styled.Text`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textInverse};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StatLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.small.fontSize}px;
  color: ${({ theme }) => theme.colors.textInverse};
  opacity: 0.8;
`;

const Content = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin-vertical: ${({ theme }) => theme.spacing.md}px;
`;

const BadgeList = styled.ScrollView`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const BadgeItem = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-right: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  width: 120px;
`;

const BadgeIconContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const BadgeName = styled.Text`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

export default function HomeScreen() {
  const { user } = useAuthStore();

  const { data: activityData, isLoading, refetch } = useQuery<any>({
    queryKey: ['activity'],
    queryFn: () => api.get('/user/activity'),
  });

  if (!user) return null;

  return (
    <Container>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <Header>
          <Greeting>Olá, {user.name.split(' ')[0]}!</Greeting>
          <StatsContainer>
            <StatCard>
              <Star color="#fbbf24" size={24} />
              <StatValue>Nvl {user.level}</StatValue>
              <StatLabel>{user.xp} XP</StatLabel>
            </StatCard>
            <StatCard>
              <Flame color="#ef4444" size={24} />
              <StatValue>{user.streak}</StatValue>
              <StatLabel>Dias seguidos</StatLabel>
            </StatCard>
            <StatCard>
              <Award color="#34d399" size={24} />
              <StatValue>{activityData?.badges?.length || 0}</StatValue>
              <StatLabel>Conquistas</StatLabel>
            </StatCard>
          </StatsContainer>
        </Header>

        <Content>
          {isLoading ? (
            <ActivityIndicator size="large" color="#4338ca" style={{ marginTop: 40 }} />
          ) : (
            <>
              {activityData?.logs && (
                <ActivityHeatmap activity={activityData.logs} />
              )}

              {activityData?.badges && activityData.badges.length > 0 && (
                <>
                  <SectionTitle>Últimas Conquistas</SectionTitle>
                  <BadgeList horizontal showsHorizontalScrollIndicator={false}>
                    {activityData.badges.map((badgeObj: any) => (
                      <BadgeItem key={badgeObj.badge.id}>
                        <BadgeIconContainer>
                          <Award color="#fff" size={24} />
                        </BadgeIconContainer>
                        <BadgeName>{badgeObj.badge.name}</BadgeName>
                      </BadgeItem>
                    ))}
                  </BadgeList>
                </>
              )}
            </>
          )}
        </Content>
      </ScrollView>
    </Container>
  );
}
