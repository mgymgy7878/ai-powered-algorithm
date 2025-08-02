// Sidebar debug kodu - tarayıcı konsolunda çalıştırın

console.log('=== SIDEBAR DEBUG ===')

// Sidebar görünürlüğünü kontrol et
const sidebar = document.querySelector('.w-64, .w-0')
if (sidebar) {
  console.log('Sidebar elementi bulundu:', sidebar.className)
  console.log('Sidebar genişliği:', getComputedStyle(sidebar).width)
} else {
  console.log('❌ Sidebar elementi bulunamadı!')
}

// Toggle butonu kontrol et
const toggleBtn = document.querySelector('[title*="Menü"]')
if (toggleBtn) {
  console.log('Toggle butonu bulundu:', toggleBtn.title)
} else {
  console.log('❌ Toggle butonu bulunamadı!')
}

// Navigation itemları kontrol et
const navButtons = document.querySelectorAll('button[title]')
console.log('Mevcut navigation butonları:')
navButtons.forEach((btn, index) => {
  console.log(`${index + 1}. ${btn.title || btn.textContent}`)
})

console.log('=== DEBUG TAMAMLANDI ===')