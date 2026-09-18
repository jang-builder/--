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
    category: 'food', tone: 'trust',
    brand: '', name: '', target: '',
    price: '', salePrice: '',
    color: '#FF5A3C', ctaText: '구매하러 가기',
    variant: 0,
    features: [{ title: '', desc: '' }, { title: '', desc: '' }, { title: '', desc: '' }],
    specs: [{ k: '', v: '' }],
    reviews: [],
    faq: [],
    shipping: { fee: '', period: '', exchange: '', contact: '' },
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

    $('#toggles').innerHTML = RENDER.ORDER.map(k =>
      `<label><input type="checkbox" data-section="${k}" checked><span>${RENDER.LABELS[k]}</span></label>`
    ).join('');
  }

  function buildRepeater(name) {
    const cfg = REPEATERS[name];
    const list = state[name] || [];
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
        state[el.dataset.rep][+el.dataset.idx][el.dataset.key] = el.value;
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
        state[t.dataset.add].push(REPEATERS[t.dataset.add].make());
        buildRepeater(t.dataset.add); render();
      } else if (t.dataset.del) {
        state[t.dataset.del].splice(+t.dataset.idx, 1);
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
    fitViewport();
    save();
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
      category: 'food', tone: 'trust',
      brand: '몽글푸드', name: '집밥 한상 소고기무국',
      target: '혼자 사는 30대 직장인',
      price: '19800', salePrice: '14800',
      color: '#FF5A3C', ctaText: '오늘의 한 끼 주문하기',
      features: [
        { title: '국내산 한우 양지 25% 이상', desc: '' },
        { title: '끓이지 않고 3분 데우기만', desc: '봉지째 뜨거운 물에 3분, 설거지도 냄비 하나 없이 끝납니다.' },
        { title: '나트륨 30% 낮춘 저염 레시피', desc: '' },
        { title: '1인분씩 소분 진공 포장', desc: '' }
      ],
      specs: [
        { k: '중량', v: '500g × 2팩 (1팩 1인분)' },
        { k: '보관방법', v: '냉동 보관 (-18℃ 이하)' },
        { k: '원산지', v: '소고기: 국산 / 무: 국산' },
        { k: '조리방법', v: '중탕 3분 또는 전자레인지 2분 30초' }
      ],
      reviews: [
        { star: 5, txt: '자취 3년 만에 제대로 된 국 먹어봤어요. 고기가 진짜 들어있습니다.', who: '김O진 님' },
        { star: 5, txt: '엄마가 끓여준 맛이랑 비슷해서 재구매했어요.', who: '이O영 님' }
      ],
      shipping: {
        fee: '3,000원 (3만원 이상 무료배송)',
        period: '오후 2시 이전 결제 시 당일 출고',
        exchange: '냉동식품 특성상 단순 변심 반품은 어렵습니다 (배송 사고는 전액 보상)',
        contact: '상품 문의 게시판 또는 카카오채널 @몽글푸드'
      }
    });
    fillForm(); render();
    toast('예시를 채웠습니다. 내용만 바꿔 쓰세요');
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
