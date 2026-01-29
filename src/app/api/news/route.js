import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '경제';
    const display = searchParams.get('display') || 12; // ✅ 기본값 설정
    const start = searchParams.get('start') || 1;     // ✅ 시작 위치 추가

    try {
        const response = await axios.get('https://openapi.naver.com/v1/search/news.json', {
            params: {
                query: query,
                display: 12, // 가져올 뉴스 개수
                start: start,
                sort: 'sim', // 유사도순 (날짜순은 'date')
            },
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
            },
        });
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('뉴스 데이터 fetch 실패:', error);
        return NextResponse.json({ error: '뉴스 로드 실패' }, { status: 500 });
    }
}
