/**
 * public/ 폴더 파일 경로를 배포 base 경로에 맞춰 변환한다.
 * 예) publicUrl('images/main.jpg') → '/marry-jimin/images/main.jpg' (GitHub Pages)
 */
export const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
