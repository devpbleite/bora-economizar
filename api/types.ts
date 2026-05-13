export type ApiRequest<TBody = unknown> = {
  method?: string;
  body?: TBody;
};

export type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string) => void;
};
