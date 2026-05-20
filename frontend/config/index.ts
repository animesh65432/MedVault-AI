type Env = "PROD" | "dev";
export const API_BASE_URL = "http://10.0.2.2:8000"
export const env: Env = process.env.NODE_ENV === "production" ? "PROD" : "dev";
export const LocalhostUrl = "http://192.168.29.193:3000"
export const GoogleClientId = "574386738080-2e3d9rocmup7g73nlo8dqt6pj3b7ohql.apps.googleusercontent.com"
export const WEB_CLIENT_ID = '574386738080-lgu7oa370e7hnk0td05tv9vh9i311d6h.apps.googleusercontent.com'
export const ANDRIOND_CLIENT_ID = process.env.ANDRIOND_CLIENT_ID
export const IOS_CLIENT_ID = "574386738080-3u6eq2q8uqhjrumqldeufe71ucc7lg7b.apps.googleusercontent.com"