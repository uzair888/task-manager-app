import { useRouter } from "next/navigation";

export const fetchWithAuth = async (url: string, options = {}) => {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    ...options,
  });

  // Redirect to login if unauthorized
  if (response.status === 401) {
    const router = useRouter();
    router.push("/login");
    return null;
  }
  return response;
};
