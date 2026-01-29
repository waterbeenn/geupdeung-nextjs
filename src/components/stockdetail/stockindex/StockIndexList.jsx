'use client';

import StockIndexItem from './StockIndexItem';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';

const StockIndexList = ({ indexs }) => {
    if (!indexs || indexs.length === 0) return null;
    return (
        <div className="stock-index-list">
            <Swiper
                slidesPerView={4}
                navigation={true}
                spaceBetween={40}
                modules={[Navigation]}
                className="mySwiper"
                // 반응형 설정 (모바일 고려 시 추가)
                // breakpoints={{
                //     320: { slidesPerView: 1 },
                //     768: { slidesPerView: 2 },
                //     1024: { slidesPerView: 4 },
                // }}
            >
                {indexs.map((index) => (
                    <SwiperSlide key={index.id}>
                        <StockIndexItem index={index} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default StockIndexList;
