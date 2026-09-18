/* ============================================================
   detail-style.js
   상세페이지(860px 고정폭) 전용 스타일.
   내보내기 HTML 안에 그대로 삽입해야 해서 파일이 아닌
   문자열로 들고 있습니다. (파일 더블클릭 실행 시에도 동작)
   ============================================================ */

const DETAIL_CSS = `
.dp{
  width:860px; margin:0 auto; background:#fff;
  font-family:'Pretendard','Apple SD Gothic Neo','Malgun Gothic','맑은 고딕',sans-serif;
  color:#1F2328; line-height:1.75; letter-spacing:-0.02em;
  -webkit-font-smoothing:antialiased;
}
.dp *{box-sizing:border-box;}
.dp img{max-width:100%; display:block;}
.dp section{padding:80px 60px;}
.dp .eyebrow{
  display:inline-block; font-size:15px; font-weight:700; letter-spacing:.08em;
  color:var(--dp-main); background:var(--dp-tint); padding:8px 16px; border-radius:100px; margin-bottom:20px;
}
.dp h2{font-size:38px; font-weight:800; line-height:1.35; margin:0 0 16px; white-space:pre-line;}
.dp h3{font-size:24px; font-weight:800; margin:0 0 10px;}
.dp p{margin:0; font-size:19px; color:#4A5157;}
.dp .center{text-align:center;}
.dp .divider{height:1px; background:#EAECEF; margin:0 60px;}

/* ---- 1. 후킹 ---- */
.dp-hero{background:var(--dp-tint); text-align:center; padding:90px 60px 70px;}
.dp-hero h1{font-size:46px; font-weight:800; line-height:1.3; margin:0 0 18px; white-space:pre-line;}
.dp-hero .sub{font-size:21px; color:#4A5157;}
.dp-hero .brand{font-size:16px; font-weight:700; color:var(--dp-main); margin-bottom:14px; letter-spacing:.06em;}
.dp-hero .price{margin-top:28px; font-size:17px; color:#6B7278;}
.dp-hero .price b{font-size:34px; color:var(--dp-main); font-weight:800; letter-spacing:-0.03em;}
.dp-hero .price .before{text-decoration:line-through; margin-right:10px;}
.dp-hero .price .pct{background:var(--dp-main); color:#fff; border-radius:8px; padding:4px 10px; font-size:17px; font-weight:800; margin-right:10px;}
.dp-hero .mainimg{margin-top:36px; border-radius:20px; overflow:hidden;}

/* ---- 2. 추천 대상 ---- */
.dp-reco{background:#fff;}
.dp-reco ul{list-style:none; padding:0; margin:28px 0 0;}
.dp-reco li{
  display:flex; align-items:flex-start; gap:14px; font-size:20px; font-weight:600;
  padding:20px 26px; background:#F7F8FA; border-radius:14px; margin-bottom:12px;
}
.dp-reco li .chk{
  flex:0 0 28px; height:28px; border-radius:50%; background:var(--dp-main); color:#fff;
  font-size:16px; display:flex; align-items:center; justify-content:center; margin-top:2px;
}

/* ---- 3. 문제 공감 ---- */
.dp-pain{background:#2A2F35; color:#fff; text-align:center;}
.dp-pain h2{color:#fff;}
.dp-pain .bubbles{display:flex; flex-direction:column; gap:14px; margin:34px 0;}
.dp-pain .bubble{
  background:#3A4048; border-radius:16px; padding:22px 28px; font-size:20px; color:#E8EAEC;
}
.dp-pain .close{font-size:23px; font-weight:700; color:#fff; white-space:pre-line; line-height:1.6; margin-top:34px;}

/* ---- 4. 핵심 혜택 ---- */
.dp-benefit .card{
  display:flex; gap:26px; align-items:flex-start;
  padding:32px; border:1px solid #EAECEF; border-radius:18px; margin-bottom:18px;
}
.dp-benefit .no{
  flex:0 0 58px; height:58px; border-radius:16px; background:var(--dp-main); color:#fff;
  font-size:21px; font-weight:800; display:flex; align-items:center; justify-content:center;
}
.dp-benefit .card p{font-size:18px;}

/* ---- 5. 상세 이미지 ---- */
.dp-gallery{padding:0;}
.dp-gallery img{width:100%;}

/* ---- 6. 비교표 ---- */
.dp-compare table{width:100%; border-collapse:collapse; margin-top:28px; font-size:18px;}
.dp-compare th, .dp-compare td{border:1px solid #E4E7EA; padding:18px 16px; text-align:center;}
.dp-compare thead th{background:#F2F4F6; font-weight:800; font-size:18px;}
.dp-compare thead th:last-child{background:var(--dp-main); color:#fff;}
.dp-compare tbody td:first-child{background:#FAFBFC; font-weight:700; text-align:left;}
.dp-compare tbody td:last-child{font-weight:800; color:var(--dp-main);}
.dp-compare .note{font-size:15px; color:#8B9197; margin-top:14px;}

/* ---- 7. 상품 정보 ---- */
.dp-spec table{width:100%; border-collapse:collapse; margin-top:24px; font-size:18px;}
.dp-spec th{
  width:190px; background:#F7F8FA; font-weight:700; text-align:left;
  padding:18px 22px; border-bottom:1px solid #EAECEF; color:#41474D;
}
.dp-spec td{padding:18px 22px; border-bottom:1px solid #EAECEF;}

/* ---- 8. 신뢰 배지 ---- */
.dp-trust{background:var(--dp-tint); display:flex; gap:16px; justify-content:center; flex-wrap:wrap;}
.dp-trust .badge{
  background:#fff; border-radius:14px; padding:22px 26px; font-size:18px; font-weight:700;
  color:#2A2F35; flex:1; min-width:200px; text-align:center;
}
.dp-trust .badge span{display:block; font-size:26px; margin-bottom:8px;}

/* ---- 9. 후기 ---- */
.dp-review .r{
  border:1px solid #EAECEF; border-radius:16px; padding:26px 30px; margin-bottom:14px;
}
.dp-review .stars{color:#FFB400; font-size:19px; letter-spacing:2px;}
.dp-review .txt{font-size:19px; font-weight:600; margin:10px 0 8px;}
.dp-review .who{font-size:16px; color:#8B9197;}

/* ---- 10. FAQ ---- */
.dp-faq .q{
  border-bottom:1px solid #EAECEF; padding:26px 4px;
}
.dp-faq .q strong{display:block; font-size:20px; font-weight:800; margin-bottom:10px;}
.dp-faq .q strong:before{content:'Q. '; color:var(--dp-main);}
.dp-faq .q p:before{content:'A. '; font-weight:800; color:#8B9197;}

/* ---- 11. 배송/교환 ---- */
.dp-ship .box{background:#F7F8FA; border-radius:16px; padding:30px 34px; margin-top:24px;}
.dp-ship .row{display:flex; gap:16px; font-size:18px; padding:10px 0;}
.dp-ship .row b{flex:0 0 120px; color:#41474D;}

/* ---- 12. 마지막 CTA ---- */
.dp-cta{background:var(--dp-main); color:#fff; text-align:center; padding:80px 60px;}
.dp-cta h2{color:#fff; font-size:36px;}
.dp-cta .sub{font-size:21px; color:rgba(255,255,255,.92); margin-top:10px;}
.dp-cta .btn{
  display:inline-block; margin-top:32px; background:#fff; color:var(--dp-main);
  font-size:23px; font-weight:800; padding:22px 60px; border-radius:100px;
}
.dp-foot{padding:30px 60px; text-align:center; font-size:15px; color:#8B9197;}
/* ---- 건기식: 기능성 정보 ---- */
.dp-func .claim{
  border:2px solid var(--dp-main); border-radius:18px; padding:30px 34px; margin-top:30px; background:var(--dp-tint);
}
.dp-func .claim-label{
  display:inline-block; background:var(--dp-main); color:#fff; font-size:15px; font-weight:800;
  padding:6px 14px; border-radius:100px; margin-bottom:14px;
}
.dp-func .claim-text{font-size:24px; font-weight:800; line-height:1.5; color:#1F2328;}
.dp-func .claim-sub{font-size:17px; color:#4A5157; margin-top:12px;}
.dp-func table.ing{width:100%; border-collapse:collapse; margin-top:22px; font-size:18px;}
.dp-func table.ing th{background:#F2F4F6; font-weight:800; padding:16px; border:1px solid #E4E7EA;}
.dp-func table.ing td{padding:16px; border:1px solid #E4E7EA; text-align:center;}
.dp-func table.ing td:first-child{text-align:left; font-weight:700;}

/* ---- 건기식: 섭취방법 ---- */
.dp-intake .two{display:flex; gap:16px; margin-top:28px;}
.dp-intake .box{flex:1; background:#F7F8FA; border-radius:16px; padding:28px 30px;}
.dp-intake .box.care{background:#FFF6F4; border:1px solid #FFD9CF;}
.dp-intake .box h3{font-size:20px; margin-bottom:12px;}
.dp-intake .box p{font-size:17px; line-height:1.7;}

/* ---- 건기식: 의무 표시사항 ---- */
.dp-legal{background:#F2F4F6; padding:44px 60px;}
.dp-legal .legal-title{font-size:16px; font-weight:800; color:#41474D; margin-bottom:14px;}
.dp-legal ul{list-style:none; padding:0; margin:0;}
.dp-legal li{
  font-size:15px; color:#6B7278; line-height:1.8; padding-left:16px; position:relative;
}
.dp-legal li:before{content:'·'; position:absolute; left:4px;}
`;

