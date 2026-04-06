import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/features/candidate/profile/services/profileApi";
import type { CandidateProfilePayload } from "@/features/candidate/profile/types/profile.types";
import { SEMI_STATIC_DATA_CONFIG } from "@/shared/config/cacheConfig";
import { candidateKeys } from "@/shared/utils/queryKeys";
/**
 * Fetch candidate profile
 * Cache Strategy: SEMI_STATIC_DATA (10 min stale, 30 min cache)
 * Rationale: Profile data updates occasionally when user edits it
 */
export const useCandidateProfileQuery = () => {
  return useQuery({
    queryKey: candidateKeys.profile(),
    queryFn: () => profileApi.getProfile(),
    ...SEMI_STATIC_DATA_CONFIG,
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
      queryClient.invalidateQueries({ queryKey: candidateKeys.profile() });
    },
  });
};
