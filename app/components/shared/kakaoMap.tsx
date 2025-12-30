"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
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
      if (!mapRef.current) return;

      const center = new window.kakao.maps.LatLng(37.5665, 126.978);

      new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 3,
      });
    }
  }, []);

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