import React, { useState, useEffect } from "react";

const Test = () => {
  const [spots, setSpots] = useState([]); // API에서 가져온 맛집 정보 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 설정

  useEffect(() => {
    // 위치 정보 받아오기 및 API 호출
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetchTouristSpots(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("위치 정보를 가져올 수 없습니다.");
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      setLoading(false);
    }
  }, []);
  // *모든 (맛집,관광지 등)
  //   const fetchTouristSpots = (latitude, longitude) => {
  //     const API_KEY = "YOUR_API_KEY"; // 발급받은 API 키
  //     const radius = "5000"; // 검색 반경 (예: 5000m)
  //     const endpoint = `https://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList`;
  //     const params = `?serviceKey=${API_KEY}&mapX=${longitude}&mapY=${latitude}&radius=${radius}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json`;

  //     fetch(endpoint + params)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const items = data.response.body.items.item;
  //         setSpots(items); // 데이터를 상태에 저장
  //         setLoading(false); // 로딩 완료
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //         setLoading(false);
  //       });
  //   };

  //   //   음식점한정
  //   const fetchTouristSpots = (latitude, longitude) => {
  //     const API_KEY = "YOUR_API_KEY"; // 발급받은 API 키
  //     const radius = "5000"; // 검색 반경 (예: 5000m)
  //     const contentTypeId = "39"; // 음식점(맛집) 정보만 필터링
  //     const endpoint = `https://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList`;
  //     const params = `?serviceKey=${API_KEY}&mapX=${longitude}&mapY=${latitude}&radius=${radius}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=${contentTypeId}`;

  //     fetch(endpoint + params)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const items = data.response.body.items.item;
  //         setSpots(items); // 필터링된 맛집 데이터를 상태에 저장
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //         setLoading(false);
  //       });
  //   };

  //   제주도 위치기반
  //   const fetchTouristSpots = (latitude, longitude) => {
  //     const API_KEY = "YOUR_API_KEY"; // 발급받은 API 키
  //     const radius = "5000"; // 검색 반경 (예: 5000m)
  //     const contentTypeId = "39"; // 음식점(맛집) 정보만 필터링
  //     const areaCode = "39"; // 제주도 지역 코드

  //     const endpoint = `https://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList`;
  //     const params = `?serviceKey=${API_KEY}&mapX=${longitude}&mapY=${latitude}&radius=${radius}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=${contentTypeId}&areaCode=${areaCode}`;

  //     fetch(endpoint + params)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const items = data.response.body.items.item;
  //         setSpots(items); // 필터링된 제주도 맛집 데이터를 상태에 저장
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //         setLoading(false);
  //       });
  //   };

  //   제주도 음식점 위치상관없음
  const fetchTouristSpots = () => {
    const API_KEY = "YOUR_API_KEY"; // 발급받은 API 키
    const contentTypeId = "39"; // 음식점(맛집) 정보만 필터링
    const areaCode = "39"; // 제주도 지역 코드

    const endpoint = `https://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList`;
    const params = `?serviceKey=${API_KEY}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=${contentTypeId}&areaCode=${areaCode}`;

    fetch(endpoint + params)
      .then((response) => response.json())
      .then((data) => {
        const items = data.response.body.items.item;
        setSpots(items); // 필터링된 제주도 맛집 데이터를 상태에 저장
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const fetchAllTouristSpots = async () => {
    const API_KEY = "YOUR_API_KEY";
    const contentTypeId = "39";
    const areaCode = "39";
    const numOfRows = 100;
    let pageNo = 1;
    let allSpots = [];
    let totalCount;

    try {
      // 첫 번째 요청으로 totalCount 확인
      const initialResponse = await fetch(
        `https://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?serviceKey=${API_KEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=${contentTypeId}&areaCode=${areaCode}`
      );
      const initialData = await initialResponse.json();
      totalCount = initialData.response.body.totalCount;
      allSpots = initialData.response.body.items.item;

      // 추가 페이지 요청
      const totalPages = Math.ceil(totalCount / numOfRows);
      for (pageNo = 2; pageNo <= totalPages; pageNo++) {
        const response = await fetch(
          `https://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?serviceKey=${API_KEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=${contentTypeId}&areaCode=${areaCode}`
        );
        const data = await response.json();
        allSpots = allSpots.concat(data.response.body.items.item);
      }

      setSpots(allSpots);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTouristSpots();
  }, []);
  return (
    <div>
      <h1>근처 맛집 정보</h1>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        spots.map((spot, index) => (
          <div key={index}>
            <p>이름: {spot.title}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Test;
// import React, { useState, useEffect } from "react";

// const Test = () => {
//   const [spots, setSpots] = useState([]); // 맛집 정보 저장
//   const [loading, setLoading] = useState(true); // 로딩 상태 설정

//   const fetchAllTouristSpots = async () => {
//     const API_KEY = "YOUR_API_KEY";
//     const contentTypeId = "39"; // 음식점(맛집) 정보만 필터링
//     const areaCode = "39"; // 제주도 지역 코드
//     const numOfRows = 20;
//     let pageNo = 1;
//     let allSpots = [];
//     let totalCount;

//     try {
//       const initialResponse = await fetch(
//         `https://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?serviceKey=${API_KEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=${contentTypeId}&areaCode=${areaCode}`
//       );
//       const initialData = await initialResponse.json();
//       totalCount = initialData.response.body.totalCount;
//       allSpots = initialData.response.body.items.item;

//       const totalPages = Math.ceil(totalCount / numOfRows);
//       for (pageNo = 2; pageNo <= totalPages; pageNo++) {
//         const response = await fetch(
//           `https://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?serviceKey=${API_KEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentTypeId=${contentTypeId}&areaCode=${areaCode}`
//         );
//         const data = await response.json();
//         allSpots = allSpots.concat(data.response.body.items.item);
//       }

//       setSpots(allSpots);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllTouristSpots();
//   }, []);

//   return (
//     <div>
//       <h1>제주도 근처 맛집 정보</h1>
//       {loading ? (
//         <p>로딩 중...</p>
//       ) : (
//         spots.map((spot, index) => (
//           <div
//             key={index}
//             style={{
//               border: "1px solid #ccc",
//               padding: "10px",
//               margin: "10px 0",
//             }}
//           >
//             <h2>{spot.title}</h2>
//             {spot.firstimage ? (
//               <img
//                 src={spot.firstimage}
//                 alt={spot.title}
//                 style={{ width: "100%", height: "auto" }}
//               />
//             ) : (
//               <p>이미지가 없습니다</p>
//             )}
//             <p>주소: {spot.addr1}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Test;