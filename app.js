let artists = [
    { id: 1, name: 'أحلام', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Ahlam_2017_cropped.jpg/200px-Ahlam_2017_cropped.jpg', category: 'فنانة الزفات' },
    { id: 2, name: 'ماجد المهندس', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Majid_Al_Mohandis_in_2018.jpg/200px-Majid_Al_Mohandis_in_2018.jpg', category: 'فنان زفات عصرية' },
    { id: 3, name: 'محمد عبده', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Mohamed_Abdu_-_2010.jpg/200px-Mohamed_Abdu_-_2010.jpg', category: 'فنان الخليج' },
    { id: 4, name: 'راشد الماجد', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Rashed_Al-Majed.jpg/200px-Rashed_Al-Majed.jpg', category: 'فنان زفات عربية' }
];

let tracks = [
    { id: 1, title: 'هلا بكل الحضور', artistId: 1, category: 'زفات عروس', hasMusic: true, thumb: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80' },
    { id: 2, title: 'فمان الله', artistId: 1, category: 'زفات عروس', hasMusic: true, thumb: 'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=400&q=80' },
    { id: 3, title: 'عروس القمر', artistId: 3, category: 'زفات عروس', hasMusic: true, thumb: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80' },
    { id: 4, title: 'يا حليلك يا عريس', artistId: 2, category: 'زفات عريس', hasMusic: false, thumb: 'https://images.unsplash.com/photo-1519671482749-fd09be7c5bf5?w=400&q=80' },
    { id: 5, title: 'عريس الفخر', artistId: 4, category: 'زفات عريس', hasMusic: true, thumb: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80' },
    { id: 6, title: 'سمي بسم الله', artistId: 2, category: 'زفات عروس', hasMusic: true, thumb: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&q=80' }
];

let cart = [];
let isAdminAuthenticated = false;
let ADMIN_PASSWORD = localStorage.getItem('zaffat_admin_password') || 'admin123';

const homePage = document.getElementById('homePage');
const artistsPage = document.getElementById('artistsPage');
const tracksPage = document.getElementById('tracksPage');
const artistDetailPage = document.getElementById('artistDetailPage');
const adminPage = document.getElementById('adminPage');
const homeArtists = document.getElementById('homeArtists');
const homeTracks = document.getElementById('homeTracks');
const allArtists = document.getElementById('allArtists');
const allTracks = document.getElementById('allTracks');
const adminArtists = document.getElementById('adminArtists');
const adminTracks = document.getElementById('adminTracks');
const trackArtistSelect = document.getElementById('trackArtistSelect');
const menuBtn = document.getElementById('menuBtn');
const sideDrawer = document.getElementById('sideDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const cartFab = document.getElementById('cartFab');
const cartHeaderBtn = document.getElementById('cartHeaderBtn');
const cartModal = document.getElementById('cartModal');
const cartBackdrop = document.getElementById('cartBackdrop');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartBadge = document.getElementById('fabBadge');
const headerBadge = document.getElementById('headerBadge');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartWaLink = document.getElementById('cartWaLink');
const addArtistBtn = document.getElementById('addArtistBtn');
const addTrackBtn = document.getElementById('addTrackBtn');
const changePasswordBtn = document.getElementById('changePasswordBtn');

function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function getArtistName(artistId) {
    let artist = artists.find(a => a.id === artistId);
    return artist ? artist.name : 'فنان';
}

function getArtistById(artistId) {
    return artists.find(a => a.id === artistId);
}

function saveData() {
    localStorage.setItem('zaffat_artists', JSON.stringify(artists));
    localStorage.setItem('zaffat_tracks', JSON.stringify(tracks));
}

function loadData() {
    let savedArtists = localStorage.getItem('zaffat_artists');
    let savedTracks = localStorage.getItem('zaffat_tracks');
    if (savedArtists) artists = JSON.parse(savedArtists);
    if (savedTracks) tracks = JSON.parse(savedTracks);
}

function saveCart() {
    localStorage.setItem('zaffat_cart', JSON.stringify(cart));
    updateCartBadge();
}

function loadCart() {
    let saved = localStorage.getItem('zaffat_cart');
    if (saved) cart = JSON.parse(saved);
    updateCartBadge();
}

function updateCartBadge() {
    let count = cart.length;
    if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.style.display = count ? 'flex' : 'none';
    }
    if (headerBadge) {
        headerBadge.textContent = count;
        headerBadge.style.display = count ? 'flex' : 'none';
    }
}

function addToCart(track) {
    if (cart.some(item => item.id === track.id)) {
        showToast('⚠️ هذه الزفة موجودة بالفعل');
        return;
    }
    let artistName = getArtistName(track.artistId);
    cart.push({
        id: track.id,
        title: track.title,
        artist: artistName,
        category: track.category,
        thumb: track.thumb
    });
    saveCart();
    showToast('✅ تم إضافة "' + track.title + '" إلى السلة');
    renderCartModal();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCartModal();
    showToast('🗑️ تمت إزالة الزفة من السلة');
}

window.removeFromCart = removeFromCart;

function renderCartModal() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">🛒 السلة فارغة</div>';
        if (cartTotal) cartTotal.textContent = '';
        if (cartWaLink) cartWaLink.href = '#';
        return;
    }
    
    let html = '';
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        html += `
            <div class="cart-item">
                <div style="flex:1">
                    <strong style="font-size:15px; display:block;">${item.title}</strong>
                    <small style="color:#888;">${item.artist} - ${item.category}</small>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash-alt"></i> حذف
                </button>
            </div>
        `;
    }
    cartItems.innerHTML = html;
    
    if (cartTotal) {
        cartTotal.textContent = '📦 المجموع: ' + cart.length + ' ' + (cart.length === 1 ? 'زفة' : 'زفات');
    }
    
    let message = '';
    for (let i = 0; i < cart.length; i++) {
        message += '- ' + cart[i].title + ' (' + cart[i].artist + ')\n';
    }
    if (cartWaLink) {
        cartWaLink.href = 'https://wa.me/966500000000?text=🌹 طلب زفات:%0A' + encodeURIComponent(message);
    }
}

function getWhatsAppLink(track) {
    let artistName = getArtistName(track.artistId);
    let message = 'مرحباً زفات جمالك، أود الاستفسار وحجز زفة: ' + track.title + ' للفنان: ' + artistName;
    return 'https://wa.me/966500000000?text=' + encodeURIComponent(message);
}

function renderArtists(container, artistList, limit = null) {
    if (!container) return;
    let displayArtists = limit ? artistList.slice(0, limit) : artistList;
    let html = '';
    for (let i = 0; i < displayArtists.length; i++) {
        let artist = displayArtists[i];
        html += `
            <div class="artist-card" data-id="${artist.id}">
                <img src="${artist.photo}" class="artist-img" onerror="this.src='https://via.placeholder.com/400x400?text=فنان'">
                <div class="artist-info">
                    <div class="artist-name">${artist.name}</div>
                    <div class="artist-cat">${artist.category}</div>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
    
    let cards = container.querySelectorAll('.artist-card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', function() {
            let id = parseInt(this.dataset.id);
            showArtistDetail(id);
        });
    }
}

function renderTracks(container, trackList, limit = null, showArtist = true) {
    if (!container) return;
    let displayTracks = limit ? trackList.slice(0, limit) : trackList;
    let html = '';
    for (let i = 0; i < displayTracks.length; i++) {
        let track = displayTracks[i];
        let artistName = getArtistName(track.artistId);
        let musicClass = track.hasMusic ? 'badge-music' : 'badge-music no';
        let musicText = track.hasMusic ? '🎵 مع موسيقى' : '🔇 بدون موسيقى';
        let artistHtml = showArtist ? `<span class="badge badge-artist">🎤 ${artistName}</span>` : '';
        
        html += `
            <div class="track-card" data-id="${track.id}">
                <div class="track-header">
                    <div class="play-icon" data-id="${track.id}">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="track-title">${track.title}</div>
                </div>
                <div class="track-badges">
                    <span class="badge badge-cat">${track.category}</span>
                    <span class="badge ${musicClass}">${musicText}</span>
                    ${artistHtml}
                </div>
                <div class="track-buttons">
                    <button class="btn btn-cart" data-id="${track.id}">
                        <i class="fas fa-shopping-cart"></i> أضف للسلة
                    </button>
                    <a href="${getWhatsAppLink(track)}" class="btn btn-wa" target="_blank">
                        <i class="fab fa-whatsapp"></i> طلب عبر الواتساب
                    </a>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
    
    let cartBtns = container.querySelectorAll('.btn-cart');
    for (let i = 0; i < cartBtns.length; i++) {
        cartBtns[i].addEventListener('click', function(e) {
            e.stopPropagation();
            let id = parseInt(this.dataset.id);
            let track = tracks.find(t => t.id === id);
            if (track) addToCart(track);
        });
    }
    
    let playBtns = container.querySelectorAll('.play-icon');
    for (let i = 0; i < playBtns.length; i++) {
        playBtns[i].addEventListener('click', function(e) {
            e.stopPropagation();
            let id = parseInt(this.dataset.id);
            let track = tracks.find(t => t.id === id);
            showToast('🎵 جاري تشغيل: ' + track.title + ' (معاينة قريباً)');
        });
    }
}

function updateAllArtists() {
    if (allArtists) renderArtists(allArtists, artists);
    if (adminArtists) renderArtists(adminArtists, artists);
    if (trackArtistSelect) {
        trackArtistSelect.innerHTML = '<option value="">اختر الفنان</option>';
        for (let i = 0; i < artists.length; i++) {
            let option = document.createElement('option');
            option.value = artists[i].id;
            option.textContent = artists[i].name;
            trackArtistSelect.appendChild(option);
        }
    }
}

function updateAllTracks() {
    if (allTracks) renderTracks(allTracks, tracks, null, true);
    if (adminTracks) renderTracks(adminTracks, tracks, null, true);
}

function showArtistDetail(artistId) {
    let artist = getArtistById(artistId);
    if (!artist) return;
    let artistTracks = tracks.filter(t => t.artistId === artistId);
    
    let html = `
        <button class="back-btn" id="backHomeBtn">
            <i class="fas fa-home"></i> رجوع للرئيسية
        </button>
        <div class="artist-card" style="margin-bottom:20px">
            <img src="${artist.photo}" class="artist-img" onerror="this.src='https://via.placeholder.com/400x400?text=فنان'">
            <div class="artist-info">
                <div class="artist-name">${artist.name}</div>
                <div class="artist-cat">${artist.category}</div>
            </div>
        </div>
        <div class="section-title">
            <h2><i class="fas fa-music"></i> زفات ${artist.name}</h2>
        </div>
        <div class="tracks-grid" id="artistTracksList"></div>
    `;
    artistDetailPage.innerHTML = html;
    
    let artistTracksList = document.getElementById('artistTracksList');
    if (artistTracks.length === 0) {
        artistTracksList.innerHTML = '<div class="empty-msg">لا توجد زفات لهذا الفنان</div>';
    } else {
        renderTracks(artistTracksList, artistTracks, null, false);
    }
    
    document.getElementById('backHomeBtn').addEventListener('click', function() {
        showPage('home');
    });
    
    showPage('artist-detail');
}

function promptAdminPassword() {
    let password = prompt('🔐 لوحة التحكم خاصة بصاحب الموقع فقط\nالرجاء إدخال كلمة السر:');
    if (password === ADMIN_PASSWORD) {
        isAdminAuthenticated = true;
        showToast('✅ مرحباً بك في لوحة التحكم');
        showPage('admin');
        closeDrawer();
    } else if (password !== null) {
        showToast('❌ كلمة السر غير صحيحة');
    }
}

function showAdminPanel() {
    if (isAdminAuthenticated) {
        showPage('admin');
        closeDrawer();
    } else {
        promptAdminPassword();
    }
}

function changeAdminPassword() {
    let oldPassword = document.getElementById('oldPassword').value;
    let newPassword = document.getElementById('newPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    
    if (oldPassword !== ADMIN_PASSWORD) {
        showToast('❌ كلمة السر الحالية غير صحيحة');
        return;
    }
    if (newPassword.length === 0) {
        showToast('❌ الرجاء إدخال كلمة السر الجديدة');
        return;
    }
    if (newPassword !== confirmPassword) {
        showToast('❌ كلمة السر الجديدة غير متطابقة');
        return;
    }
    if (newPassword === ADMIN_PASSWORD) {
        showToast('⚠️ كلمة السر الجديدة يجب أن تكون مختلفة');
        return;
    }
    
    ADMIN_PASSWORD = newPassword;
    localStorage.setItem('zaffat_admin_password', newPassword);
    
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    showToast('✅ تم تغيير كلمة السر بنجاح');
}

function showPage(pageName) {
    let pages = [homePage, artistsPage, tracksPage, artistDetailPage, adminPage];
    for (let i = 0; i < pages.length; i++) {
        if (pages[i]) pages[i].classList.remove('active');
    }
    
    if (pageName === 'home') {
        homePage.classList.add('active');
        renderArtists(homeArtists, artists, 4);
        renderTracks(homeTracks, tracks, 4, true);
    } else if (pageName === 'artists') {
        artistsPage.classList.add('active');
        updateAllArtists();
    } else if (pageName === 'tracks') {
        tracksPage.classList.add('active');
        updateAllTracks();
    } else if (pageName === 'artist-detail') {
        artistDetailPage.classList.add('active');
    } else if (pageName === 'admin') {
        if (adminPage && isAdminAuthenticated) {
            adminPage.classList.add('active');
            updateAllArtists();
            updateAllTracks();
        } else {
            promptAdminPassword();
        }
    }
}

function openDrawer() {
    sideDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    sideDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

function openCartModal() {
    renderCartModal();
    cartModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    cartModal.classList.remove('open');
    document.body.style.overflow = '';
}

function addNewArtist() {
    if (!isAdminAuthenticated) {
        showToast('🔐 هذه الخاصية لصاحب الموقع فقط');
        return;
    }
    let name = document.getElementById('artistName').value.trim();
    let photo = document.getElementById('artistPhoto').value.trim();
    let category = document.getElementById('artistCategory').value.trim();
    
    if (!name || !photo || !category) {
        showToast('❌ الرجاء ملء جميع الحقول');
        return;
    }
    
    let newId = 1;
    for (let i = 0; i < artists.length; i++) {
        if (artists[i].id >= newId) newId = artists[i].id + 1;
    }
    artists.push({ id: newId, name: name, photo: photo, category: category });
    saveData();
    updateAllArtists();
    renderArtists(homeArtists, artists, 4);
    
    document.getElementById('artistName').value = '';
    document.getElementById('artistPhoto').value = '';
    document.getElementById('artistCategory').value = '';
    showToast('✅ تم إضافة الفنان "' + name + '"');
}

function addNewTrack() {
    if (!isAdminAuthenticated) {
        showToast('🔐 هذه الخاصية لصاحب الموقع فقط');
        return;
    }
    let title = document.getElementById('trackTitle').value.trim();
    let artistId = parseInt(document.getElementById('trackArtistSelect').value);
    let category = document.getElementById('trackCategorySelect').value;
    let thumb = document.getElementById('trackThumb').value.trim();
    
    let musicRadios = document.querySelectorAll('input[name="music"]');
    let hasMusic = true;
    for (let i = 0; i < musicRadios.length; i++) {
        if (musicRadios[i].checked && musicRadios[i].value === 'false') hasMusic = false;
    }
    
    if (!title || !artistId || !category) {
        showToast('❌ الرجاء ملء جميع الحقول');
        return;
    }
    
    let newId = 1;
    for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].id >= newId) newId = tracks[i].id + 1;
    }
    let defaultThumb = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80';
    
    tracks.push({
        id: newId,
        title: title,
        artistId: artistId,
        category: category,
        hasMusic: hasMusic,
        thumb: thumb || defaultThumb
    });
    saveData();
    updateAllTracks();
    renderTracks(homeTracks, tracks, 4, true);
    
    document.getElementById('trackTitle').value = '';
    document.getElementById('trackThumb').value = '';
    showToast('✅ تم إضافة الزفة "' + title + '"');
}

menuBtn.addEventListener('click', openDrawer);
closeDrawerBtn.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);
cartFab.addEventListener('click', openCartModal);
cartHeaderBtn.addEventListener('click', openCartModal);
closeCartBtn.addEventListener('click', closeCartModal);
cartBackdrop.addEventListener('click', closeCartModal);
if (addArtistBtn) addArtistBtn.addEventListener('click', addNewArtist);
if (addTrackBtn) addTrackBtn.addEventListener('click', addNewTrack);
if (changePasswordBtn) changePasswordBtn.addEventListener('click', changeAdminPassword);

let drawerItems = document.querySelectorAll('.drawer-item');
for (let i = 0; i < drawerItems.length; i++) {
    drawerItems[i].addEventListener('click', function(e) {
        e.preventDefault();
        let page = this.dataset.page;
        if (page === 'home') showPage('home');
        else if (page === 'artists') showPage('artists');
        else if (page === 'tracks') showPage('tracks');
        else if (page === 'admin') showAdminPanel();
        closeDrawer();
    });
}

let viewAllBtns = document.querySelectorAll('.view-all');
for (let i = 0; i < viewAllBtns.length; i++) {
    viewAllBtns[i].addEventListener('click', function() {
        let page = this.dataset.page;
        if (page === 'artists') showPage('artists');
        if (page === 'tracks') showPage('tracks');
    });
}

loadData();
loadCart();
renderArtists(homeArtists, artists, 4);
renderTracks(homeTracks, tracks, 4, true);
updateAllArtists();
updateAllTracks();