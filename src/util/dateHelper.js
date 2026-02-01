// src/utils/dateHelper.js
import axios from 'axios';

const HOLIDAY_URL = process.env.NEXT_PUBLIC_HOLIDAY_API_BASE_URL;
const SERVICE_KEY = process.env.NEXT_PUBLIC_STOCK_SERVICE_KEY

/**
 * 1. 날짜를 YYYYMMDD 형태로 변환하는 헬퍼
 */
const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
};

/**
 * 2. 해당 날짜가 공휴일인지 API로 확인하는 함수
 */
const checkIsHoliday = async (dateStr) => {
    const cached = sessionStorage.getItem(`holiday_${dateStr}`);
    if (cached !== null) return JSON.parse(cached);
    try {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);

        // 국경일 및 공휴일 정보 조회 (getRestDeInfo)
        const res = await axios.get(`${HOLIDAY_URL}/getRestDeInfo`, {
            params: {
                serviceKey: SERVICE_KEY,
                solYear: year,
                solMonth: month,
                _type: 'json',
                numOfRows: 100
            }
        });

        const items = res.data.response?.body?.items?.item;
        
        // 공휴일 데이터가 배열인 경우와 단일 객체인 경우 처리
        if (!items) return false;
        const holidayList = Array.isArray(items) ? items : [items];
        const isHoliday = holidayList.some(h => String(h.locdate) === dateStr);
        sessionStorage.setItem(`holiday_${dateStr}`, JSON.stringify(isHoliday));
        return isHoliday
    } catch (error) {
        console.error("공휴일 조회 실패:", error);
        return false; // 에러 시 일단 공휴일이 아닌 것으로 간주 (보수적 접근)
    }
};

/**
 * 3. [메인] 최신 영업일(장 열린 날) 계산 로직
 */
export const getLatestTradingDay = async () => {
    let target = new Date();
    
    // 장 마감 및 데이터 업데이트 시간을 고려하여 오전 10시 이전엔 전날 데이터부터 탐색
    if (target.getHours() < 10) {
        target.setDate(target.getDate() - 1);
    }

    while (true) {
        const day = target.getDay(); // 0: 일, 6: 토
        const dateStr = formatDate(target);

        // 1단계: 주말 체크 (토요일=6, 일요일=0)
        const isWeekend = (day === 0 || day === 6);
        
        if (isWeekend) {
            target.setDate(target.getDate() - 1);
            continue; // 주말이면 더 볼 것 없이 하루 전으로
        }

        // 2단계: 평일이라면 공휴일인지 API 체크
        const isHoliday = await checkIsHoliday(dateStr);
        
        if (isHoliday) {
            target.setDate(target.getDate() - 1);
            continue; // 공휴일이면 다시 하루 전으로
        }

        // 3단계: 주말도 아니고 공휴일도 아니면 영업일 확정!
        return dateStr;
    }
};