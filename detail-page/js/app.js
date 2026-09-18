/* ============================================================
   app.js  —  상세페이지 자동 생성기 컨트롤러
   입력 → 상태(state) → 자동 문구 → 미리보기 → 저장
   ============================================================ */
(() => {

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const SAVE_KEY = 'dp-generator-state-v1';

  /* ---------------- 상태 ---------------- */
  const blank = () => ({
    category: 'hff', tone: 'trust',
    brand: '', name: '', target: '',
    price: '', salePrice: '',
    color: '#FF5A3C', ctaText: '구매하러 가기',
    variant: 0,
    features: [{ title: '', desc: '' }, { title: '', desc: '' }, { title: '', desc: '' }],
    specs: [{ k: '', v: '' }],
    reviews: [],
    faq: [],
    shipping: { fee: '', period: '', exchange: '', contact: '' },
    hff: {
      claim: '', claimSub: '', ingredients: [{ name: '', amount: '' }],
      intake: '', caution: '', allergy: '', reportNo: '', reviewNo: ''
    },
    images: { main: '', details: [] },
    sections: {}
  });

  let state = blank();

  /* ---------------- 반복 입력 설정 ---------------- */
  const REPEATERS = {
    features: {
      box: '#repFeatures', label: '특징',
      fields: [
        { k: 'title', ph: '예: 아이스팩 포장 당일 발송', type: 'text' },
        { k: 'desc', ph: '설명(비워두면 판매 문구가 자동으로 붙습니다)', type: 'textarea' }
      ],
      make: () => ({ title: '', desc: '' })
    },
    specs: {
      box: '#repSpecs', label: '항목',
      fields: [
        { k: 'k', ph: '항목명 (예: 중량)', type: 'text' },
        { k: 'v', ph: '내용 (예: 500g × 2팩)', type: 'text' }
      ],
      make: () => ({ k: '', v: '' })
    },
    reviews: {
      box: '#repReviews', label: '후기',
      fields: [
        { k: 'star', ph: '별점 (1~5)', type: 'number' },
        { k: 'txt', ph: '후기 내용', type: 'textarea' },
        { k: 'who', ph: '작성자 (예: 김O진 님)', type: 'text' }
      ],
      make: () => ({ star: 5, txt: '', who: '' })
    },
    'hff.ingredients': {
      box: '#repHffIngredients', label: '원료',
      fields: [
        { k: 'name', ph: '원료명 (예: 밀크씨슬 추출물)', type: 'text' },
        { k: 'amount', ph: '1일 섭취량당 함량 (예: 130mg)', type: 'text' }
      ],
      make: () => ({ name: '', amount: '' })
    },
    faq: {
      box: '#repFaq', label: '질문',
      fields: [
        { k: 'q', ph: '질문', type: 'text' },
        { k: 'a', ph: '답변', type: 'textarea' }
      ],
      make: () => ({ q: '', a: '' })
    }
  };

  /* ---------------- 값 읽기/쓰기 (a.b 경로 지원) ---------------- */
  function setPath(obj, path, val) {
    const keys = path.split('.');
    let o = obj;
    for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]] = o[keys[i]] || {};
    o[keys[keys.length - 1]] = val;
  }
  function getPath(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  }

  /* ---------------- 초기 UI 만들기 ---------------- */
  function buildSelects() {
    $('#selCategory').innerHTML = Object.entries(COPY.CATEGORY)
      .map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');
    $('#selTone').innerHTML = Object.entries(COPY.TONE)
      .map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');

    $('#swatches').innerHTML = ['#FF5A3C', '#4FB6A0', '#3D6DFF', '#111827', '#C4568B', '#E8A33D']
      .map(c => `<button type="button" style="background:${c}" data-color="${c}" title="${c}"></button>`).join('');

    $('#selClaim').innerHTML = '<option value="">예시 불러오기 (원료 선택)</option>' +
      GUARD.CLAIMS.map(([n, t]) => `<option value="${RENDER.esc(t)}">${RENDER.esc(n)}</option>`).join('');

    $('#toggles').innerHTML = RENDER.ORDER.map(k =>
      `<label><input type="checkbox" data-section="${k}" checked><span>${RENDER.LABELS[k]}</span></label>`
    ).join('');
  }

  function buildRepeater(name) {
    const cfg = REPEATERS[name];
    const list = getPath(state, name) || [];
    $(cfg.box).innerHTML = list.map((item, i) => `
      <div class="rep-item">
        <div class="rep-head">
          <b>${cfg.label} ${i + 1}</b>
          <button type="button" class="rep-del" data-del="${name}" data-idx="${i}">삭제</button>
        </div>
        ${cfg.fields.map(f => f.type === 'textarea'
          ? `<textarea data-rep="${name}" data-idx="${i}" data-key="${f.k}" placeholder="${f.ph}">${RENDER.esc(item[f.k] || '')}</textarea>`
          : `<input type="${f.type}" data-rep="${name}" data-idx="${i}" data-key="${f.k}" placeholder="${f.ph}" value="${RENDER.esc(item[f.k] == null ? '' : item[f.k])}">`
        ).join('')}
      </div>`).join('');
  }

  function buildAllRepeaters() { Object.keys(REPEATERS).forEach(buildRepeater); }

  /* ---------------- 폼 ↔ 상태 ---------------- */
  function fillForm() {
    $$('[data-bind]').forEach(el => {
      const val = getPath(state, el.dataset.bind);
      el.value = val == null ? '' : val;
    });
    $$('[data-section]').forEach(el => {
      el.checked = state.sections[el.dataset.section] !== false;
    });
    buildAllRepeaters();
    drawThumbs();
  }

  function bindEvents() {
    // 일반 입력
    document.addEventListener('input', e => {
      const el = e.target;
      if (el.dataset.bind) {
        setPath(state, el.dataset.bind, el.value);
        render();
      } else if (el.dataset.rep) {
        getPath(state, el.dataset.rep)[+el.dataset.idx][el.dataset.key] = el.value;
        render();
      }
    });
    document.addEventListener('change', e => {
      const el = e.target;
      if (el.dataset.section) {
        state.sections[el.dataset.section] = el.checked;
        render();
      }
    });
    // 버튼들
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-add],[data-del],[data-color]');
      if (!t) return;
      if (t.dataset.add) {
        getPath(state, t.dataset.add).push(REPEATERS[t.dataset.add].make());
        buildRepeater(t.dataset.add); render();
      } else if (t.dataset.del) {
        getPath(state, t.dataset.del).splice(+t.dataset.idx, 1);
        buildRepeater(t.dataset.del); render();
      } else if (t.dataset.color) {
        state.color = t.dataset.color;
        $('#inpColor').value = t.dataset.color;
        render();
      }
    });
  }

  /* ---------------- 이미지 ---------------- */
  function readFiles(files, cb) {
    Array.from(files).filter(f => f.type.startsWith('image/')).forEach(f => {
      const r = new FileReader();
      r.onload = () => cb(r.result);
      r.readAsDataURL(f);
    });
  }

  function setupDrop(dropSel, multiple, onData) {
    const drop = $(dropSel);
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.multiple = multiple;
    input.style.display = 'none';
    document.body.appendChild(input);

    drop.addEventListener('click', () => input.click());
    input.addEventListener('change', () => { readFiles(input.files, onData); input.value = ''; });
    ['dragenter', 'dragover'].forEach(ev =>
      drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('on'); }));
    ['dragleave', 'drop'].forEach(ev =>
      drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('on'); }));
    drop.addEventListener('drop', e => readFiles(e.dataTransfer.files, onData));
  }

  function drawThumbs() {
    $('#thumbMain').innerHTML = state.images.main
      ? `<div class="thumb"><img src="${state.images.main}"><button type="button" data-img="main">×</button></div>` : '';
    $('#thumbDetail').innerHTML = state.images.details
      .map((src, i) => `<div class="thumb"><img src="${src}"><button type="button" data-img="detail" data-idx="${i}">×</button></div>`).join('');
  }

  function setupImages() {
    setupDrop('#dropMain', false, data => { state.images.main = data; drawThumbs(); render(); });
    setupDrop('#dropDetail', true, data => { state.images.details.push(data); drawThumbs(); render(); });
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-img]');
      if (!b) return;
      if (b.dataset.img === 'main') state.images.main = '';
      else state.images.details.splice(+b.dataset.idx, 1);
      drawThumbs(); render();
    });
  }

  /* ---------------- 미리보기 ---------------- */
  let lastCopy = null;

  function render() {
    const copy = COPY.generate(state);
    lastCopy = copy;
    $('#paper').innerHTML = RENDER.body(state, copy);
    $('#chipTone').textContent = `${copy.categoryLabel} · ${copy.toneLabel}`;
    runGuard(copy);
    fitViewport();
    save();
  }

  // 입력한 글과 자동 생성된 문구를 함께 검사한다
  function collectTexts(copy) {
    const h = state.hff || {};
    const items = [
      { label: '상품명', text: state.name },
      { label: '브랜드', text: state.brand },
      { label: '주요 고객', text: state.target },
      { label: '버튼 문구', text: state.ctaText },
      { label: '기능성 문구', text: h.claim, official: true },   // 공식 문구는 검사 제외
      { label: '보조 설명', text: h.claimSub },
      { label: '섭취 방법', text: h.intake },
      { label: '주의사항', text: h.caution, official: true },
      { label: '자동 생성 문구', text: [copy.headline, copy.sub, copy.cta, copy.painClose].join(' ') }
    ];
    (state.features || []).forEach((f, i) => {
      items.push({ label: `특징 ${i + 1}`, text: [f.title, f.desc].join(' ') });
    });
    (state.reviews || []).forEach((r, i) => items.push({ label: `후기 ${i + 1}`, text: r.txt }));
    (state.faq || []).forEach((f, i) => items.push({ label: `질문 ${i + 1}`, text: [f.q, f.a].join(' ') }));
    (state.specs || []).forEach((sp, i) => items.push({ label: `상품정보 ${i + 1}`, text: sp.v }));
    return items;
  }

  function runGuard(copy) {
    const res = GUARD.scan(collectTexts(copy));
    const sum = $('#guardSum'), box = $('#guardList'), chip = $('#chipGuard');
    const clean = res.ban === 0 && res.warn === 0;

    sum.textContent = clean ? '문제 없음' : `금지 ${res.ban} · 주의 ${res.warn}`;
    sum.className = 'guard-sum ' + (res.ban ? 'bad' : 'ok');
    chip.textContent = clean ? '광고 문구 이상 없음' : `⚠ 금지 ${res.ban} · 주의 ${res.warn}`;
    chip.className = 'chip' + (res.ban ? ' bad' : '');

    box.innerHTML = clean
      ? '<div class="guard-empty">걸릴 만한 표현이 발견되지 않았습니다. (최종 책임은 판매자에게 있습니다)</div>'
      : res.list.sort((a, b) => (a.level === b.level ? 0 : a.level === 'ban' ? -1 : 1)).map(f => `
          <div class="guard-item ${f.level}">
            <span class="w ${f.level}">${f.level === 'ban' ? '금지' : '주의'} · “${RENDER.esc(f.word)}”</span>
            <span class="where"> — ${RENDER.esc(f.where)}</span>
            <span class="fix">${RENDER.esc(f.why)} ${RENDER.esc(f.fix)}</span>
          </div>`).join('');
  }

  function fitViewport() {
    const outer = $('#viewportOuter');
    const vp = $('#viewport');
    const scale = Math.min(1, (outer.clientWidth || 860) / 860);
    vp.style.transform = `scale(${scale})`;
    const h = $('#paper').scrollHeight;
    outer.style.height = (h * scale) + 'px';
    $('#chipHeight').textContent = `높이 약 ${h.toLocaleString('ko-KR')}px`;
  }

  /* ---------------- 저장 / 복원 ---------------- */
  function save() {
    try {
      const copy = JSON.parse(JSON.stringify(state));
      delete copy.images;       // 이미지는 용량이 커서 저장하지 않습니다
      localStorage.setItem(SAVE_KEY, JSON.stringify(copy));
    } catch (e) { /* 저장 실패는 무시 */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const saved = JSON.parse(raw);
      state = Object.assign(blank(), saved, { images: { main: '', details: [] } });
      state.shipping = Object.assign({ fee: '', period: '', exchange: '', contact: '' }, saved.shipping || {});
      state.hff = Object.assign(blank().hff, saved.hff || {});
      if (!Array.isArray(state.hff.ingredients) || !state.hff.ingredients.length) {
        state.hff.ingredients = [{ name: '', amount: '' }];
      }
      return true;
    } catch (e) { return false; }
  }

  /* ---------------- 내보내기 ---------------- */
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._tm);
    t._tm = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function fileBase() {
    return (state.name || '상세페이지').replace(/[\\/:*?"<>|]/g, '').slice(0, 40) || '상세페이지';
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportHtml() {
    const html = RENDER.standalone(state, lastCopy);
    download(new Blob([html], { type: 'text/html;charset=utf-8' }), fileBase() + '.html');
    toast('HTML 파일을 저장했습니다');
  }

  async function copyHtml() {
    const html = RENDER.standalone(state, lastCopy);
    try {
      await navigator.clipboard.writeText(html);
      toast('HTML 코드를 복사했습니다');
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = html; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
      toast('HTML 코드를 복사했습니다');
    }
  }

  // 이미지 저장 1순위: html2canvas (있으면 글꼴까지 가장 비슷하게 나옵니다)
  function loadH2C() {
    if (window.html2canvas) return Promise.resolve();
    const load = new Promise((ok, no) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s.onload = ok; s.onerror = () => no(new Error('cdn'));
      document.head.appendChild(s);
    });
    const timeout = new Promise((_, no) => setTimeout(() => no(new Error('timeout')), 6000));
    return Promise.race([load, timeout]);
  }

  // 이미지 저장 2순위: 인터넷이 안 될 때도 동작하는 내장 방식
  // (상세페이지를 SVG 안에 통째로 넣어 캔버스에 그립니다)
  function canvasFromNode(node, width) {
    const height = node.scrollHeight;
    const xml = new XMLSerializer().serializeToString(node);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `<foreignObject x="0" y="0" width="${width}" height="${height}">` +
      `<div xmlns="http://www.w3.org/1999/xhtml"><style>${DETAIL_CSS.replace(/[<>&]/g, m => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[m]))}</style>${xml}</div>` +
      `</foreignObject></svg>`;
    return new Promise((ok, no) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = width; c.height = height;
        const g = c.getContext('2d');
        g.fillStyle = '#ffffff'; g.fillRect(0, 0, width, height);
        g.drawImage(img, 0, 0);
        ok(c);
      };
      img.onerror = () => no(new Error('svg'));
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }

  async function exportPng() {
    const btn = $('#btnPng');
    const old = btn.textContent;
    btn.textContent = '이미지 만드는 중…'; btn.disabled = true;
    const vp = $('#viewport');
    const prevTransform = vp.style.transform;
    try {
      vp.style.transform = 'none';          // 원본 크기로 캡처
      let canvas;
      try {
        await loadH2C();
        canvas = await html2canvas($('#paper'), {
          backgroundColor: '#ffffff', scale: 1, useCORS: true, logging: false,
          width: 860, windowWidth: 860
        });
      } catch (e) {
        canvas = await canvasFromNode($('#paper .dp'), 860);   // 인터넷 없이 저장
      }
      vp.style.transform = prevTransform;

      const SLICE = 2400;                   // 한 장이 너무 길면 나눠 저장
      if (canvas.height <= SLICE) {
        await saveCanvas(canvas, fileBase() + '.png');
        toast('이미지 1장을 저장했습니다');
      } else {
        const n = Math.ceil(canvas.height / SLICE);
        for (let i = 0; i < n; i++) {
          const h = Math.min(SLICE, canvas.height - i * SLICE);
          const c = document.createElement('canvas');
          c.width = canvas.width; c.height = h;
          c.getContext('2d').drawImage(canvas, 0, i * SLICE, canvas.width, h, 0, 0, canvas.width, h);
          await saveCanvas(c, `${fileBase()}_${String(i + 1).padStart(2, '0')}.png`);
          await new Promise(r => setTimeout(r, 350));   // 브라우저 다운로드 차단 방지
        }
        toast(`이미지 ${n}장으로 나눠 저장했습니다 (순서대로 업로드하세요)`);
      }
    } catch (e) {
      vp.style.transform = prevTransform;
      toast('이미지 저장에 실패했습니다. 인터넷 연결을 확인하거나 HTML 저장을 이용해 주세요');
    } finally {
      btn.textContent = old; btn.disabled = false;
    }
  }

  function saveCanvas(canvas, name) {
    return new Promise(ok => {
      canvas.toBlob(blob => { download(blob, name); ok(); }, 'image/png');
    });
  }

  /* ---------------- 예시 데이터 ---------------- */
  function sample() {
    state = Object.assign(blank(), {
      category: 'hff', tone: 'trust',
      brand: '몽글랩', name: '밀크씨슬 간건강 30포',
      target: '회식 잦은 40대 직장인',
      price: '39000', salePrice: '29000',
      color: '#2F8F5B', ctaText: '한 달분 시작하기',
      features: [
        { title: '1포에 실리마린 130mg', desc: '' },
        { title: '물 없이 넘기는 스틱형 분말', desc: '가방에 넣고 다니다 생각날 때 바로 털어 넣으면 됩니다.' },
        { title: 'GMP 인증 시설에서 국내 생산', desc: '' },
        { title: '합성감미료·착색료 무첨가', desc: '' }
      ],
      hff: {
        claim: '간 건강에 도움을 줄 수 있음',
        claimSub: '1일 섭취량 1포에 기능성 원료 밀크씨슬 추출물 130mg 함유',
        ingredients: [
          { name: '밀크씨슬 추출물(실리마린)', amount: '130mg' },
          { name: '비타민B1(티아민)', amount: '1.2mg' },
          { name: '아연', amount: '8.5mg' }
        ],
        intake: '1일 1회, 1회 1포를 충분한 물과 함께 섭취하세요.\n정해진 시간에 드시면 거르지 않고 챙기기 좋습니다.',
        caution: '임산부·수유부, 어린이는 섭취에 주의하세요.\n의약품 복용 중이거나 알레르기 체질인 분은 전문가와 상담 후 섭취하세요.\n이상사례 발생 시 섭취를 중단하고 전문가와 상담하십시오.',
        allergy: '대두 함유',
        reportNo: '20250000000000',
        reviewNo: ''
      },
      specs: [
        { k: '내용량', v: '2g × 30포 (30일분)' },
        { k: '제품 형태', v: '스틱형 분말' },
        { k: '보관방법', v: '직사광선을 피해 서늘한 곳에 보관' },
        { k: '제조원', v: '국내 GMP 인증 제조시설' }
      ],
      reviews: [
        { star: 5, txt: '물 없이 털어 넣는 게 편해서 한 달 동안 한 번도 안 거르고 먹었어요.', who: '박O수 님' }
      ],
      shipping: {
        fee: '3,000원 (3만원 이상 무료배송)',
        period: '오후 2시 이전 결제 시 당일 출고',
        exchange: '미개봉 상품에 한해 수령 후 7일 이내 교환·반품 가능',
        contact: '상품 문의 게시판 또는 카카오채널'
      }
    });
    fillForm(); render();
    toast('건강기능식품 예시를 채웠습니다. 내용만 바꿔 쓰세요');
  }

  /* ---------------- 시작 ---------------- */
  function init() {
    // 상세페이지 템플릿 스타일 삽입
    const st = document.createElement('style');
    st.textContent = DETAIL_CSS;
    document.head.appendChild(st);

    buildSelects();
    if (!load()) state = blank();
    fillForm();
    bindEvents();
    setupImages();

    $('#selClaim').onchange = e => {
      if (!e.target.value) return;
      state.hff.claim = e.target.value;
      $('[data-bind="hff.claim"]').value = e.target.value;
      e.target.value = '';
      render();
      toast('예시 문구를 넣었습니다. 내 제품 표시사항과 같은지 꼭 확인하세요');
    };

    $('#btnSample').onclick = sample;
    $('#btnRecopy').onclick = () => { state.variant = (state.variant || 0) + 1; render(); toast('다른 문구로 바꿨습니다'); };
    $('#btnCopy').onclick = copyHtml;
    $('#btnHtml').onclick = exportHtml;
    $('#btnPng').onclick = exportPng;
    $('#btnReset').onclick = () => {
      if (!confirm('입력한 내용을 모두 지우고 처음부터 시작할까요?')) return;
      localStorage.removeItem(SAVE_KEY);
      state = blank(); fillForm(); render(); toast('초기화했습니다');
    };

    window.addEventListener('resize', fitViewport);
    render();
    if (!state.name) sample();   // 처음 열었을 때 빈 화면 대신 예시를 보여줍니다
  }

  document.addEventListener('DOMContentLoaded', init);
})();
