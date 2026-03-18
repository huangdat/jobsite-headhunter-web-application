import type { UserDetail } from "../../types/user.types";
import { useEffect, useState } from "react";

export const useUserDetail = (userId: string) => {
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockUser: UserDetail = {
        id: userId,
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+123 456 7890",
        company: null,
        bio: "Experienced system administrator managing cloud infrastructure.",
        username: "jdoe_admin",
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: "2023-01-12T14:32:00",
        loginHistory: [
          {
            id: 1,
            loginAt: "2023-10-24T09:15:00",
            ip: "192.168.1.45",
            device: "Chrome (MacOS)",
            location: "San Francisco, US",
            status: "SUCCESS",
          },
          {
            id: 2,
            loginAt: "2023-10-21T11:20:00",
            ip: "110.45.21.9",
            device: "Firefox (Windows)",
            location: "New York, US",
            status: "FAILED",
          },
        ],
      };

      setData(mockUser);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [userId]);

  return { data, loading, error };
};
