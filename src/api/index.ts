import { BACKEND_API_ROUTES } from '@/constants';
import { api } from '@/lib/axios';
import {
  type CreateLinkRequest,
  type CreateLinkResponse,
  type DeleteLinkResponse,
  type GetLinksResponse,
  type GetLinkStatsResponse,
  type HealthCheckResponse,
} from './types';

export const createLink = (
  data: CreateLinkRequest,
): Promise<CreateLinkResponse> => {
  return api.post(BACKEND_API_ROUTES.CreateLink.Path, data).then(res => res.data);
};

export const getLinks = (): Promise<GetLinksResponse> => {
  return api.get(BACKEND_API_ROUTES.ListLinks.Path).then(res => res.data);
};

export const getLinkStats = (code: string): Promise<GetLinkStatsResponse> => {
  return api
    .get(BACKEND_API_ROUTES.GetLinkStats.Path.replace(':code', code))
    .then(res => res.data);
};

export const deleteLink = (code: string): Promise<DeleteLinkResponse> => {
  return api
    .delete(BACKEND_API_ROUTES.DeleteLink.Path.replace(':code', code))
    .then(res => res.data);
};

export const healthCheck = (): Promise<HealthCheckResponse> => {
  return api.get(BACKEND_API_ROUTES.HealthCheck.Path).then(res => res.data);
};
