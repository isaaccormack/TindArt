const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = 'ca-central-1';

export function S3_URL(file: string) {
  return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${file}`;
}
