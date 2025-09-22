/**
 * Безопасный парсер JSON ответов от API
 * Предотвращает ошибки "Unexpected end of JSON input" и "Body is unusable"
 */

export interface SafeFetchOptions {
  credentials?: RequestCredentials;
  cache?: RequestCache;
  headers?: Record<string, string>;
}

export interface SafeFetchResult<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/**
 * Безопасно выполняет fetch запрос и парсит JSON ответ
 */
export async function safeFetchJson<T = any>(
  url: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult<T>> {
  try {
    const response = await fetch(url, {
      credentials: "include",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      return {
        data: null,
        error: `HTTP error! status: ${response.status}`,
        success: false,
      };
    }

    // Проверяем что ответ содержит контент
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        data: null,
        error: `Invalid content type: ${contentType}`,
        success: false,
      };
    }

    // Проверяем что тело ответа не пустое
    const text = await response.text();
    if (!text || text.trim() === "") {
      return {
        data: null,
        error: "Empty response body",
        success: false,
      };
    }

    // Парсим JSON только если есть валидный контент
    const data = JSON.parse(text);
    return {
      data,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    };
  }
}

/**
 * Добавляет timestamp к URL для предотвращения кеширования
 */
export function addCacheBuster(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_cb=${Date.now()}&_force_reload=true`;
}
