// ============================================================
// AHMED.M Portfolio — script.js
// ============================================================

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('designer-theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

themeToggle.addEventListener('click', () => {
    const isDark = htmlEl.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('designer-theme', next);
});

// ===== MOBILE NAV =====
const menuBtn    = document.getElementById('menu-btn');
const mobileNav  = document.getElementById('mobile-nav');
const closeNav   = document.getElementById('close-nav');
const navOverlay = document.getElementById('nav-overlay');

function openNav()  { mobileNav.classList.add('open'); navOverlay.classList.add('show'); document.body.style.overflow='hidden'; }
function closeNavFn(){ mobileNav.classList.remove('open'); navOverlay.classList.remove('show'); document.body.style.overflow=''; }

menuBtn.addEventListener('click', openNav);
closeNav.addEventListener('click', closeNavFn);
navOverlay.addEventListener('click', closeNavFn);
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeNavFn));

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== PROJECT DATA =====
// Each project: { src, title, category }
// Categories: 'food' | 'product' | 'ads'
const projects = [
    { src: 'images/10lemon Juice(1).png',          title: 'Lemon Juice Ad',         category: 'food'    },
    { src: 'images/11chocoberry desgin.png',        title: 'Chocoberry Design',      category: 'food'    },
    { src: 'images/13headphones (1).png',           title: 'Headphones Campaign',    category: 'product' },
    { src: 'images/15smartWatch.png',               title: 'Smart Watch Ad',         category: 'product' },
    { src: 'images/18Client1Ad(1).png',             title: 'Client Ad #1',           category: 'ads'     },
    { src: 'images/2 burger design2.jpg',           title: 'Burger Design II',       category: 'food'    },
    { src: 'images/20ShoeAd.png',                   title: 'Shoe Campaign',          category: 'ads'     },
    { src: 'images/22client1Ad2(2).png',            title: 'Client Campaign II',     category: 'ads'     },
    { src: 'images/22clientAd2(3).png',             title: 'Client Campaign III',    category: 'ads'     },
    { src: 'images/29ice cream (1) (5).jpg',        title: 'Ice Cream Visual',       category: 'food'    },
    { src: 'images/30orange juice.jpg',             title: 'Orange Juice Ad',        category: 'food'    },
    { src: 'images/31LEMON juice.jpg',              title: 'Lemon Juice Promo',      category: 'food'    },
    { src: 'images/32BurgerAd.jpg',                 title: 'Burger Ad',              category: 'food'    },
    { src: 'images/37Desserts menu.jpg',            title: 'Desserts Menu',          category: 'food'    },
    { src: 'images/4khamsat image4.jpg',            title: 'Khamsat Visual',         category: 'ads'     },
    { src: 'images/5BURGER DESIGN.png',             title: 'Burger Design',          category: 'food'    },
    { src: 'images/7 foods.png',                    title: 'Food Spread',            category: 'food'    },
];

// ===== GALLERY RENDER =====
const galleryGrid = document.getElementById('gallery-grid');
let activeFilter   = 'all';
let lightboxIndex  = 0;
let filteredItems  = [];

function buildGallery(list) {
    galleryGrid.innerHTML = '';
    list.forEach((proj, i) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = i;
        item.dataset.category = proj.category;
        item.innerHTML = `
            <img src="${proj.src}" alt="${proj.title}" loading="lazy">
            <div class="gallery-overlay">
                <button class="gallery-zoom-btn" aria-label="Open ${proj.title}">
                    <i class="fas fa-expand"></i>
                </button>
                <h3>${proj.title}</h3>
                <span>${proj.category}</span>
            </div>
        `;

        // Staggered reveal
        setTimeout(() => item.classList.add('visible'), i * 80);

        // Lightbox open
        item.addEventListener('click', () => openLightbox(i));

        // Subtle tilt on mouse
        item.addEventListener('mousemove', (e) => {
            const r   = item.getBoundingClientRect();
            const rx  = ((e.clientY - r.top)  / r.height - 0.5) * -12;
            const ry  = ((e.clientX - r.left) / r.width  - 0.5) *  12;
            item.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });

        galleryGrid.appendChild(item);
    });
    filteredItems = list;
}

buildGallery(projects);

// ===== FILTER TABS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        activeFilter = btn.dataset.filter;

        const filtered = activeFilter === 'all'
            ? projects
            : projects.filter(p => p.category === activeFilter);

        buildGallery(filtered);
    });
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');
const lbTitle  = document.getElementById('lb-title');
const lbCtr    = document.getElementById('lb-counter');

function openLightbox(idx) {
    lightboxIndex = idx;
    showLightboxItem();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('lb-close').focus();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showLightboxItem() {
    const proj  = filteredItems[lightboxIndex];
    lbImg.src   = proj.src;
    lbImg.alt   = proj.title;
    lbTitle.textContent  = proj.title;
    lbCtr.textContent    = `${lightboxIndex + 1} / ${filteredItems.length}`;
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length;
    showLightboxItem();
});
document.getElementById('lb-next').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % filteredItems.length;
    showLightboxItem();
});
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')  { lightboxIndex = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length; showLightboxItem(); }
    if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % filteredItems.length; showLightboxItem(); }
});

// ===== FILE UPLOADER =====
const uploader  = document.getElementById('uploader');
const fileInput = document.getElementById('file-input');

uploader.addEventListener('click', () => fileInput.click());
uploader.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });

uploader.addEventListener('dragover', (e) => { e.preventDefault(); uploader.classList.add('dragover'); });
uploader.addEventListener('dragleave', () => uploader.classList.remove('dragover'));
uploader.addEventListener('drop', (e) => {
    e.preventDefault();
    uploader.classList.remove('dragover');
    handleFiles([...e.dataTransfer.files]);
});

fileInput.addEventListener('change', () => handleFiles([...fileInput.files]));

function handleFiles(files) {
    const imgs = files.filter(f => f.type.startsWith('image/'));
    imgs.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const newProj = {
                src: ev.target.result,
                title: file.name.replace(/\.[^/.]+$/, ''),
                category: 'ads'
            };
            projects.push(newProj);
            if (activeFilter === 'all' || newProj.category === activeFilter) {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                const newIdx = filteredItems.length;
                filteredItems.push(newProj);
                item.dataset.index = newIdx;
                item.innerHTML = `
                    <img src="${newProj.src}" alt="${newProj.title}" loading="lazy">
                    <div class="gallery-overlay">
                        <button class="gallery-zoom-btn" aria-label="Open ${newProj.title}">
                            <i class="fas fa-expand"></i>
                        </button>
                        <h3>${newProj.title}</h3>
                        <span>${newProj.category}</span>
                    </div>
                `;
                item.addEventListener('click', () => openLightbox(newIdx));
                item.addEventListener('mousemove', (e) => {
                    const r  = item.getBoundingClientRect();
                    const rx = ((e.clientY - r.top)  / r.height - 0.5) * -12;
                    const ry = ((e.clientX - r.left) / r.width  - 0.5) *  12;
                    item.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
                });
                item.addEventListener('mouseleave', () => { item.style.transform = ''; });
                galleryGrid.appendChild(item);
                setTimeout(() => item.classList.add('visible'), 50);
            }
        };
        reader.readAsDataURL(file);
    });
}

// ===== SCROLL: Sticky header shadow =====
window.addEventListener('scroll', () => {
    document.getElementById('header').style.boxShadow =
        window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,0.15)' : '';
});
