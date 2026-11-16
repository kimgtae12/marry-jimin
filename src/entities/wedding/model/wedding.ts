import type { WeddingInfo } from './types'

/**
 * 청첩장 내용은 전부 여기서 관리한다.
 * 사진은 public/images 에 넣고 publicUrl 로 경로를 채운다.
 *   예) mainPhoto: publicUrl('images/main.jpg')
 *   (GitHub Pages 는 /marry-jimin/ 하위 경로라서 '/images/..' 처럼 쓰면 깨진다)
 */
export const wedding: WeddingInfo = {
  groom: { name: '유성욱', firstName: '성욱', father: '유길만', mother: '하지은' },
  bride: { name: '배지민', firstName: '지민', mother: '주용순' },
  date: new Date(2027, 1, 21, 14, 0),
  dateLabel: '2027. 02. 21 SUN PM 2:00',
  venue: {
    name: '국민연금 웨딩홀',
    hall: '3F 에메랄드 홀',
    mapQuery: '국민연금 부산회관',
  },
  intro: {
    title: 'Wedding Invitation',
    quote: ['예쁜 예감이 들었다.', '우리는 언제나 손을 잡고 있게 될 것이다.'],
    quoteSource: '이이체, <연인>',
    body: [
      [
        '잡은 손의 온기가 서로의 마음을',
        '가장 먼저 알아채는 사람이 되겠습니다.',
        '좋은 날에는 그 손을 흔들며 함께 웃고,',
        '고단한 날에는 더 꼭 맞잡아',
        '서로의 무게를 나누어 짊어지겠습니다.',
      ],
      [
        '어떤 풍경 속에서도',
        '결코 이 손을 놓지 않겠다는 약속,',
        '저희 두 사람의 눈부신 시작에',
        '다정한 증인이 되어주세요.',
      ],
    ],
  },
  transport: [
    { label: '지하철', lines: ['1호선 시청역 2번 출구 (도보 2분)'] },
    {
      label: '버스',
      lines: ['29, 86, 87, 99, 106, 110-1, 131, 141, 179', '부산시청 하차'],
    },
    {
      label: '주차',
      lines: ['본 건물 지하 2층 ~ 4층 이용', '또는 주변(시청 / 이마트 / 연제구청) 주차장 이용'],
    },
  ],
  accounts: [
    {
      side: 'groom',
      label: '신랑측',
      accounts: [
        { role: '신랑', name: '유성욱', bank: '카카오뱅크', number: '3333-23-8704-900' },
        { role: '아버지', name: '유길만', bank: '기업은행', number: '288-069260-01-028' },
        {
          role: '어머니',
          name: '하지은',
          bank: '카카오뱅크',
          number: '3333-23-8704-900',
          holder: '유성욱',
        },
      ],
    },
    {
      side: 'bride',
      label: '신부측',
      accounts: [
        { role: '신부', name: '배지민', bank: '국민은행', number: '562101-01-541157' },
        {
          role: '어머니',
          name: '주용순',
          bank: '국민은행',
          number: '562101-01-541157',
          holder: '배지민',
        },
      ],
    },
  ],
  mainPhoto: undefined,
  gallery: [],
}
