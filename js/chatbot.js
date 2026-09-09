const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatBody = document.getElementById('chatBody');
const chatQuick = document.getElementById('chatQuick');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

const KNOWLEDGE_BASE = [
  {
    keywords: ['시간', '언제', '몇시', '영업'],
    label: '진료시간',
    answer: '진료시간은 평일 09:30~19:30, 토요일 09:30~15:00입니다. 일요일과 공휴일은 휴진이며, 점심시간은 13:00~14:00입니다.'
  },
  {
    keywords: ['비용', '가격', '진료비', '얼마'],
    label: '진료비',
    answer: '진찰료는 10,000원부터, 엑스레이·혈액검사 등 주요 비급여 항목은 홈페이지 "진료비안내" 섹션에서 확인하실 수 있어요. 정확한 금액은 아이 상태에 따라 방문 상담 시 안내드립니다.'
  },
  {
    keywords: ['예약', '접수'],
    label: '예약방법',
    answer: '전화(02-1234-5678) 또는 홈페이지의 "온라인 예약" 폼으로 예약하실 수 있습니다. 예약 후 병원에서 확인 연락을 드려요.'
  },
  {
    keywords: ['위치', '주소', '오시는', '어디', '주차'],
    label: '오시는길',
    answer: '주소는 서울특별시 OO구 OO로 123 몽글빌딩 1층이며, OO역 3번 출구에서 도보 5분입니다. 건물 내 방문객 주차 2시간 무료 제공됩니다.'
  },
  {
    keywords: ['응급', '야간', '위급'],
    label: '응급진료',
    answer: '진료시간 외 응급 상황은 대표 전화(02-1234-5678)로 먼저 연락 주시면 제휴 응급동물의료센터로 신속히 안내드립니다.'
  },
  {
    keywords: ['의료진', '원장', '의사', '수의사'],
    label: '의료진',
    answer: '김민준 대표원장(외과), 이서연 부원장(내과/영상의학), 박도윤 진료수의사(치과/피부과)가 진료하고 있습니다. 자세한 프로필은 "의료진" 섹션에서 확인해 주세요.'
  }
];

const FALLBACK_ANSWER = '죄송해요, 정확히 이해하지 못했어요. 자세한 상담은 02-1234-5678로 전화 주시면 친절히 안내드릴게요!';

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${sender}`;
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function findAnswer(text) {
  const lower = text.toLowerCase();
  const matched = KNOWLEDGE_BASE.find(item =>
    item.keywords.some(keyword => lower.includes(keyword))
  );
  return matched ? matched.answer : FALLBACK_ANSWER;
}

function renderQuickReplies() {
  chatQuick.innerHTML = '';
  KNOWLEDGE_BASE.forEach(item => {
    const btn = document.createElement('button');
    btn.textContent = item.label;
    btn.addEventListener('click', () => handleUserMessage(item.label, item.answer));
    chatQuick.appendChild(btn);
  });
}

function handleUserMessage(text, presetAnswer) {
  addMessage(text, 'user');
  setTimeout(() => {
    addMessage(presetAnswer || findAnswer(text), 'bot');
  }, 400);
}

chatToggle.addEventListener('click', () => {
  chatWindow.classList.toggle('open');
  if (chatWindow.classList.contains('open') && chatBody.children.length === 0) {
    addMessage('안녕하세요! 몽글동물병원 안내 챗봇입니다 🐾 궁금한 점을 선택하거나 직접 입력해 주세요.', 'bot');
    renderQuickReplies();
  }
});

chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  handleUserMessage(text);
  chatInput.value = '';
});
