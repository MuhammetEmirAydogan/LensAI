import { app, httpServer } from './app';
import './workers/video.worker';

// app.ts'den export edilen httpServer'ı başlat
// Bu dosya sadece entry point olarak kullanılır
export { app, httpServer };
