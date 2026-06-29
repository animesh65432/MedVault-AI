type Env = "PROD" | "dev";
export const API_BASE_URL = "http://192.168.29.193:8000/api/v1"
export const env: Env = process.env.NODE_ENV === "production" ? "PROD" : "dev";
export const LocalhostUrl = "http://192.168.29.193:3000"
export const GoogleClientId = "574386738080-2e3d9rocmup7g73nlo8dqt6pj3b7ohql.apps.googleusercontent.com"
export const WEB_CLIENT_ID = '574386738080-lgu7oa370e7hnk0td05tv9vh9i311d6h.apps.googleusercontent.com'
export const ANDRIOND_CLIENT_ID = process.env.ANDRIOND_CLIENT_ID
export const IOS_CLIENT_ID = "574386738080-5jbpti4d2tfe1mg4gsg41nb9vbkth5kk.apps.googleusercontent.com"
export const QwenLanguageModelUrl = "https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/main/gemma-2-2b-it-Q5_K_M.gguf"
export const ScanImageUrl = "https://text-ocr.kiranduttta234.workers.dev"
export const MakeclassifymedicalUrl = "https://makeclassifymedical.kiranduttta234.workers.dev"
export const CheckIsMedicalRealatedOrNot = "https://checkmedicalrealtedornot.kiranduttta234.workers.dev"
export const MakeMedicalDataJsonUrl = "https://makemedicaldatajsonurl.kiranduttta234.workers.dev"
export const API_KEY_SCANIMAGEURL = "medvault-secret-123"
export const API_KEY = "medvault-secret-123";