// script.js

const PRODUCTS = [
  {id:1,title:'Sneaker Run 1',cat:'sneakers',price:89,desc:'Лёгкие кеды для бега',img:'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600'},
  {id:2,title:'Urban Boots',cat:'boots',price:150,desc:'Городские ботинки на осень',img:'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600'},
  {id:3,title:'Beach Sandal',cat:'sandals',price:39,desc:'Комфортные сандалии для моря',img:'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600'},
  {id:4,title:'Sneaker Light',cat:'sneakers',price:99,desc:'Кеды с мягкой подошвой',img:'https://images.pexels.com/photos/386007/pexels-photo-386007.jpeg?auto=compress&cs=tinysrgb&w=600'},
  {id:5,title:'Hiking Pro',cat:'boots',price:169,desc:'Треккинговые ботинки',img:'https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=600'},
  {id:6,title:'City Sandal',cat:'sandals',price:55,desc:'Стильные сандалии для города',img:'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600'}
];

let state = {
  products: PRODUCTS,
  filters:{category:'all',q:'',maxPrice:300,sort:'popular'},
  cart: JSON.parse(localStorage.getItem('cart_v1')||'{}')
};

const catalogEl = document.getElementById('catalog');
const categoryList = document.getElementById('categoryList');
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkout');
const priceRange = document.getElementById('priceRange');
const searchLeft = document.getElementById('leftSearch');
const searchTop = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');
const clearFiltersBtn = document.getElementById('clearFilters');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function saveCart(){ localStorage.setItem('cart_v1', JSON.stringify(state.cart)); }
function updateCartCount(){ const total = Object.values(state.cart).reduce((s,i)=>s+i.qty,0); cartCount.textContent = total; }
function formatPrice(n){ return n.toLocaleString('ru-RU') + ' ₽'; }

function renderCategories(){
  const cats = ['all',...new Set(state.products.map(p=>p.cat))];
  categoryList.innerHTML = '';
  cats.forEach(c=>{
    const el = document.createElement('div');
    el.className = 'chip' + (state.filters.category===c? ' active':'');
    el.textContent = c==='all' ? 'Все' : c[0].toUpperCase()+c.slice(1);
    el.dataset.cat = c;
    el.onclick = ()=>{ state.filters.category=c; priceRange.value=300; render(); }
    categoryList.appendChild(el);
  })
}

function renderCatalog(){
  const q = state.filters.q.trim().toLowerCase();
  let list = state.products.filter(p=>p.price <= state.filters.maxPrice);
  if(state.filters.category!=='all') list = list.filter(p=>p.cat===state.filters.category);
  if(q) list = list.filter(p=> (p.title+p.desc).toLowerCase().includes(q));
  if(state.filters.sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(state.filters.sort==='price-desc') list.sort((a,b)=>b.price-a.price);

  catalogEl.innerHTML = '';
  if(list.length===0){ catalogEl.innerHTML = '<div class="muted">Товары не найдены</div>'; return; }
  list.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<div class="thumb"><img src="${p.img}" alt="${p.title}"></div>
      <div class="title">${p.title}</div>
      <div class="muted">${p.desc}</div>
      <div class="price-line">
        <div class="price">${formatPrice(p.price)}</div>
        <button class="btn" data-add="${p.id}">В корзину</button>
      </div>`;
    catalogEl.appendChild(card);
  })
}

function renderCart(){
  cartList.innerHTML = '';
  const ids = Object.keys(state.cart);
  if(ids.length===0){ cartList.innerHTML = '<div class="muted" style="padding:12px">Корзина пуста</div>'; cartTotal.textContent='0 ₽'; updateCartCount(); return; }
  let total=0;
  ids.forEach(id=>{
    const item = state.cart[id];
    const p = state.products.find(x=>x.id==id);
    total += p.price * item.qty;
    const el = document.createElement('div'); el.className='cart-item';
    el.innerHTML = `<div style="width:56px;height:56px;border-radius:8px;overflow:hidden"><img src="${p.img}" style="width:100%;height:100%;object-fit:cover"></div>
      <div style="flex:1">
        <div style="font-weight:700">${p.title}</div>
        <div class="muted">${formatPrice(p.price)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <div class="qty">
          <button data-dec="${id}">−</button>
          <div style="min-width:26px;text-align:center">${item.qty}</div>
          <button data-inc="${id}">+</button>
        </div>
        <button class="ghost" data-rm="${id}">Удалить</button>
      </div>`;
    cartList.appendChild(el);
  })
  cartTotal.textContent = formatPrice(total);
  updateCartCount();
}

function addToCart(id, qty=1){ id = String(id); if(!state.cart[id]) state.cart[id]={qty:0}; state.cart[id].qty += qty; saveCart(); renderCart(); }
function removeFromCart(id){ id=String(id); delete state.cart[id]; saveCart(); renderCart(); }
function changeQty(id, delta){ id=String(id); if(!state.cart[id]) return; state.cart[id].qty += delta; if(state.cart[id].qty<=0) delete state.cart[id]; saveCart(); renderCart(); }
function clearCart(){ state.cart={}; saveCart(); renderCart(); }

catalogEl.addEventListener('click', e=>{
  const add = e.target.closest('[data-add]');
  if(add){ addToCart(add.dataset.add*1); }
});
cartList.addEventListener('click', e=>{
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  const rm = e.target.closest('[data-rm]');
  if(inc) changeQty(inc.dataset.inc, 1);
  if(dec) changeQty(dec.dataset.dec, -1);
  if(rm) removeFromCart(rm.dataset.rm);
});

openCartBtn.addEventListener('click', ()=> cartPanel.classList.add('open'));
closeCartBtn.addEventListener('click', ()=> cartPanel.classList.remove('open'));
clearCartBtn.addEventListener('click', ()=>{ if(confirm('Очистить корзину?')) clearCart(); });
checkoutBtn.addEventListener('click', ()=>{
  if(Object.keys(state.cart).length===0) return alert('Корзина пуста');
  const total = Object.keys(state.cart).reduce((s,id)=>{
    const p = state.products.find(x=>x.id==id);
    return s + p.price*state.cart[id].qty;
  },0);
  alert('Спасибо! Ваш заказ на сумму ' + formatPrice(total) + ' принят (демо).');
  clearCart();
  cartPanel.classList.remove('open');
});

priceRange.addEventListener('input', ()=>{ state.filters.maxPrice = +priceRange.value; render(); });
searchLeft.addEventListener('input', e=>{ state.filters.q = e.target.value; render(); });
searchTop.addEventListener('input', e=>{ state.filters.q = e.target.value; });
searchBtn.addEventListener('click', ()=>{ state.filters.q = searchTop.value; render(); });
sortSelect.addEventListener('change', e=>{ state.filters.sort = e.target.value; render(); });
clearFiltersBtn.addEventListener('click', ()=>{
  state.filters={...state.filters,category:'all',q:'',maxPrice:300,sort:'popular'};
  priceRange.value=300; searchTop.value=''; searchLeft.value=''; render();
});

document.querySelectorAll('nav a[data-nav]').forEach(a=>a.addEventListener('click', e=>{
  e.preventDefault(); const cat = a.dataset.nav; state.filters.category = cat; render(); if(window.innerWidth<900) nav.classList.remove('open');
}));

burger.addEventListener('click', ()=> nav.classList.toggle('open'));
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ cartPanel.classList.remove('open'); nav.classList.remove('open'); }});

function render(){ renderCategories(); renderCatalog(); renderCart(); }
render();