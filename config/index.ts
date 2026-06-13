type Env = "PROD" | "dev";
export const API_BASE_URL = "http://192.168.29.193:8000/api/v1"
export const env: Env = process.env.NODE_ENV === "production" ? "PROD" : "dev";
export const LocalhostUrl = "http://192.168.29.193:3000"
export const GoogleClientId = "574386738080-2e3d9rocmup7g73nlo8dqt6pj3b7ohql.apps.googleusercontent.com"
export const WEB_CLIENT_ID = '574386738080-lgu7oa370e7hnk0td05tv9vh9i311d6h.apps.googleusercontent.com'
export const ANDRIOND_CLIENT_ID = process.env.ANDRIOND_CLIENT_ID
export const IOS_CLIENT_ID = "574386738080-5jbpti4d2tfe1mg4gsg41nb9vbkth5kk.apps.googleusercontent.com"
export const QwenModelDowloadUrl = "https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf"
export const SmolVLM2ModelDownloadUrl = "https://huggingface.co/ggml-org/SmolVLM2-500M-Video-Instruct-GGUF/resolve/main/SmolVLM2-500M-Video-Instruct-Q8_0.gguf"
export const SmolVLM2ModelDownloadUrl2 = "https://huggingface.co/ggml-org/SmolVLM2-500M-Video-Instruct-GGUF/resolve/main/mmproj-SmolVLM2-500M-Video-Instruct-Q8_0.gguf"