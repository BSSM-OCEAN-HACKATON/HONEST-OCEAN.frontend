"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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
        level: 3,
      });

      // 현재 위치에 마커 표시
      const markerPosition = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);
    }
  }, [userLocation]);

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