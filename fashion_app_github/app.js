// app.js - frontend-only GitHub Pages edition (Option B: empty products)
let meta = null;
let products = [];

function showSplashThenApp(){
  const splash = document.getElementById('splash');
  const topbar = document.getElementById('topbar');
  const main = document.getElementById('product-list');
  const footer = document.querySelector('.footer');

  setTimeout(()=>{
    splash.style.display = 'none';
    topbar.style.display = 'flex';
    main.style.display = 'grid';
    footer.style.display = 'block';
  }, 1500);
}

async function fetchMeta(){
  try{
    const r = await fetch('data/meta.json');
    meta = await r.json();
    if(meta.appName) document.getElementById('app-name').textContent = meta.appName;
    if(meta.welcome) document.getElementById('welcome-banner').textContent = meta.welcome;
    if(meta.whatsapp) window.__whatsapp = meta.whatsapp;
    document.getElementById('footer-credit').textContent = 'Developed by Jane Emmanuel';
  }catch(e){ console.log('meta fetch error', e); }
}

async function fetchProducts(){
  try{
    const r = await fetch('data/products.json');
    products = await r.json();
    renderProducts();
  }catch(e){ console.error(e); }
}

function formatPrice(p, currency='NGN'){
  if(currency === 'NGN') return '₦' + Number(p).toFixed(2);
  return currency + ' ' + Number(p).toFixed(2);
}

function renderProducts(){
  const el = document.getElementById('product-list');
  el.innerHTML = '';
  const currency = document.getElementById('currency').value || 'NGN';
  if(!products || products.length === 0){
    el.innerHTML = '<p class="loading">No products yet — add items by editing /data/products.json in this repo.</p>';
    return;
  }
  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    const media = p.image ? `<img src="${p.image}" alt="${p.name}">` : '<div class="placeholder-media">No image</div>';
    card.innerHTML = `
      ${media}
      <div class="body">
        <div class="title">${p.name}</div>
        <div class="price">${formatPrice(p.price, p.currency||'NGN')} ${p.discount ? '<small> -'+p.discount+'%</small>' : ''}</div>
        ${p.sold ? '<div class="sold">Sold Out</div>' : ''}
        <div class="row" style="margin-top:8px;">
          <input class="qty" type="number" min="1" value="1" id="qty-${p.id}">
          <button class="btn" onclick="contactWhatsApp('${p.id}')">Contact via WhatsApp</button>
          <button class="btn" onclick="shareWhatsApp('${p.id}')">Share</button>
        </div>
      </div>
      <div class="review-box" id="reviews-${p.id}">
        <small>Reviews</small>
        <div id="rlist-${p.id}"></div>
      </div>
    `;
    el.appendChild(card);
  });
}

function getProduct(id){
  return (products || []).find(x => x.id == id) || {};
}

function contactWhatsApp(productId){
  const p = getProduct(productId);
  const qty = document.getElementById('qty-' + productId).value || 1;
  const phone = (window.__whatsapp) ? window.__whatsapp : '08108179570';
  const text = `Hi, I'm interested in this product from ${meta && meta.appName ? meta.appName : 'Fashion App Demo'}: ${p.name} (₦${p.price}) Qty: ${qty}`;
  window.open('https://wa.me/' + phone.replace(/\D/g,'') + '?text=' + encodeURIComponent(text), '_blank');
}

function shareWhatsApp(productId){
  const p = getProduct(productId);
  const url = location.origin + location.pathname + '?product=' + productId;
  const text = `Check this out: ${p.name} - ${url}`;
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

async function init(){
  showSplashThenApp();
  await fetchMeta();
  await fetchProducts();
}

init();
