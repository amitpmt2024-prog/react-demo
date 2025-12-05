import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => {
    // Transform success response to extract data if needed
    if (response.data && typeof response.data === 'object') {
      // If response has the standard format with data field
      if ('data' in response.data && 'success' in response.data) {
        // For login, we need to handle the special case where accessToken might be in data
        if (response.data.data && typeof response.data.data === 'object' && 'accessToken' in response.data.data) {
          return response; // Keep as is for login
        }
      }
    }
    return response;
  },
  (error) => {
    // Only redirect on 401 if not on login page (to allow login errors to be displayed)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/') {
        // Clear tokens and redirect to login only if not already on login page
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  userName?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  user: {
    _id: string;
    email?: string;
    accessToken: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  message: string;
}

export interface CreateMovieRequest {
  title: string;
  publishYear: number;
  imageURL: string;
}

export interface Movie {
  _id: string;
  title: string;
  publishYear: number;
  imageURL: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieResponse {
  movie: Movie;
  message: string;
}

export interface UpdateMovieRequest {
  title?: string;
  publishYear?: number;
  imageURL?: string;
}

export interface UpdateMovieResponse {
  movie: Movie;
  message: string;
}

export interface MoviesListResponse {
  movies: Movie[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  message: string;
}

export interface QueryMoviesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/users/login', credentials);
    
    // Handle transformed response format from NestJS interceptor
    if (response.data && typeof response.data === 'object') {
      // If response is in standard format { success, statusCode, message, data, ... }
      if ('data' in response.data && 'success' in response.data && response.data.success) {
        const userData = response.data.data;
        // accessToken is included in the user object
        if (userData && typeof userData === 'object' && 'accessToken' in userData) {
          return {
            user: userData,
            accessToken: userData.accessToken as string,
            message: response.data.message || 'Login successful',
          };
        }
      }
      // If response is in old format { user, accessToken, message } (fallback)
      if ('user' in response.data && 'accessToken' in response.data) {
        return response.data as LoginResponse;
      }
    }
    
    return response.data as LoginResponse;
  },
};

export const moviesAPI = {
  create: async (movieData: CreateMovieRequest): Promise<CreateMovieResponse> => {
    const response = await api.post<CreateMovieResponse>('/movies', movieData);
    return response.data;
  },
  getList: async (params: QueryMoviesParams = {}): Promise<MoviesListResponse> => {
    const { page = 1, limit = 8, search } = params;
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (search) {
      queryParams.append('search', search);
    }
    
    const response = await api.get(`/movies?${queryParams.toString()}`);
    
    // Handle transformed response format from NestJS interceptor
    if (response.data && typeof response.data === 'object') {
      // If response is in standard format { success, statusCode, message, data, ... }
      if ('data' in response.data && 'success' in response.data && response.data.success) {
        const data = response.data.data;
        if (data && typeof data === 'object') {
          // The data might have { movies, total, page, limit, totalPages, message }
          if ('movies' in data) {
            return data as MoviesListResponse;
          }
        }
      }
      // If response is in old format { movies, total, page, ... } (fallback)
      if ('movies' in response.data) {
        return response.data as MoviesListResponse;
      }
    }
    
    return response.data as MoviesListResponse;
  },
  getOne: async (id: string): Promise<{ movie: Movie; message: string }> => {
    const response = await api.get(`/movies/${id}`);
    
    // Handle transformed response format
    if (response.data && typeof response.data === 'object') {
      if ('data' in response.data && 'success' in response.data && response.data.success) {
        const data = response.data.data;
        if (data && typeof data === 'object' && 'movie' in data) {
          return data as { movie: Movie; message: string };
        }
      }
      if ('movie' in response.data) {
        return response.data as { movie: Movie; message: string };
      }
    }
    
    return response.data as { movie: Movie; message: string };
  },
  update: async (id: string, movieData: UpdateMovieRequest): Promise<UpdateMovieResponse> => {
    const response = await api.patch<UpdateMovieResponse>(`/movies/${id}`, movieData);
    
    // Handle transformed response format
    if (response.data && typeof response.data === 'object') {
      if ('data' in response.data && 'success' in response.data && response.data.success) {
        const data = response.data.data;
        if (data && typeof data === 'object' && 'movie' in data) {
          return data as UpdateMovieResponse;
        }
      }
      if ('movie' in response.data) {
        return response.data as UpdateMovieResponse;
      }
    }
    
    return response.data as UpdateMovieResponse;
  },
};

export default api;

