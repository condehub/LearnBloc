import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

interface HeatmapProps {
  activity: { date: string; count: number }[];
}

const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-vertical: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
`;

const DayBox = styled.View<{ intensity: number }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${({ theme, intensity }) => {
    if (intensity === 0) return theme.colors.border;
    if (intensity === 1) return theme.colors.primaryLight;
    if (intensity === 2) return theme.colors.primary;
    return theme.colors.primaryDark;
  }};
`;

// Simple 30-day heatmap generator
export const ActivityHeatmap: React.FC<HeatmapProps> = ({ activity }) => {
  // Generate last 30 days
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const record = activity.find(a => a.date.startsWith(dateStr));
    const count = record ? record.count : 0;
    
    let intensity = 0;
    if (count > 0 && count <= 2) intensity = 1;
    else if (count > 2 && count <= 5) intensity = 2;
    else if (count > 5) intensity = 3;

    return { dateStr, intensity };
  });

  return (
    <Container>
      <Title>Atividade Recente</Title>
      <Grid>
        {days.map((day, i) => (
          <DayBox key={i} intensity={day.intensity} />
        ))}
      </Grid>
    </Container>
  );
};
