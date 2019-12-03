export const GCP_PROJECT_ID = "seng350f19-project-team-3-1";
export const BUCKET_NAME = "majabris";
export const CLOUD_CREDENTIAL_FILE = "./src/seng350f19-project-team-3-1-5df5aeb4df61.json";

export function GCP_URL(file: string) {
  return `https://storage.googleapis.com/${BUCKET_NAME}/${file}`;
}
