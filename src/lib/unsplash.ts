// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || "";
const UNSPLASH_API_URL = "https://api.unsplash.com";

export interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    thumb: string;
    small: string;
  };
  description: string | null;
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
  width: number;
  height: number;
}

export interface UnsplashResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

export const fetchUnsplashImages = async (
  page: number = 1,
  perPage: number = 20
): Promise<UnsplashImage[]> => {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=nature&page=${page}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data: UnsplashResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching Unsplash images:", error);
    // Return empty array on error
    return [];
  }
};

