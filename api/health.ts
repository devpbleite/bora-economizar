import type { ApiResponse } from "./types";

export default function handler(_request: unknown, response: ApiResponse) {
  response.status(200).json({
    ok: true,
    app: "Bora Economizar",
  });
}
