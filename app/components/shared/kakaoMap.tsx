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
        level: 5, // 상인 기록들을 볼 수 있도록 줌 레벨 조정
      });

      // 지도 인스턴스 저장
      mapInstanceRef.current = map;

      // 현재 위치에 마커 표시 (파란색 마커)
      const markerPosition = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);
      const userMarker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: map,
      });
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