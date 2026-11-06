import { ref } from 'vue';
import { useAuth } from './useAuth';

export interface MediaFileItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  bucket: string;
  key: string;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  uploadedBy?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MediaStats {
  totalFiles: number;
  totalBytes: number;
  s3Available: boolean;
  bucketName: string;
}

export interface MediaListResponse {
  items: MediaFileItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: MediaStats;
}

export const useMedia = () => {
  const { user } = useAuth();
  const config = useRuntimeConfig();
  const apiBase = config.public?.apiBase || '';

  const loading = ref(false);
  const uploading = ref(false);
  const error = ref<string | null>(null);

  const getAuthToken = (): string | null => {
    if (process.client) {
      return (
        localStorage.getItem('vapelab.auth.token') ||
        localStorage.getItem('vapelab_token') ||
        localStorage.getItem('auth_token') ||
        localStorage.getItem('vapora.auth.token') ||
        null
      );
    }
    return null;
  };

  const getHeaders = (isMultipart = false): Record<string, string> => {
    const headers: Record<string, string> = {};
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  /**
   * Fetch paginated and filtered media files
   */
  const getMediaList = async (params: {
    search?: string;
    type?: string;
    sortBy?: 'createdAt' | 'size' | 'originalName';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  } = {}): Promise<MediaListResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.type && params.type !== 'all') query.append('type', params.type);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.order) query.append('order', params.order);
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());

      const url = `${apiBase}/api/v1/media?${query.toString()}`;
      const res = await fetch(url, {
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`خطا در دریافت لیست رسانه‌ها: ${res.statusText}`);
      }

      const data: MediaListResponse = await res.json();
      return data;
    } catch (err: any) {
      error.value = err.message || 'خطای اتصال به سرور رسانه';
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 24,
        totalPages: 0,
        stats: { totalFiles: 0, totalBytes: 0, s3Available: false, bucketName: 'vapelab-media' },
      };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Upload a single file
   */
  const uploadSingle = async (file: File): Promise<MediaFileItem> => {
    uploading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${apiBase}/api/v1/media/upload`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'خطا در آپلود فایل');
      }

      const uploaded: MediaFileItem = await res.json();
      return uploaded;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      uploading.value = false;
    }
  };

  /**
   * Upload multiple files
   */
  const uploadMultiple = async (files: FileList | File[]): Promise<{ uploaded: MediaFileItem[]; errors: any[] }> => {
    uploading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch(`${apiBase}/api/v1/media/upload-multiple`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'خطا در آپلود گروهی فایل‌ها');
      }

      return await res.json();
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      uploading.value = false;
    }
  };

  /**
   * Delete single media file
   */
  const deleteMedia = async (id: number): Promise<boolean> => {
    loading.value = true;
    try {
      const res = await fetch(`${apiBase}/api/v1/media/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      });
      return res.ok;
    } catch (err: any) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Bulk delete media files
   */
  const bulkDeleteMedia = async (ids: number[]): Promise<number> => {
    loading.value = true;
    try {
      const res = await fetch(`${apiBase}/api/v1/media/bulk-delete`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.deletedCount || 0;
      }
      return 0;
    } catch (err: any) {
      error.value = err.message;
      return 0;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Format file size bytes into readable Persian format (کیلوبایت / مگابایت)
   */
  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes === 0) return '۰ بایت';
    const k = 1024;
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
    return `${val.toLocaleString('fa-IR')} ${sizes[i]}`;
  };

  return {
    loading,
    uploading,
    error,
    getMediaList,
    uploadSingle,
    uploadMultiple,
    deleteMedia,
    bulkDeleteMedia,
    formatBytes,
  };
};

