import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../services/api/dashboard';
import type { TimeRange, TrendGranularity, SortBy } from '../types/dashboard';

export const useDashboardStats = (timeRange?: TimeRange) => {
  return useQuery({
    queryKey: ['dashboard', 'stats', timeRange],
    queryFn: () => dashboardService.getQuickStats(timeRange),
    staleTime: 30000, // 30秒
    refetchInterval: 60000, // 每分钟自动刷新
  });
};

export const useConversionData = (timeRange?: TimeRange) => {
  return useQuery({
    queryKey: ['dashboard', 'conversion', timeRange],
    queryFn: () => dashboardService.getConversionData(timeRange),
    staleTime: 60000, // 1分钟
  });
};

export const useTrendData = (granularity: TrendGranularity = 'daily') => {
  return useQuery({
    queryKey: ['dashboard', 'trends', granularity],
    queryFn: () => dashboardService.getTrendData(granularity),
    staleTime: 300000, // 5分钟（趋势数据变化较慢）
  });
};

export const useProductRanking = (limit = 10, timeRange?: TimeRange) => {
  return useQuery({
    queryKey: ['dashboard', 'products', 'rank', limit, timeRange],
    queryFn: () => dashboardService.getProductRanking(limit, timeRange),
    staleTime: 300000, // 5分钟
  });
};

export const usePendingTasks = (filters?: { timeRange?: TimeRange; sortBy?: SortBy }) => {
  return useQuery({
    queryKey: ['dashboard', 'tasks', filters],
    queryFn: () => dashboardService.getPendingTasks(filters),
    staleTime: 10000, // 10秒（任务需要及时更新）
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      dashboardService.updateTaskStatus(taskId, status),
    onMutate: async (_variables) => {
      // 乐观更新
      await queryClient.cancelQueries({ queryKey: ['dashboard', 'tasks'] });
      const previousTasks = queryClient.getQueryData(['dashboard', 'tasks']);

      queryClient.setQueryData(['dashboard', 'tasks'], (old: any) => {
        return old?.map((task: any) =>
          task.id === _variables.taskId
            ? { ...task, status: _variables.status }
            : task
        );
      });

      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      // 回滚
      queryClient.setQueryData(['dashboard', 'tasks'], context?.previousTasks);
    },
    onSettled: () => {
      // 重新获取
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
};
