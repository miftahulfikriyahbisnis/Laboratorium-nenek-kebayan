// Google Sheets API Integration Service (OAuth 2.0 Client-side Bearer Token)

export interface SheetRowData {
  timestamp: string;
  studentName: string;
  missionsCompleted: string; // e.g. "4/4 (100%)"
  mission1Attempts: number;
  mission2Attempts: number;
  mission3Attempts: number;
  mission4Attempts: number;
  totalTimeMinutes: string;
  status: string; // "Lulus Sempurna (Master Tabib)" or "Dalam Proses"
}

// Master Google Sheet ID provided by teacher
export const DEFAULT_MASTER_SHEET_ID = '142_OaLbxy1JB6wOzF7dPEDozjnqZ9RrccVc9r_731EM';

// Client ID injected or configured from Google Cloud Console project
const GOOGLE_CLIENT_ID = '691938506794-oauth.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient: any = null;
let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

export const GoogleSheetsService = {
  getStoredSheetId(): string {
    return localStorage.getItem('NENEK_KEBAYAN_GOOGLE_SHEET_ID') || DEFAULT_MASTER_SHEET_ID;
  },

  setStoredSheetId(sheetId: string) {
    localStorage.setItem('NENEK_KEBAYAN_GOOGLE_SHEET_ID', sheetId);
  },

  resetToMasterSheetId(): string {
    localStorage.setItem('NENEK_KEBAYAN_GOOGLE_SHEET_ID', DEFAULT_MASTER_SHEET_ID);
    return DEFAULT_MASTER_SHEET_ID;
  },

  getStoredToken(): string | null {
    if (cachedAccessToken && Date.now() < tokenExpiresAt) {
      return cachedAccessToken;
    }
    const stored = localStorage.getItem('NENEK_KEBAYAN_OAUTH_TOKEN');
    const expires = Number(localStorage.getItem('NENEK_KEBAYAN_OAUTH_EXPIRES') || 0);
    if (stored && Date.now() < expires) {
      cachedAccessToken = stored;
      tokenExpiresAt = expires;
      return stored;
    }
    return null;
  },

  clearToken() {
    cachedAccessToken = null;
    tokenExpiresAt = 0;
    localStorage.removeItem('NENEK_KEBAYAN_OAUTH_TOKEN');
    localStorage.removeItem('NENEK_KEBAYAN_OAUTH_EXPIRES');
  },

  requestToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check existing valid token
      const existing = this.getStoredToken();
      if (existing) {
        return resolve(existing);
      }

      if (typeof window === 'undefined' || !(window as any).google?.accounts?.oauth2) {
        return reject(new Error('Google Identity Services library belum termuat. Pastikan koneksi internet aktif.'));
      }

      try {
        tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: SCOPES,
          callback: (response: any) => {
            if (response.error !== undefined) {
              return reject(response);
            }
            const token = response.access_token;
            const expiresIn = Number(response.expires_in || 3600) * 1000;
            cachedAccessToken = token;
            tokenExpiresAt = Date.now() + expiresIn - 60000; // buffer 1 minute
            localStorage.setItem('NENEK_KEBAYAN_OAUTH_TOKEN', token);
            localStorage.setItem('NENEK_KEBAYAN_OAUTH_EXPIRES', String(tokenExpiresAt));
            resolve(token);
          },
          error_callback: (err: any) => {
            reject(err);
          }
        });

        tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (err) {
        reject(err);
      }
    });
  },

  async appendRows(token: string, spreadsheetId: string, values: any[][]): Promise<any> {
    const range = 'A1';
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Gagal menambahkan data ke Google Sheet.');
    }

    return await response.json();
  },

  async readSpreadsheet(token: string, spreadsheetId: string): Promise<any[][]> {
    const range = 'A1:I100';
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Gagal membaca isi Google Sheet.');
    }

    const data = await response.json();
    return data.values || [];
  },

  async initializeHeaderIfEmpty(token: string, spreadsheetId: string): Promise<void> {
    const existing = await this.readSpreadsheet(token, spreadsheetId);
    if (!existing || existing.length === 0) {
      await this.appendRows(token, spreadsheetId, [
        [
          'Waktu Selesai',
          'Nama Siswa',
          'Capaian Misi',
          'Percobaan Misi 1 (Pengenceran)',
          'Percobaan Misi 2 (Netralisasi)',
          'Percobaan Misi 3 (Indikator Telang)',
          'Percobaan Misi 4 (Ramuan Pamungkas)',
          'Total Waktu Belajar (Menit)',
          'Status Kelulusan',
        ],
      ]);
    }
  },
};
