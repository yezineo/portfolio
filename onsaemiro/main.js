// 햄버거 메뉴
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    menuBtn.classList.toggle('is-open');
});

// 기타농산물 - 슬라이더
const seasonData = {
    spring: 1,
    summer: 4,
    fall: 3,
    winter: 2
};

const seasons = Object.keys(seasonData);
const startIndices = {};
let currentIndex = 0;

seasons.forEach(season => {
  startIndices[season] = currentIndex;
  currentIndex += seasonData[season];
});

const swiper = new Swiper('.g-slider', {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 10,
    loopedSlides: 3,
    breakpoints: {
        768: {
            slidesPerView: 4,
            spaceBetween: 20,
            loopedSlides: 4,
        },
        1024: {
            slidesPerView: 5,
            loopedSlides: 5,
            spaceBetween: 30,
        },
    },
    pagination: {
        el: '.products-grid .swiper-pagination',
    },
    navigation: {
         nextEl: '.progrid-wrap .swiper-button-next',
         prevEl: '.progrid-wrap .swiper-button-prev',
    },
});

document.querySelectorAll('[data-season]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const season = e.target.dataset.season;
    const slideIndex = startIndices[season];
    
    // 클릭한 계절의 첫 번째 이미지로 슬라이더 이동
    swiper.slideToLoop(slideIndex);
    
    // 버튼 active 상태 업데이트 (필수)
    document.querySelectorAll('[data-season]').forEach(b => {
      b.classList.remove('active');
    });
    e.target.classList.add('active');
  });
});

swiper.on('slideChange', () => {
  const currentIndex = swiper.realIndex; // loop 무시하고 실제 인덱스
  
  // 현재 인덱스가 어느 계절에 속하는지 파악
  let activeSeason = 'spring';
  if (currentIndex >= 8) activeSeason = 'winter';
  else if (currentIndex >= 5) activeSeason = 'fall';
  else if (currentIndex >= 1) activeSeason = 'summer';
  
  // 버튼 active 업데이트
  document.querySelectorAll('[data-season]').forEach(b => {
    b.classList.remove('active');
  });
  document.querySelector(`[data-season="${activeSeason}"]`).classList.add('active');
});


// 리뷰 섹션 - 슬라이더
const reviewSwiper = new Swiper('.r-slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 4000,                      // 4초마다 넘김
        disableOnInteraction: false,      // 조작해도 자동재생 유지
        pauseOnMouseEnter: true,          // 마우스 올리면 멈춤
    },
    pagination: {
        el: '.review-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.review-wrap-next',
        prevEl: '.review-wrap-prev',
    },
});


// aos 스크립트 라이브러리
AOS.init({
    duration: 1000,
    delay: 200
});

// 스크롤 로직
const topBtn = document.querySelector('.top-btn');

window.addEventListener('scroll', () => {
    topBtn.classList.toggle('show', window.scrollY > 300);
});

topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// chat bot
const floatingBtn = document.querySelector('.floating-btn');
const chatbotBtn = document.querySelector('.chatbot-btn');
const cbTabs = document.querySelectorAll('.cb-tab');
const cbHome = document.querySelector('.cb-home');
const cbChat = document.querySelector('.cb-chat');
const cbInquiry = document.querySelector('.cb-inquiry');
const cbBack = document.querySelector('.cb-back');

// 열기/닫기
chatbotBtn.addEventListener('click', () => {
    floatingBtn.classList.toggle('is-open');
});

// 화면 전환
function showScreen(name) {
    cbHome.classList.toggle('is-active', name === 'home');
    cbChat.classList.toggle('is-active', name === 'chat');
    cbTabs.forEach(t => t.classList.toggle('is-active', t.dataset.screen === name));
}

cbTabs.forEach(tab => {
    tab.addEventListener('click', () => showScreen(tab.dataset.screen));
});

cbInquiry.addEventListener('click', () => showScreen('chat'));
cbBack.addEventListener('click', () => showScreen('home'));
