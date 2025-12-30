"use client";

import { useEffect, useRef, useState } from "react";
import { useMerchantRecordList } from "@/app/hooks/useMerchantRecordList";

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const initialized = useRef(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // React Query로 상인 기록 데이터 가져오기
  const { data: merchantData } = useMerchantRecordList(1, 100);
  const records = merchantData?.data.record || [];

  // 랜덤 마커 생성 함수 (현재 위치 주변에 랜덤하게 생성)
  const generateRandomMarkers = (centerLat: number, centerLng: number, count: number = 10) => {
    const randomMarkers = [];
    const seafoodTypes = ['광어', '우럭', '대게', '킹크랩', '연어', '참치', '새우', '전복'];

    for (let i = 0; i < count; i++) {
      // 10m~100m 범위로 랜덤 거리 생성
      // 1도 = 약 111km이므로, 100m = 0.0009도, 10m = 0.00009도
      const minDistance = 0.00009; // 약 10m
      const maxDistance = 0.0009;  // 약 100m
      const randomDistance = minDistance + Math.random() * (maxDistance - minDistance);

      // 랜덤한 각도 (0~360도)
      const randomAngle = Math.random() * 2 * Math.PI;

      // 극좌표를 직교좌표로 변환
      const randomLat = centerLat + randomDistance * Math.cos(randomAngle);
      const randomLng = centerLng + randomDistance * Math.sin(randomAngle);

      randomMarkers.push({
        lat: randomLat,
        lng: randomLng,
        seafoodType: seafoodTypes[Math.floor(Math.random() * seafoodTypes.length)],
        weight: (Math.random() * 2 + 0.5).toFixed(1), // 0.5kg ~ 2.5kg
        price: Math.floor(Math.random() * 50000 + 10000), // 10,000원 ~ 60,000원
      });
    }

    return randomMarkers;
  };

  // 사용자의 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log('현재 위치:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          // 위치 권한이 없으면 기본 위치(서울 시청) 사용
          setUserLocation({ lat: 37.5665, lng: 126.978 });
        }
      );
    } else {
      console.error('브라우저가 Geolocation을 지원하지 않습니다.');
      // Geolocation을 지원하지 않으면 기본 위치 사용
      setUserLocation({ lat: 37.5665, lng: 126.978 });
    }
  }, []);

  useEffect(() => {
    if (initialized.current || !userLocation) return;
    initialized.current = true;

    // 이미 로드돼 있으면 바로 실행
    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    // SDK 동적 로드
    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=b902afe72fd9b5b6c4d8a78a91c4aaea&autoload=false";
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(initMap);
    };

    document.head.appendChild(script);

    function initMap() {
      if (!mapRef.current || !userLocation) return;

      const center = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);

      const map = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 3, // 근처 마커들을 볼 수 있도록 줌 레벨 조정 (10m~100m 범위)
      });

      // 지도 인스턴스 저장
      mapInstanceRef.current = map;

      // 현재 위치에 마커 표시 (파란색 마커)
      const markerPosition = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);
      const userMarker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: map,
      });

      // 랜덤 마커 생성 및 표시 (10m~100m 범위에 20개)
      const randomMarkers = generateRandomMarkers(userLocation.lat, userLocation.lng, 20);

      randomMarkers.forEach((marker) => {
        const position = new window.kakao.maps.LatLng(marker.lat, marker.lng);

        const kakaoMarker = new window.kakao.maps.Marker({
          position: position,
          map: map,
        });

        // 마커 클릭 시 인포윈도우 표시
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding:10px;min-width:150px;text-align:center;">
              <strong>${marker.seafoodType}</strong><br/>
              무게: ${marker.weight}kg<br/>
              가격: ${marker.price.toLocaleString()}원
            </div>
          `,
        });

        window.kakao.maps.event.addListener(kakaoMarker, 'click', () => {
          infowindow.open(map, kakaoMarker);
        });

        // 마커를 배열에 저장
        markersRef.current.push(kakaoMarker);
      });

      console.log(`${randomMarkers.length}개의 랜덤 마커 표시 완료 (10m~100m 범위)`);
    }
  }, [userLocation]);

  // 상인 기록 마커 표시
  useEffect(() => {
    if (!mapInstanceRef.current || records.length === 0) return;

    const map = mapInstanceRef.current;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];

    // 상인 기록 각각에 대해 마커 생성
    records.forEach((record) => {
      const lat = record.data.location.latitude;
      const lng = record.data.location.longitude;

      const position = new window.kakao.maps.LatLng(lat, lng);

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: position,
        map: map,
      });

      // 마커를 배열에 저장
      markersRef.current.push(marker);

      // 마커 클릭 시 인포윈도우 표시
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding:10px;min-width:150px;text-align:center;">
            <strong>${record.stats.seafoodType}</strong><br/>
            무게: ${record.merchantWeight}kg<br/>
            가격: ${record.stats.marketPrice.toLocaleString()}원
          </div>
        `,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });
    });

    console.log(`${records.length}개의 상인 기록 마커 표시 완료`);
  }, [records]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "calc(100vh - 60px)",
        minHeight: "500px",
        background: "#eee",
      }}
    />
  );
};

export default KakaoMap;