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

// 계절 버튼 클릭
const seasonBtns = document.querySelectorAll('.season-tabs button');

seasonBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const season = btn.dataset.season;
    swiper.slideToLoop(startIndices[season]);

    seasonBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// 화살표로 넘길 때 (애니메이션 완료 후) 탭 표시 맞추기
swiper.on('slideChangeTransitionEnd', () => {
  const activeSlide = document.querySelector('.g-slider .swiper-slide-active');
  if (activeSlide && activeSlide.dataset.season) {
    const season = activeSlide.dataset.season;
    seasonBtns.forEach(b => b.classList.toggle('active', b.dataset.season === season));
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

// ===== 챗봇 =====
const floatingBtn = document.querySelector('.floating-btn');
const chatbotBtn = document.querySelector('.chatbot-btn');
const cbPanel = document.querySelector('.chatbot-panel');
const cbTabs = document.querySelectorAll('.cb-tab');
const cbScreens = {
    home: document.querySelector('.cb-home'),
    list: document.querySelector('.cb-list'),
    chat: document.querySelector('.cb-chat'),
};
const cbMessages = document.querySelector('.cb-messages');
const cbLog = document.querySelector('.cb-log');
const cbListBody = document.querySelector('.cb-list-body');
const cbEmpty = document.querySelector('.cb-empty');
const cbTextarea = document.querySelector('.cb-input textarea');
const cbSend = document.querySelector('.cb-send');

// 열기 / 닫기
function setChatbot(open) {
    floatingBtn.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('cb-open', open);   // 뒤 페이지 스크롤 막기 (html에 걸어야 함)
    chatbotBtn.setAttribute('aria-expanded', open);
    chatbotBtn.setAttribute('aria-label', open ? '챗봇 닫기' : '챗봇 열기');
}
chatbotBtn.addEventListener('click', () => setChatbot(!floatingBtn.classList.contains('is-open')));
document.querySelector('.cb-close').addEventListener('click', () => setChatbot(false));
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setChatbot(false);   // ESC로도 닫기
});

// 화면 전환 (홈 / 대화 목록 / 대화창)
function showScreen(name) {
    Object.entries(cbScreens).forEach(([key, el]) => el.classList.toggle('is-active', key === name));
    cbTabs.forEach(t => t.classList.toggle('is-active', t.dataset.screen === name));
    cbPanel.dataset.screen = name;
    if (name === 'list') renderList();
}
cbTabs.forEach(tab => tab.addEventListener('click', () => showScreen(tab.dataset.screen)));
document.querySelectorAll('.cb-inquiry, .cb-new').forEach(btn => btn.addEventListener('click', startNewChat));
document.querySelector('.cb-back').addEventListener('click', () => showScreen('list'));

// ▼ 답변 문구 — 실제 답을 받으면 여기 글자만 바꾸면 돼요
const CONTACT_LINKS =
    '<div class="cb-links">' +
    '<a href="tel:01031048972" class="cb-link">📞 전화 문의</a>' +
    '<a href="https://pf.kakao.com/_xeBFwX/chat" target="_blank" rel="noopener" class="cb-link">💬 카카오톡 문의</a>' +
    '</div>';

const TEMP_ANSWER =
    '확인이 필요한 내용이라<br>전화나 카카오톡으로 문의해 주세요.<br>평일 9:00 - 18:00 (점심 12:00 - 13:00)';

const faqAnswers = {
    delivery: TEMP_ANSWER,                    // 배송 조회
    cancel: TEMP_ANSWER,                      // 주문취소
    season: '온새미로에서 계절마다 만나볼 수 있는 농산물이에요 🌿<br><br>' +
            '봄 : 체리, 체리잼<br>' +
            '여름 : 옥수수, 마늘<br>' +
            '가을 : 사과, 사과즙, 들깨, 참깨, 배추, 호두, 백두 · 녹두(콩)<br>' +
            '겨울 : 도라지<br><br>' +
            '수확 시기에 따라 품목이 달라질 수 있어요.',
    return: TEMP_ANSWER,                      // 교환 · 반품
    price: '가격과 재고는 수확 시기에 따라 달라서<br>문의하시면 안내해 드려요.', // 배송비는 부모님 확인 후 추가
    bulk: TEMP_ANSWER,                        // 대량주문
};

const AI_READY = 'AI 답변은 준비 중이에요.<br>위의 버튼을 누르거나 전화 · 카카오톡으로 문의해 주세요.';
// ▲ 답변 문구 끝

// ▼ 대화 저장 (이 브라우저에만)
const STORE_KEY = 'onsaemiro-chats';
function loadChats() {
    try {
        return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
    } catch (e) {
        return [];
    }
}
function saveChats() {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(chats));
    } catch (e) {
        // 저장이 막힌 브라우저(시크릿 창 등)면 저장만 건너뜀
    }
}
let chats = loadChats();
let currentId = null;   // 지금 보고 있는 대화 (null이면 새 대화)

