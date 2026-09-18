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

  /* 인라인 아이콘 (사진이 없어도 화면이 비어 보이지 않게) */
  const ICON = {
    hair: c => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"><path d="M4 21c0-6 1.5-11 4-14"/><path d="M9 21c0-7 1.5-12 4-15"/><path d="M14 21c0-6 1.5-11 4-14"/><path d="M19 21c0-4 .6-7 1.6-9"/></svg>`,
    uv: c => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>`,
    drop: c => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3s6 6.5 6 10.5A6 6 0 0 1 6 13.5C6 9.5 12 3 12 3z"/></svg>`,
    pill: c => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8"><rect x="3" y="8" width="18" height="8" rx="4"/><path d="M12 8v8"/></svg>`,
    shield: c => `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>`,
    leaf: c => `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4C10 4 5 9 5 16v4"/><path d="M20 4c0 9-5 13-11 13H5"/></svg>`,
    doc: c => `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>`
  };

  // 기능성 문구에 어울리는 아이콘 고르기
  function claimIcon(text) {
    if (/모발|머리/.test(text)) return ICON.hair('#fff');
    if (/자외선|피부 손상/.test(text)) return ICON.uv('#fff');
    if (/보습|피부/.test(text)) return ICON.drop('#fff');
    return ICON.pill('#fff');
  }


  /* ---------- 섹션별 렌더러 ---------- */
  const S = {
    hero(st, c, o) {
      const p = c.priceInfo;
      let price = '';
      if (p.hasSale) {
        price = `<div class="price-card"><span class="pct">${p.percent}%</span>
          <span class="before">${esc(p.priceText)}</span><b>${esc(p.saleText)}</b></div>`;
      } else if (p.price) {
        price = `<div class="price-card"><b>${esc(p.priceText)}</b></div>`;
      }
      // 헤드라인 마지막 줄(보통 상품명)을 포인트 색으로
      const lines = String(c.headline).split('\n');
      const head = lines.length > 1
        ? `${nl(lines.slice(0, -1).join('\n'))}<br><em>${esc(lines[lines.length - 1])}</em>`
        : `<em>${esc(lines[0])}</em>`;
      const img = st.images.main
        ? `<div class="mainimg"><img src="${st.images.main}" alt="${esc(st.name)}"></div>`
        : (o.preview ? `<div class="mainimg" style="border:0;box-shadow:none"><div class="dp-ph">대표 사진을 넣어보세요
             <span>왼쪽 ‘이미지’에서 사진을 끌어다 놓으면 여기에 들어갑니다</span></div></div>` : '');
      return `<section class="dp-hero">
        ${st.brand ? `<div class="brand">${esc(st.brand)}</div>` : ''}
        <h1>${head}</h1>
        <div class="hairline"></div>
        <div class="sub">${nl(c.sub)}</div>
        ${price ? `<div style="margin-top:32px">${price}</div>` : ''}
        ${img}
        <div class="scroll">SCROLL</div>
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
        <div class="close">${nl(c.painClose).replace(esc(st.name), '<b>' + esc(st.name) + '</b>')}</div>
      </section>`;
    },

    benefit(st, c) {
      if (!c.benefits.length) return '';
      const cards = c.benefits.map(b => `<div class="card">
          <div class="no">${esc(b.no)}</div>
          <div class="bar"></div>
          <h3>${esc(b.title)}</h3><p>${nl(b.body)}</p>
        </div>`).join('');
      return `<section class="dp-benefit">
        <div class="center"><span class="eyebrow">POINT</span></div>
        <h2 class="center">${esc(st.name)},\n여기에 가장 신경 썼습니다</h2>
        <div style="margin-top:36px">${cards}</div>
      </section>`;
    },

    /* ---- 건강기능식품 전용 ---- */
    func(st, c) {
      const h = st.hff || {};
      const ing = (h.ingredients || []).filter(i => i.name);
      if (!h.claim && !ing.length) return '';
      const claims = String(h.claim || '').split('\n').map(t => t.trim()).filter(Boolean);
      return `<section class="dp-func">
        <div class="center"><span class="eyebrow">${st.category === 'hff' ? 'FUNCTIONAL' : 'INGREDIENT'}</span></div>
        <h2 class="center">${st.category === 'hff' ? '식약처가 인정한 기능성' : '무엇이 들어있는지'}</h2>
        ${claims.length ? `<div class="claims">${claims.map(t => `
          <div class="claim-card"><div class="ic">${claimIcon(t)}</div><div class="tx">${esc(t)}</div></div>`).join('')}</div>` : ''}
        ${h.claimSub ? `<div class="claim-note">${nl(h.claimSub)}</div>` : ''}
        ${ing.length ? `<div class="ing-grid">${ing.map(i => `
          <div class="ing-card"><div class="n">${esc(i.name)}</div><div class="a">${esc(i.amount || '-')}</div></div>`).join('')}</div>` : ''}
      </section>`;
    },

    intake(st) {
      const h = st.hff || {};
      if (!h.intake && !h.caution) return '';
      const perDay = /3\s*(회|정)/.test(h.intake || '');
      return `<section class="dp-intake">
        <div class="center"><span class="eyebrow">HOW TO</span></div>
        <h2 class="center">이렇게 드시면 됩니다</h2>
        ${perDay ? `<div class="steps">
          <div class="step"><div class="t">아침</div><div class="v">1정</div></div>
          <div class="step"><div class="t">점심</div><div class="v">1정</div></div>
          <div class="step"><div class="t">저녁</div><div class="v">1정</div></div>
        </div>` : ''}
        <div class="two">
          ${h.intake ? `<div class="box"><h3>${ICON.pill('#16181D')} 섭취 방법</h3><p>${nl(h.intake)}</p></div>` : ''}
          ${h.caution ? `<div class="box care"><h3>⚠ 이런 분은 주의하세요</h3><p>${nl(h.caution)}</p></div>` : ''}
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

    gallery(st, c, o) {
      const imgs = (st.images.details || []);
      if (!imgs.length) {
        return o.preview
          ? `<section style="padding:40px 64px"><div class="dp-ph">상세 사진을 넣어보세요
               <span>2장이면 나란히, 3장이면 큰 컷 하나 + 작은 컷 둘로 자동 배치됩니다</span></div></section>`
          : '';
      }
      const g = imgs.length === 1 ? 'g1' : imgs.length === 3 ? 'g3' : 'g2';
      return `<section class="dp-gallery ${g}">${
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
      const ic = [ICON.shield('#fff'), ICON.leaf('#fff'), ICON.doc('#fff')];
      return `<section class="dp-marks">${
        c.trust.map((t, i) => `<div class="m">${ic[i % ic.length]}${esc(t)}</div>`).join('')
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

  const ORDER = ['hero', 'trust', 'reco', 'pain', 'func', 'benefit', 'gallery', 'intake', 'compare', 'spec', 'review', 'faq', 'ship', 'legal', 'cta'];

  const LABELS = {
    hero: '1. 첫 화면(후킹)', trust: '2. 인증 배지 줄', reco: '3. 이런 분께 추천',
    pain: '4. 고민 공감', func: '5. 기능성·원료 정보 ★건기식', benefit: '6. 핵심 포인트',
    gallery: '7. 상세 사진', intake: '8. 섭취방법·주의사항 ★건기식', compare: '9. 비교표',
    spec: '10. 상품 정보', review: '11. 후기', faq: '12. 자주 묻는 질문',
    ship: '13. 배송·교환', legal: '14. 의무 표시사항 ★건기식', cta: '15. 마지막 구매 유도'
  };

  /* ---------- 본문 조립 ---------- */
  function body(state, copy, opts) {
    const o = opts || {};
    const inner = ORDER
      .filter(k => has(state, k))
      .map(k => S[k](state, copy, o))
      .join('\n');
    const color = state.color || '#B8860B';
    return `<div class="dp" style="--dp-main:${esc(color)}; --dp-tint:${esc(tint(color))}; --dp-glow:${esc(glow(color))}">
      ${inner}
      <div class="dp-foot">${esc(state.brand || state.name || '')}</div>
    </div>`;
  }

  // 어두운 배경에 얹을 은은한 빛 (메인 컬러의 투명 버전)
  function glow(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return 'rgba(184,134,11,.22)';
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, .22)`;
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
  // 내보내기 HTML 에는 '사진 넣어보세요' 안내를 넣지 않는다
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
