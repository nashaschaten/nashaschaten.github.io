/*


it.innerHTML = `<div class='kana-char'>${kana}</div><div class='kana-romaji'>${romaji}</div>`;
row.appendChild(it);
});


wrapper.appendChild(row);
filtersEl.appendChild(wrapper);
});
}


buildFilters();


// utility: baca semua kana yang masuk ke grup-grup yang dicentang
function getSelectedKanaArray(){
const checkedGroups = Array.from(document.querySelectorAll('#filters input[type=checkbox]:checked')).map(i=>i.dataset.group);
let chars = [];
kanaGroups.forEach(g => {
if(checkedGroups.includes(g.id)){
g.items.forEach(it => chars.push(it[0]));
}
});
return chars;
}


// highlight kecil: klik grup item toggle select visual (tapi checkbox utama tetap menentukan inclusion)
filtersEl.addEventListener('click', (e)=>{
const item = e.target.closest('.kana-item');
if(item){
item.classList.toggle('selected');
}
});


// --------- Jisho API fetch with fallback ---------
async function fetchFromJisho(keyword){
const endpoint = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(keyword)}`;


try{
const res = await fetch(endpoint);
if(!res.ok) throw new Error('Network response not ok');
const data = await res.json();
return data;
}catch(err){
// fallback: coba lewat CORS proxy publik (note: bisa rate-limit)
console.warn('Direct fetch failed, trying CORS proxy...', err);
const proxy = 'https://api.allorigins.win/raw?url='; // public proxy; bisa ganti sesuai kebutuhan
try{
const res2 = await fetch(proxy + encodeURIComponent(endpoint));
if(!res2.ok) throw new Error('Proxy fetch failed');
const data2 = await res2.json();
return data2;
}catch(err2){
console.error('Both direct and proxy fetch failed', err2);
throw err2;
}
}
}


// --------- Main: ambil kata berdasarkan selected kana ---------
async function getRandomWordFromSelectedKana(){
const selectedKana = getSelectedKanaArray();
if(selectedKana.length === 0){
throw new Error('Pilih minimal