function formatTime(ms) {
    const min = Math.floor((Date.now() - ms) / 60000);
    if (min < 1) return '방금';
    if (min < 60) return `${min}분 전`;

    const d = new Date(ms);
    const pad = n => String(n).padStart(2, '0');
    if (d.toDateString() === new Date().toDateString()) {
        return `${pad(d.getHours())}:${pad(d.getMinutes())}`;   // 오늘이면 시간
    }
    return `${d.getMonth() + 1}/${d.getDate()}`;                // 지난 날이면 날짜
}
function toPlain(html) {
    const div = document.createElement('div');
    div.innerHTML = html.replace(/<br\s*\/?>/g, ' ');
    return div.textContent;
}

// 대화 목록 그리기
function renderList() {
    cbListBody.querySelectorAll('.cb-item').forEach(el => el.remove());
    cbEmpty.hidden = chats.length > 0;

    chats.slice()
        .sort((a, b) => b.updatedAt - a.updatedAt)   // 최근 대화가 위로
        .forEach(chat => {
            const last = chat.messages[chat.messages.length - 1];

            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'cb-item';
            item.innerHTML =
                '<img src="img/chatmain/farmer-icon.svg" alt="" class="cb-item-avatar">' +
                '<div class="cb-item-main">' +
                    '<div class="cb-item-top">' +
                        '<span class="cb-item-name">온새미로 농장</span>' +
                        '<span class="cb-item-time"></span>' +
                    '</div>' +
                    '<p class="cb-item-last"></p>' +
                '</div>';

            item.querySelector('.cb-item-time').textContent = formatTime(chat.updatedAt);
            item.querySelector('.cb-item-last').textContent =
                last.who === 'user' ? last.text : toPlain(last.text);   // 마지막 말 (보통 챗봇 답)

            item.addEventListener('click', () => openChat(chat.id));
            cbListBody.appendChild(item);
        });
}

// 말풍선 그리기
function drawBot(html) {
    const msg = document.createElement('div');
    msg.className = 'cb-bot';
    msg.innerHTML = html + CONTACT_LINKS;
    cbLog.appendChild(msg);
}
function drawUser(text) {
    const msg = document.createElement('p');
    msg.className = 'cb-user';
    msg.textContent = text;   // 사용자가 쓴 글은 textContent로 (코드 실행 방지)
    cbLog.appendChild(msg);
}
function scrollDown() {
    cbMessages.scrollTop = cbMessages.scrollHeight;
}

// 새 대화 / 지난 대화 열기
function startNewChat() {
    currentId = null;
    cbLog.innerHTML = '';
    showScreen('chat');
    cbMessages.scrollTop = 0;
}
function openChat(id) {
    const chat = chats.find(c => c.id === id);
    if (!chat) return;
    currentId = id;
    cbLog.innerHTML = '';
    chat.messages.forEach(m => (m.who === 'user' ? drawUser(m.text) : drawBot(m.text)));
    showScreen('chat');
    scrollDown();
}

// 말하기 = 화면에 그리고 + 저장
function say(who, text) {
    if (who === 'user') drawUser(text);
    else drawBot(text);

    let chat = chats.find(c => c.id === currentId);
    if (!chat) {   // 첫 메시지면 새 대화 만들기 (제목 = 첫 질문)
        chat = { id: Date.now(), title: text, updatedAt: Date.now(), messages: [] };
        chats.push(chat);
        currentId = chat.id;
    }
    chat.messages.push({ who, text });
    chat.updatedAt = Date.now();
    saveChats();
    scrollDown();
}

// 질문 버튼
document.querySelectorAll('.cb-quick button').forEach(btn => {
    btn.addEventListener('click', () => {
        say('user', btn.textContent);
        say('bot', faqAnswers[btn.dataset.faq]);
    });
});

// 입력창 (AI는 나중에)
function sendText() {
    const text = cbTextarea.value.trim();
    if (!text) return;
    cbTextarea.value = '';
    say('user', text);
    say('bot', AI_READY);
}
cbSend.addEventListener('click', sendText);
cbTextarea.addEventListener('keydown', (e) => {
    // 한글 입력 중 Enter는 무시 (두 번 보내지는 것 방지)
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        sendText();
    }
});