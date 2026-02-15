"use client";

import { useEffect, useState } from "react";

function getApiBaseUrl(): string {
  if (typeof window === "undefined") return "/api";
  return window.location.hostname === "localhost" ? "http://localhost:8000/api" : "/api";
}

export default function Home() {
  const [data, setData] = useState<string>("로딩 중...");

  useEffect(() => {
    const apiUrl = `${getApiBaseUrl()}/hello`;
    // FastAPI 엔드포인트 호출
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch(() => setData("에러가 발생했습니다."));
  }, []);

  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Next.js + FastAPI on Vercel 하하</h1>
      <hr />
      <p style={{ fontSize: "1.5rem", color: "#0070f3", fontWeight: "bold" }}>
        {data}
      </p>
    </div>
  );
}
