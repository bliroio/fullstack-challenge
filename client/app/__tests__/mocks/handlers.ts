import { http, HttpResponse } from "msw";
const API = "http://localhost:3000/api";

export const handlers = [
  http.get(`${API}/meetings`, () => {
    return HttpResponse.json({
      docs: [],
      totalDocs: 0,
      limit: 10,
      page: 1,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: false,
    });
  }),
];
