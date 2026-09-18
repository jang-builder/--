/* ============================================================
   detail-style.js
   상세페이지(860px 고정폭) 디자인.
   내보내기 HTML 안에 그대로 넣어야 해서 문자열로 들고 있습니다.
   ============================================================ */

const DETAIL_CSS = `
.dp{
  width:860px; margin:0 auto; background:#fff;
  font-family:'Pretendard','Apple SD Gothic Neo','Malgun Gothic','맑은 고딕',sans-serif;
  color:#16181D; line-height:1.72; letter-spacing:-0.025em;
  -webkit-font-smoothing:antialiased; position:relative; overflow:hidden;
}
.dp *{box-sizing:border-box;}
.dp img{max-width:100%; display:block;}
.dp section{padding:96px 64px; position:relative;}
.dp .center{text-align:center;}

/* 공통 타이포 */
.dp .eyebrow{
  display:inline-block; font-size:13px; font-weight:800; letter-spacing:.18em;
  color:var(--dp-main); padding-bottom:10px; margin-bottom:18px;
  border-bottom:2px solid var(--dp-main); text-transform:uppercase;
}
.dp h2{font-size:40px; font-weight:800; line-height:1.32; margin:0 0 18px; white-space:pre-line; letter-spacing:-0.04em;}
.dp h3{font-size:23px; font-weight:800; margin:0 0 10px; letter-spacing:-0.03em;}
.dp p{margin:0; font-size:18px; color:#4A5157;}
.dp .num-bg{
  position:absolute; font-size:150px; font-weight:900; line-height:1;
  color:var(--dp-main); opacity:.07; right:40px; top:-10px; letter-spacing:-0.06em;
}

/* ---------- 1. 첫 화면 ---------- */
.dp .dp-hero{
  background:
    radial-gradient(900px 420px at 18% 0%, rgba(255,255,255,.10), transparent 70%),
    radial-gradient(700px 500px at 100% 100%, var(--dp-glow), transparent 68%),
    linear-gradient(165deg, #14161A 0%, #1E2026 48%, #0E1013 100%);
  color:#fff; text-align:center; padding:92px 64px 84px;
}
.dp-hero .brand{
  display:inline-block; font-size:13px; font-weight:800; letter-spacing:.28em;
  color:var(--dp-main); border:1px solid rgba(255,255,255,.22);
  padding:9px 20px; border-radius:100px; margin-bottom:30px;
}
.dp-hero h1{
  font-size:50px; font-weight:800; line-height:1.28; margin:0 0 20px;
  white-space:pre-line; letter-spacing:-0.045em; color:#fff;
}
.dp-hero h1 em{font-style:normal; color:var(--dp-main);}
.dp-hero .sub{font-size:20px; color:rgba(255,255,255,.72); line-height:1.7;}
.dp-hero .hairline{width:44px; height:3px; background:var(--dp-main); margin:34px auto;}
.dp-hero .price-card{
  display:inline-flex; align-items:center; gap:16px;
  background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.16);
  border-radius:18px; padding:20px 32px; backdrop-filter:blur(6px);
}
.dp-hero .price-card .pct{
  background:var(--dp-main); color:#101216; font-size:17px; font-weight:900;
  padding:6px 12px; border-radius:8px;
}
.dp-hero .price-card .before{color:rgba(255,255,255,.45); text-decoration:line-through; font-size:17px;}
.dp-hero .price-card b{font-size:34px; font-weight:800; color:#fff; letter-spacing:-0.04em;}
.dp-hero .mainimg{
  margin-top:44px; border-radius:22px; overflow:hidden;
  box-shadow:0 30px 70px rgba(0,0,0,.45); border:1px solid rgba(255,255,255,.12);
}
.dp-hero .scroll{margin-top:38px; font-size:13px; color:rgba(255,255,255,.4); letter-spacing:.2em;}

/* ---------- 인증 배지 줄 ---------- */
.dp .dp-marks{
  background:#0E1013; padding:30px 64px; display:flex; gap:12px; justify-content:center;
  border-top:1px solid rgba(255,255,255,.07);
}
.dp-marks .m{
  flex:1; text-align:center; color:rgba(255,255,255,.82); font-size:14px; font-weight:700;
  padding:16px 10px; border:1px solid rgba(255,255,255,.12); border-radius:14px;
}
.dp-marks .m svg{margin:0 auto 8px; display:block;}

/* ---------- 2. 추천 대상 ---------- */
.dp-reco{background:#fff;}
.dp-reco ul{list-style:none; padding:0; margin:34px 0 0;}
.dp-reco li{
  display:flex; align-items:center; gap:16px; font-size:19px; font-weight:600;
  padding:22px 28px; border:1px solid #ECEEF1; border-radius:16px; margin-bottom:12px;
  background:linear-gradient(90deg, var(--dp-tint) 0%, #fff 55%);
}
.dp-reco li .chk{
  flex:0 0 30px; height:30px; border-radius:50%; background:var(--dp-main); color:#fff;
  font-size:15px; display:flex; align-items:center; justify-content:center; font-weight:900;
}

/* ---------- 3. 고민 공감 ---------- */
.dp-pain{background:#16181D; color:#fff; text-align:center;}
.dp-pain h2{color:#fff;}
.dp-pain .bubbles{display:flex; flex-direction:column; gap:13px; margin:38px 0;}
.dp-pain .bubble{
  background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1);
  border-radius:16px; padding:24px 30px; font-size:19px; color:rgba(255,255,255,.8);
}
.dp-pain .close{
  font-size:24px; font-weight:800; color:#fff; white-space:pre-line; line-height:1.62; margin-top:38px;
}
.dp-pain .close b{color:var(--dp-main);}

/* ---------- 4. 기능성 ---------- */
.dp-func{background:var(--dp-tint);}
.dp-func .claims{display:flex; flex-direction:column; gap:14px; margin-top:34px;}
.dp-func .claim-card{
  background:#fff; border-radius:20px; padding:30px 32px; display:flex; gap:22px; align-items:center;
  box-shadow:0 8px 26px rgba(22,24,29,.06);
}
.dp-func .claim-card .ic{
  flex:0 0 62px; height:62px; border-radius:18px; background:var(--dp-main);
  display:flex; align-items:center; justify-content:center;
}
.dp-func .claim-card .tx{font-size:20px; font-weight:800; line-height:1.5; letter-spacing:-0.03em;}
.dp-func .claim-note{font-size:15px; color:#79808A; margin-top:16px;}
.dp-func .ing-grid{display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-top:20px;}
.dp-func .ing-card{
  background:#fff; border-radius:16px; padding:22px 18px; text-align:center;
  border:1px solid rgba(22,24,29,.06); display:flex; flex-direction:column; justify-content:center;
}
.dp-func .ing-card .n{font-size:16px; font-weight:800; letter-spacing:-0.03em;}
.dp-func .ing-card .a{font-size:15px; color:var(--dp-main); font-weight:800; margin-top:6px;}

/* ---------- 5. 핵심 혜택 ---------- */
.dp-benefit .card{
  position:relative; padding:38px 36px; border-radius:22px; margin-bottom:16px;
  background:#fff; border:1px solid #ECEEF1; overflow:hidden;
}
.dp-benefit .card:nth-child(odd){background:linear-gradient(120deg, var(--dp-tint), #fff 60%);}
.dp-benefit .card .no{
  position:absolute; right:26px; top:14px; font-size:86px; font-weight:900;
  color:var(--dp-main); opacity:.12; line-height:1; letter-spacing:-0.06em;
}
.dp-benefit .card h3{font-size:24px; position:relative; padding-right:90px;}
.dp-benefit .card p{font-size:18px; position:relative;}
.dp-benefit .card .bar{width:34px; height:3px; background:var(--dp-main); margin-bottom:16px;}

/* ---------- 6. 사진 ---------- */
.dp .dp-gallery{padding:0; display:grid; gap:4px; background:#fff;}
.dp .dp-gallery.g1{grid-template-columns:1fr;}
.dp .dp-gallery.g2{grid-template-columns:1fr 1fr;}
.dp .dp-gallery.g3{grid-template-columns:1fr 1fr;}
.dp-gallery.g3 > *:first-child{grid-column:1 / -1;}
.dp-gallery img{width:100%; height:100%; object-fit:cover;}
.dp-ph{
  border:2px dashed var(--dp-main); border-radius:18px; background:var(--dp-tint);
  padding:56px 24px; text-align:center; color:var(--dp-main); font-weight:800; font-size:17px;
}
.dp-ph span{display:block; font-size:14px; font-weight:600; color:#8A9098; margin-top:8px;}

/* ---------- 7. 섭취 방법 ---------- */
.dp-intake{background:#fff;}
.dp-intake .steps{display:flex; gap:12px; margin-top:34px;}
.dp-intake .step{
  flex:1; background:var(--dp-tint); border-radius:18px; padding:26px 22px; text-align:center;
}
.dp-intake .step .t{font-size:13px; font-weight:800; color:var(--dp-main); letter-spacing:.12em;}
.dp-intake .step .v{font-size:19px; font-weight:800; margin-top:8px;}
.dp-intake .two{display:flex; gap:16px; margin-top:20px;}
.dp-intake .box{flex:1; border-radius:18px; padding:28px 30px; background:#F7F8FA;}
.dp-intake .box.care{background:#fff; border:1px solid #F0DCD6;}
.dp-intake .box h3{font-size:19px; margin-bottom:12px; display:flex; align-items:center; gap:8px;}
.dp-intake .box p{font-size:16.5px; line-height:1.75;}

/* ---------- 8. 비교표 ---------- */
.dp-compare{background:var(--dp-tint);}
.dp-compare table{width:100%; border-collapse:separate; border-spacing:0; margin-top:30px; font-size:17px; background:#fff; border-radius:18px; overflow:hidden;}
.dp-compare th, .dp-compare td{padding:20px 16px; text-align:center; border-bottom:1px solid #EEF0F3;}
.dp-compare thead th{background:#F5F6F8; font-weight:800; font-size:16px; color:#5A616A;}
.dp-compare thead th:last-child{background:var(--dp-main); color:#fff;}
.dp-compare tbody td:first-child{text-align:left; font-weight:700;}
.dp-compare tbody td:last-child{font-weight:800; color:var(--dp-main); background:var(--dp-tint);}
.dp-compare tbody tr:last-child td{border-bottom:0;}
.dp-compare .note{font-size:14px; color:#8A9098; margin-top:14px;}

/* ---------- 9. 상품 정보 ---------- */
.dp-spec table{width:100%; border-collapse:collapse; margin-top:26px; font-size:17px;}
.dp-spec th{
  width:180px; font-weight:700; text-align:left; color:#79808A;
  padding:18px 20px; border-bottom:1px solid #EEF0F3;
}
.dp-spec td{padding:18px 20px; border-bottom:1px solid #EEF0F3; font-weight:600;}

/* ---------- 10. 후기 ---------- */
.dp-review{background:var(--dp-tint);}
.dp-review .r{background:#fff; border-radius:18px; padding:30px 32px; margin-bottom:13px; box-shadow:0 6px 20px rgba(22,24,29,.05);}
.dp-review .stars{color:var(--dp-main); font-size:17px; letter-spacing:3px;}
.dp-review .txt{font-size:19px; font-weight:700; margin:12px 0 10px; line-height:1.6;}
.dp-review .who{font-size:15px; color:#8A9098;}

/* ---------- 11. FAQ ---------- */
.dp-faq .q{border-bottom:1px solid #EEF0F3; padding:28px 4px;}
.dp-faq .q:last-child{border-bottom:0;}
.dp-faq .q strong{display:block; font-size:19px; font-weight:800; margin-bottom:12px; letter-spacing:-0.03em;}
.dp-faq .q strong:before{content:'Q'; display:inline-flex; width:24px; height:24px; border-radius:50%;
  background:var(--dp-main); color:#fff; font-size:13px; align-items:center; justify-content:center;
  margin-right:10px; vertical-align:middle;}
.dp-faq .q p{font-size:17px; padding-left:34px;}

/* ---------- 12. 배송 ---------- */
.dp-ship{background:#F7F8FA;}
.dp-ship .box{background:#fff; border-radius:20px; padding:32px 36px; margin-top:24px;}
.dp-ship .row{display:flex; gap:18px; font-size:17px; padding:12px 0; border-bottom:1px solid #F2F4F6;}
.dp-ship .row:last-child{border-bottom:0;}
.dp-ship .row b{flex:0 0 120px; color:#79808A; font-weight:700;}

/* ---------- 13. 의무 표시 ---------- */
.dp .dp-legal{background:#fff; padding:44px 64px; border-top:1px solid #EEF0F3;}
.dp-legal .legal-title{font-size:15px; font-weight:800; color:#5A616A; margin-bottom:14px;}
.dp-legal ul{list-style:none; padding:0; margin:0;}
.dp-legal li{font-size:14px; color:#8A9098; line-height:1.85; padding-left:14px; position:relative;}
.dp-legal li:before{content:'·'; position:absolute; left:2px;}

/* ---------- 14. 마지막 ---------- */
.dp .dp-cta{
  background:
    radial-gradient(600px 300px at 50% 0%, var(--dp-glow), transparent 70%),
    linear-gradient(160deg, #14161A, #0E1013);
  color:#fff; text-align:center; padding:86px 64px;
}
.dp-cta h2{color:#fff; font-size:38px;}
.dp-cta .sub{font-size:20px; color:rgba(255,255,255,.7); margin-top:12px;}
.dp-cta .btn{
  display:inline-block; margin-top:34px; background:var(--dp-main); color:#101216;
  font-size:22px; font-weight:900; padding:24px 66px; border-radius:100px;
  box-shadow:0 18px 40px var(--dp-glow);
}
.dp-foot{padding:26px 64px; text-align:center; font-size:13px; color:#A6ACB4; letter-spacing:.06em;}
`;
