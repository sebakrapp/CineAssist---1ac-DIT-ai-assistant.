export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  isError?: boolean;
  image?: string; // Base64 data URI
  sources?: Array<{
    uri: string;
    title: string;
  }>;
}

export interface CameraPreset {
  id: string;
  name: string;
  manufacturer: string;
  color: string; // Hex code for UI accents
  keywords: string[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentInput: string;
}

export enum ModelType {
  BASIC = 'gemini-2.5-flash',
  ADVANCED = 'gemini-3-pro-preview',
}

export interface CameraSetup {
  id: string;
  name: string; // e.g., "A-Cam Stunt", "B-Cam Low Light"
  camera: string; // e.g., "Sony Venice 2"
  fps: string;
  shutter: string; // Angle or Speed
  iso: string; // or EI
  wb: string;
  resolution: string;
  codec: string;
  lens: string;
  notes?: string;
  dateCreated: number; // timestamp
}