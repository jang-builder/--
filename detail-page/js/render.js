/* ============================================================
   render.js
   입력값(state) + 자동 문구(copy) → 상세페이지 HTML 조립
   ============================================================ */

const RENDER = (() => {

  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  // 줄바꿈을 <br>로 (이스케이프 후 처리)
  const nl = s => esc(s).replace(/\n/g, '<br>');

  const has = (state, key) => state.sections[key] !== false;

  /* ---------- 섹션별 렌더러 ---------- */
  const S = {
    hero(st, c) {
      const p = c.priceInfo;
      let price = '';
      if (p.hasSale) {
        price = `<div class="price"><span class="pct">${p.percent}%</span>
          <span class="before">${esc(p.priceText)}</span><b>${esc(p.saleText)}</b></div>`;
      } else if (p.price) {
        price = `<div class="price"><b>${esc(p.priceText)}</b></div>`;
      }
      const img = st.images.main
        ? `<div class="mainimg"><img src="${st.images.main}" alt="${esc(st.name)}"></div>` : '';
      return `<section class="dp-hero">
        ${st.brand ? `<div class="brand">${esc(st.brand)}</div>` : ''}
        <h1>${nl(c.headline)}</h1>
        <div class="sub">${nl(c.sub)}</div>
        ${price}
        ${img}
      </section>`;
    },

    reco(st, c) {
      const li = c.recommend.map(t => `<li><span class="chk">✓</span><span>${esc(t)}</span></li>`).join('');
      return `<section class="dp-reco">
        <div class="center"><span class="eyebrow">이런 분께 추천합니다</span></div>
        <h2 class="center">이런 분이라면\n끝까지 읽어보셔도 좋습니다</h2>
        <ul>${li}</ul>
      </section>`;
    },

    pain(st, c) {
      const b = c.pains.map(t => `<div class="bubble">“${esc(t)}…”</div>`).join('');
      return `<section class="dp-pain">
        <h2>${nl(c.painTitle)}</h2>
        <div class="bubbles">${b}</div>
        <div class="close">${nl(c.painClose)}</div>
      </section>`;
    },

    benefit(st, c) {
      if (!c.benefits.length) return '';
      const cards = c.benefits.map(b => `<div class="card">
          <div class="no">${esc(b.no)}</div>
          <div><h3>${esc(b.title)}</h3><p>${nl(b.body)}</p></div>
        </div>`).join('');
      return `<section class="dp-benefit">
        <div class="center"><span class="eyebrow">핵심 포인트</span></div>
        <h2 class="center">${esc(st.name)},\n여기에 가장 신경 썼습니다</h2>
        <div style="margin-top:34px">${cards}</div>
      </section>`;
    },

    /* ---- 건강기능식품 전용 ---- */
    func(st, c) {
      const h = st.hff || {};
      const ing = (h.ingredients || []).filter(i => i.name);
      if (!h.claim && !ing.length) return '';
      const rows = ing.map(i => `<tr><td>${esc(i.name)}</td><td>${esc(i.amount || '-')}</td></tr>`).join('');
      return `<section class="dp-func">
        <div class="center"><span class="eyebrow">${st.category === 'hff' ? '식약처 인정 기능성' : '원료 정보'}</span></div>
        <h2 class="center">무엇이 들어있고,\n무엇에 도움이 되는지</h2>
        ${h.claim ? `<div class="claim">
          <div class="claim-label">기능성 내용</div>
          <div class="claim-text">${nl(h.claim)}</div>
          ${h.claimSub ? `<div class="claim-sub">${nl(h.claimSub)}</div>` : ''}
        </div>` : ''}
        ${rows ? `<table class="ing"><thead><tr><th>원료명</th><th>1일 섭취량당 함량</th></tr></thead>
          <tbody>${rows}</tbody></table>` : ''}
      </section>`;
    },

    intake(st) {
      const h = st.hff || {};
      if (!h.intake && !h.caution) return '';
      return `<section class="dp-intake">
        <h2 class="center">섭취 방법 · 주의사항</h2>
        <div class="two">
          ${h.intake ? `<div class="box"><h3>이렇게 드세요</h3><p>${nl(h.intake)}</p></div>` : ''}
          ${h.caution ? `<div class="box care"><h3>이런 분은 주의하세요</h3><p>${nl(h.caution)}</p></div>` : ''}
        </div>
      </section>`;
    },

    legal(st) {
      const h = st.hff || {};
      const notices = (typeof GUARD !== 'undefined' && GUARD.NOTICE[st.category]) || [];
      if (!notices.length && !h.allergy && !h.reviewNo && !h.reportNo) return '';
      const lines = notices.slice();
      if (h.allergy) lines.push(`알레르기 유발 원료: ${h.allergy}`);
      if (h.reportNo) lines.push(`품목제조신고번호(또는 수입신고번호): ${h.reportNo}`);
      if (h.reviewNo) lines.push(`심의필 번호: ${h.reviewNo}`);
      return `<section class="dp-legal">
        <div class="legal-title">표시사항 · 의무 안내</div>
        <ul>${lines.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      </section>`;
    },

    gallery(st) {
      const imgs = (st.images.details || []);
      if (!imgs.length) return '';
      return `<section class="dp-gallery">${
        imgs.map((src, i) => `<img src="${src}" alt="상세 이미지 ${i + 1}">`).join('')
      }</section>`;
    },

    compare(st, c) {
      if (!c.compare.rows.length) return '';
      const th = c.compare.head.map(h => `<th>${esc(h)}</th>`).join('');
      const tr = c.compare.rows.map(r => `<tr>${r.map(d => `<td>${esc(d)}</td>`).join('')}</tr>`).join('');
      return `<section class="dp-compare">
        <div class="center"><span class="eyebrow">무엇이 다른가요</span></div>
        <h2 class="center">직접 비교해 보세요</h2>
        <table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>
        <div class="note">${esc(c.compare.note)}</div>
      </section>`;
    },

    spec(st) {
      const rows = (st.specs || []).filter(s => s.k && s.v);
      if (!rows.length) return '';
      return `<section class="dp-spec">
        <h2 class="center">상품 정보</h2>
        <table><tbody>${
          rows.map(s => `<tr><th>${esc(s.k)}</th><td>${nl(s.v)}</td></tr>`).join('')
        }</tbody></table>
      </section>`;
    },

    trust(st, c) {
      const icons = ['✔', '★', '◎'];
      return `<section class="dp-trust">${
        c.trust.map((t, i) => `<div class="badge"><span>${icons[i % icons.length]}</span>${esc(t)}</div>`).join('')
      }</section>`;
    },

    review(st) {
      const rv = (st.reviews || []).filter(r => r.txt);
      if (!rv.length) return '';
      return `<section class="dp-review">
        <div class="center"><span class="eyebrow">실제 후기</span></div>
        <h2 class="center">먼저 써보신 분들의 이야기</h2>
        <div style="margin-top:30px">${
          rv.map(r => `<div class="r">
            <div class="stars">${'★'.repeat(Math.max(1, Math.min(5, Number(r.star) || 5)))}</div>
            <div class="txt">“${esc(r.txt)}”</div>
            <div class="who">${esc(r.who || '구매자')}</div>
          </div>`).join('')
        }</div>
      </section>`;
    },

    faq(st, c) {
      const extra = (st.faq || []).filter(f => f.q && f.a).map(f => [f.q, f.a]);
      const list = extra.length ? extra.concat(c.faq) : c.faq;
      return `<section class="dp-faq">
        <h2 class="center">자주 묻는 질문</h2>
        <div style="margin-top:24px">${
          list.map(([q, a]) => `<div class="q"><strong>${esc(q)}</strong><p>${nl(a)}</p></div>`).join('')
        }</div>
      </section>`;
    },

    ship(st) {
      const s = st.shipping || {};
      const rows = [
        ['배송비', s.fee || '3,000원 (5만원 이상 무료배송)'],
        ['배송 기간', s.period || '결제 후 영업일 기준 1~3일 이내 출고'],
        ['교환·반품', s.exchange || '수령 후 7일 이내, 상품 훼손이 없는 경우 가능'],
        ['문의', s.contact || '상품 문의 게시판 또는 채팅으로 남겨 주세요']
      ];
      return `<section class="dp-ship">
        <h2 class="center">배송 · 교환 안내</h2>
        <div class="box">${
          rows.map(([k, v]) => `<div class="row"><b>${esc(k)}</b><span>${nl(v)}</span></div>`).join('')
        }</div>
      </section>`;
    },

    cta(st, c) {
      return `<section class="dp-cta">
        <h2>${nl(c.cta)}</h2>
        ${c.ctaSub ? `<div class="sub">${esc(c.ctaSub)}</div>` : ''}
        <div class="btn">${esc(st.ctaText || '구매하러 가기')}</div>
      </section>`;
    }
  };

  const ORDER = ['hero', 'reco', 'pain', 'func', 'benefit', 'gallery', 'intake', 'compare', 'spec', 'trust', 'review', 'faq', 'ship', 'legal', 'cta'];

  const LABELS = {
    hero: '1. 첫 화면(후킹)', reco: '2. 이런 분께 추천', pain: '3. 고민 공감',
    func: '4. 기능성·원료 정보 ★건기식', benefit: '5. 핵심 혜택', gallery: '6. 상세 이미지',
    intake: '7. 섭취방법·주의사항 ★건기식', compare: '8. 비교표', spec: '9. 상품 정보',
    trust: '10. 신뢰 배지', review: '11. 후기', faq: '12. 자주 묻는 질문',
    ship: '13. 배송·교환', legal: '14. 의무 표시사항 ★건기식', cta: '15. 마지막 구매 유도'
  };

  /* ---------- 본문 조립 ---------- */
  function body(state, copy) {
    const inner = ORDER
      .filter(k => has(state, k))
      .map(k => S[k](state, copy))
      .join('\n');
    const color = state.color || '#FF5A3C';
    return `<div class="dp" style="--dp-main:${esc(color)}; --dp-tint:${esc(tint(color))}">
      ${inner}
      <div class="dp-foot">${esc(state.brand || state.name || '')}</div>
    </div>`;
  }

  // 메인 컬러의 옅은 배경색 만들기 (#RRGGBB → 아주 연한 톤)
  function tint(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return '#FFF3F0';
    const n = parseInt(m[1], 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const mix = c => Math.round(c + (255 - c) * 0.92);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }

  /* ---------- 단독 실행 HTML (다운로드용) ---------- */
  function standalone(state, copy) {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>${esc(state.name || '상세페이지')}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<style>body{margin:0;background:#F2F4F6;padding:0;}
${DETAIL_CSS}</style>
</head>
<body>
${body(state, copy)}
</body>
</html>`;
  }

  return { body, standalone, ORDER, LABELS, esc };
})();
