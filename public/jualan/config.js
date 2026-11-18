/* ================== TETAPAN JUALAN — ubah di sini sahaja ==================
   Dikongsi oleh halaman jualan (index.html), terima-kasih.html dan terma.html.

   ctaUrl       : pautan BAYARAN (ToyyibPay) untuk butang dalam kotak tawaran.
                  Butang "Dapatkan" lain membawa pengunjung ke kotak tawaran dahulu.
   price        : harga sekarang, cth "RM19". "" = sembunyikan harga.
   priceNext    : harga biasa SELEPAS promosi (dipaparkan sebagai makluman, bukan harga dipotong). "" jika tiada.
   priceNote    : ayat kecil di bawah harga.
   seller       : nama penjual / jenama.
   ssm          : no. pendaftaran perniagaan (SSM), jika ada. "" = tidak dipaparkan.
   email        : e-mel sokongan pelanggan.  "" = tidak dipaparkan.
   whatsapp     : nombor WhatsApp format antarabangsa tanpa + (cth "60123456789"). "" = tidak dipaparkan.
============================================================================ */
window.SALES = {
  ctaUrl: "https://toyyibpay.com/Pandai-Tajwid",
  price: "RM19",
  priceNext: "",
  priceNote: "Sekali bayar · tiada langganan · guna seisi keluarga pada satu peranti",
  seller: "Mawar Ikhlas Brand",
  ssm: "",
  email: "",
  whatsapp: "60197935230", // 019-793 5230 — tukar di sini jika nombor berubah
};

/** Isi elemen [data-seller-contact] dengan maklumat hubungan yang ada. */
window.renderSellerContact = function () {
  var S = window.SALES, bits = [];
  if (S.ssm) bits.push("No. pendaftaran: " + S.ssm);
  if (S.email) bits.push('E-mel: <a href="mailto:' + S.email + '">' + S.email + "</a>");
  if (S.whatsapp) {
    var local = "0" + S.whatsapp.replace(/^60/, ""); // 60197935230 → 0197935230
    var pretty = local.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2 $3");
    bits.push('WhatsApp / Tel: <a href="https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent("Assalamualaikum, saya ingin bertanya tentang Pandai Tajwid.") + '" target="_blank" rel="noopener">' + pretty + "</a>");
  }
  document.querySelectorAll("[data-seller-contact]").forEach(function (el) {
    el.innerHTML = bits.length ? bits.join(" · ") : "Pertanyaan: balas e-mel resit pembayaran anda.";
  });
};
