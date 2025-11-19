// Base API Response Wrapper
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Request Types
export interface CreateLinkRequest {
  targetUrl: string;
  code?: string;
}

// Data Types
export interface Link {
  code: string;
  targetUrl: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export interface LinkStats {
  code: string;
  shortenUrl: string;
  targetUrl: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export interface HealthCheck {
  ok: boolean;
  version: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

// Response Types
export type CreateLinkResponse = ApiResponse;
export type GetLinksResponse = ApiResponse<Link[]>;
export type GetLinkStatsResponse = ApiResponse<LinkStats>;
export type DeleteLinkResponse = ApiResponse;
export type HealthCheckResponse = ApiResponse<HealthCheck>;
