import type { Report } from '../types/report';

const API_BASE_URL = 'http://localhost:3000/api';

export const reportsApi = {
  async getAll(): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/reports`);
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  },

  async getOne(id: string): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`);
    if (!response.ok) throw new Error('Failed to fetch report');
    return response.json();
  },

  async create(text: string): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Failed to submit report');
    return response.json();
  },
};
