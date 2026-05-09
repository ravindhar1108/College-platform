import { useQuery } from "@tanstack/react-query";
import { collegesApi } from "@/lib/api";

export const useColleges = (filters: any) => {
  return useQuery({
    queryKey: ["colleges", filters],
    queryFn: () => collegesApi.getAll(filters),
  });
};

export const useCollege = (id: string | number) => {
  return useQuery({
    queryKey: ["college", id],
    queryFn: () => collegesApi.getById(id),
    enabled: !!id,
  });
};

export const useCompare = (ids: (string | number)[]) => {
  return useQuery({
    queryKey: ["compare", ids],
    queryFn: () => collegesApi.compare(ids),
    enabled: ids.length > 0,
  });
};

export const useCollegeStats = () => {
  return useQuery({
    queryKey: ["college-stats"],
    queryFn: () => collegesApi.getStats(),
  });
};
