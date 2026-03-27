import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/features/candidate/profile/services/profileApi";
import type { CandidateProfilePayload } from "@/features/candidate/profile/types/profile.types";
/**
 * Fetch candidate profile
 */
export const useCandidateProfileQuery = () => {
  return useQuery({
    queryKey: ["candidate", "profile"],
    queryFn: () => profileApi.getProfile(),
  });
};

/**
 * Update candidate profile
 */
export const useUpdateCandidateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CandidateProfilePayload) =>
      profileApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate", "profile"] });
    },
  });
};
