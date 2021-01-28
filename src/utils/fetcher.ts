interface FetchParams {
  credentials?: RequestCredentials;
  dataType?: string;
  headers?: HeadersInit;
  method?: string;
  cors?: boolean;
  body?: BodyInit | object;
  rawBody?: boolean;
}

type GetParams = FetchParams & {
  body?: object;
  rawBody?: undefined;
};

const NO_CONTENT = 204;
const INTERNAL_SERVER_ERROR = 500;

export function parseStackTrace(stackTrace: string): string {
  try {
    const message = /<p><b>Message<\/b>([^<]*)/.exec(stackTrace);
    if (message) {
      return message[1];
    }
    const result = /Exception: (.*)/.exec(stackTrace);
    return result ? result[1] : '';
  } catch {
    return stackTrace;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stringifyWithUndefined = (obj: any): string => {
  let item = obj;
  if (typeof obj === 'boolean') {
    item = JSON.stringify(obj);
  }
  // tslint:disable-next-line no-null-keyword
  return JSON.stringify(item, (k, v) => (v === undefined ? null : v));
};
// eslint-disable-next-line arrow-parens
export const parseWithoutNulls = <T = never>(value: string): T => {
  return JSON.parse(value, (k, v) => (v === null ? undefined : v));
};

class Fetcher {
  public post<TResult = void>(url: string, params: FetchParams = {}): Promise<TResult> {
    params.method = 'post';
    return this.query(url, params);
  }

  public delete<TResult = void>(url: string, params: GetParams = {}): Promise<TResult> {
    params.method = 'delete';
    return this.query(url, params);
  }

  public get<TResult = void>(url: string, params: GetParams = {}): Promise<TResult> {
    params.method = 'get';
    return this.query(url, params);
  }

  public query<TResult = void>(url: string, params: FetchParams = {}): Promise<TResult> {
    if (!url) {
      throw new Error('>>> CANNOT CALL FETCH() WITHOUT PASSED URL');
    }
    let encodedUrl = url;
    if (!params.method || ['get', 'delete'].includes(params.method)) {
      encodedUrl = this.encodeParamsInUrl(url, params.body as object);
      delete params.body;
      params.rawBody = true;
    }
    const computedParams = this.getParameters(params);
    return fetch(encodedUrl, computedParams)
      .then((response) => {
        if (response.status === NO_CONTENT) {
          return;
        }
        if (response.status === INTERNAL_SERVER_ERROR) {
          return response.text().then((text) => {
            throw new Error(parseStackTrace(text));
          });
        }
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          if (params.dataType && params.dataType !== 'json') {
            return response[params.dataType]();
          }
          return response.text().then(parseWithoutNulls);
        }
        return response[params.dataType ?? 'text']();
      });
  }

  private getParameters(
    {
      credentials,
      headers = {},
      cors,
      body,
      method = 'get',
      rawBody,
    }: FetchParams,
  ): RequestInit {
    const contentTypeHeader = 'content-type';
    if (!headers[contentTypeHeader] && !rawBody) {
      // eslint-disable-next-line no-param-reassign
      headers[contentTypeHeader] = 'application/json';
    }
    return {
      method,
      headers: new Headers(headers),
      mode: cors ? 'cors' : undefined,
      body: rawBody ? body as BodyInit : stringifyWithUndefined(body),
      credentials,
    };
  }

  private encodeParamsInUrl(
    url: string,
    body: object | undefined,
  ): string {
    if (body) {
      const searchParams = new URLSearchParams(Object.entries(body));
      return `${url}?${searchParams}`;
    }
    return url;
  }
}

export const fetcher = new Fetcher();
