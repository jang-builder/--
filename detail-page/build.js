/* ============================================================
   build.js
   index.html + css + js 를 하나로 합쳐 "파일 1개 버전"을 만든다.
   사용법: node detail-page/build.js
   결과물: detail-page/상세페이지-생성기.html  (더블클릭으로 실행)
   ============================================================ */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const read = p => fs.readFileSync(path.join(DIR, p), 'utf8');

// replace()의 두 번째 인자를 문자열로 주면 코드 안의 $$ 가 $ 로 바뀝니다.
// (app.js의 $$ 같은 변수명이 깨짐) → 반드시 함수로 넘깁니다.
const put = (src, find, text) => src.replace(find, () => text);

// --preset <파일> 을 주면 그 제품 정보가 들어간 전용 파일이 만들어진다
const args = process.argv.slice(2);
const presetPath = args.includes('--preset') ? args[args.indexOf('--preset') + 1] : null;
const outName = args.includes('--out') ? args[args.indexOf('--out') + 1] : '상세페이지-생성기.html';

let html = read('index.html');

// 1) 외부 CSS 링크 → 내용 그대로 삽입
html = put(html,
  '<link rel="stylesheet" href="css/generator.css">',
  '<style>\n' + read('css/generator.css') + '\n</style>'
);

// 2) 외부 JS 태그 → 내용 그대로 삽입
['js/copywriter.js', 'js/health-guard.js', 'js/detail-style.js', 'js/render.js', 'js/app.js'].forEach(f => {
  html = put(html,
    `<script src="${f}"></script>`,
    '<script>\n' + read(f) + '\n</script>'
  );
});

// 3) 내 제품 정보 심기
if (presetPath) {
  const preset = fs.readFileSync(path.resolve(presetPath), 'utf8');
  JSON.parse(preset);   // 형식이 깨졌으면 여기서 멈춘다
  html = put(html, '<script>\n' + read('js/copywriter.js'),
    '<script>window.PRESET = ' + preset + ';</script>\n<script>\n' + read('js/copywriter.js'));
}

// 4) 합쳐진 파일이라는 표시
html = put(html, '</title>',
  '</title>\n<!-- 파일 1개 버전: 이 파일만 있으면 어디서든 열립니다. 수정은 detail-page/ 원본에서 하고 node detail-page/build.js 로 다시 만드세요. -->');

const out = path.join(DIR, outName);
fs.writeFileSync(out, html);
console.log('만들었습니다:', out, `(${Math.round(fs.statSync(out).size / 1024)}KB)`);
