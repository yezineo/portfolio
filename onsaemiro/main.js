// 햄버거 메뉴
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    menuBtn.classList.toggle('is-open');
});

// 스크롤 네비바
const menuWrap = document.querySelector('.menu-wrap');
const menuItems = menuWrap.querySelectorAll('li');
const navSections = document.querySelectorAll('#products, #story, #gallery, #contact');

window.addEventListener('scroll', () => {
    menuWrap.classList.toggle('show', window.scrollY > 100);

    navSections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= 200 && rect.bottom >= 200) {
            menuItems.forEach(item => item.classList.remove('active'));
            menuItems[i].classList.add('active');
        }
    });
});

// 네비 클릭 이동 (sticky 대응)
document.querySelectorAll('nav a, .menu-wrap a').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId.startsWith('#')) return;

        e.preventDefault();

        let top;
        if (targetId === '#gallery') {
            const stickyBox = document.querySelector('.sticky-box');
            const relative = document.querySelector('.relative');
            top = stickyBox.offsetTop - relative.offsetHeight;  // 갤러리 원래 자리
        } else if (targetId === '#contact') {
            top = document.querySelector('.sticky-box').offsetTop;
        } else {
            const target = document.querySelector(targetId);
            if (!target) return;
            top = target.offsetTop;
        }

        window.scrollTo({ top, behavior: 'smooth' });

        // 모바일 메뉴 닫기 ← 여기
        document.querySelector('nav').classList.remove('is-open');
        document.querySelector('.menu-btn').classList.remove('is-open');
    });
});

// 기타농산물 - 슬라이더
const seasonData = {
    spring: 2,
    summer: 2,
    fall: 8,
    winter: 1
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
    slidesPerView: 2,
    spaceBetween: 10,
    loopedSlides: 2,
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

// 버튼 클릭 (버튼 active만 처리)
document.querySelectorAll('[data-season]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const season = e.target.dataset.season;
    swiper.slideToLoop(startIndices[season]);
    
    document.querySelectorAll('[data-season]').forEach(b => {
      b.classList.remove('active');
    });
    e.target.classList.add('active');
  });
});

// 화살표로 넘길 때 (애니메이션 완료 후)
swiper.on('slideChangeTransitionEnd', () => {
  const activeSlide = document.querySelector('.g-slider .swiper-slide-active');
  if (activeSlide && activeSlide.dataset.season) {
    const season = activeSlide.dataset.season;
    
    document.querySelectorAll('[data-season]').forEach(b => {
      b.classList.remove('active');
    });
    document.querySelector(`[data-season="${season}"]`).classList.add('active');
  }
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
