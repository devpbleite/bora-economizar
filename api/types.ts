export type ApiRequest<TBody = unknown> = {
  method?: string;
  body?: TBody;
  query?: Record<string, string | string[]>;
};

export type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
};
