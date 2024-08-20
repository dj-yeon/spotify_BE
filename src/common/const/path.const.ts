import { join } from 'path';

// 서버 프로젝트의 루트 폴더(최상단 위치)
export const PROJECT_ROOT_PATH = process.cwd();

// 외부에서 접근 가능한 파일들을 모아둔 폴더 이름
export const PUBLIC_FOLDER_NAME = 'public';

// 실제 공개폴더의 절대경로
// /{프로젝트의 위치}/public
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

// 포스트 이미지들을 저장할 폴더 이름
export const POSTS_IMAGE_FOLDER_NAME = 'posts-image';

// 임시 이미지폴더 이름
export const TEMP_IMAGE_FOLDER_NAME = 'temp-image';

// 포스트 음악을 저장할 폴더 이름
export const POSTS_MUSIC_FOLDER_NAME = 'posts-music';

// 임시 음악 폴더 이름
export const TEMP_MUSIC_FOLDER_NAME = 'temp-music';

// 포스트 이미지를 저장할 폴더
// /{프로젝트의 위치}/public/posts
export const POST_IMAGE_PATH = join(
  PUBLIC_FOLDER_PATH,
  POSTS_IMAGE_FOLDER_NAME,
);

// 포스트 음악 저장할 폴더
export const POST_MUSIC_PATH = join(
  PUBLIC_FOLDER_PATH,
  POSTS_MUSIC_FOLDER_NAME,
);

// 절대경로 NO
// /public/posts/xxx.jpg
export const POST_PUBLIC_IMAGE_PATH = join(
  PUBLIC_FOLDER_NAME,
  POSTS_IMAGE_FOLDER_NAME,
);

// 절대경로 NO
// /public/posts/xxx.jpg
export const POST_PUBLIC_MUSIC_PATH = join(
  PUBLIC_FOLDER_NAME,
  POSTS_MUSIC_FOLDER_NAME,
);

// 임시 파일들을 저장할 폴더
// {프로젝트 경로}/temp
export const TEMP_IMAGE_FOLDER_PATH = join(
  PUBLIC_FOLDER_PATH,
  TEMP_IMAGE_FOLDER_NAME,
);

// 임시 파일들을 저장할 폴더
// {프로젝트 경로}/temp
export const TEMP_MUSIC_FOLDER_PATH = join(
  PUBLIC_FOLDER_PATH,
  TEMP_MUSIC_FOLDER_NAME,
);
