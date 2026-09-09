// 병원 실제 이메일로 교체 필요
const HOSPITAL_EMAIL = 'reservation@monglvet.com';

const reservationForm = document.getElementById('reservationForm');
const formSuccess = document.getElementById('formSuccess');

reservationForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(reservationForm).entries());

  const subject = `[온라인 예약] ${data.ownerName}님 - ${data.visitDate}`;
  const body = [
    `보호자 성명: ${data.ownerName}`,
    `연락처: ${data.ownerPhone}`,
    `반려동물 이름: ${data.petName || '-'}`,
    `반려동물 종류: ${data.petType}`,
    `희망 날짜: ${data.visitDate}`,
    `희망 시간대: ${data.visitTime}`,
    `진료 항목: ${data.visitReason}`,
    `요청사항: ${data.visitMemo || '-'}`
  ].join('\n');

  const mailtoUrl = `mailto:${HOSPITAL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoUrl;

  formSuccess.classList.add('show');
  reservationForm.reset();
});
