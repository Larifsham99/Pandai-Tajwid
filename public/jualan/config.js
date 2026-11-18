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
  ctaUrl: "https://toyyibpay.com/Pandai-Tajwid-apps",
  price: "RM19",
  priceNext: "",
  priceNote: "Sekali bayar · tiada langganan · guna seisi keluarga pada satu peranti",
  seller: "Mawar Ikhlas Brand",
  ssm: "",
  email: "",
  whatsapp: "",
};

/** Isi elemen [data-seller-contact] dengan maklumat hubungan yang ada. */
window.renderSellerContact = function () {
  var S = window.SALES, bits = [];
  if (S.ssm) bits.push("No. pendaftaran: " + S.ssm);
  if (S.email) bits.push('E-mel: <a href="mailto:' + S.email + '">' + S.email + "</a>");
  if (S.whatsapp) bits.push('WhatsApp: <a href="https://wa.me/' + S.whatsapp + '" target="_blank" rel="noopener">+' + S.whatsapp + "</a>");
  document.querySelectorAll("[data-seller-contact]").forEach(function (el) {
    el.innerHTML = bits.length ? bits.join(" · ") : "Pertanyaan: balas e-mel resit pembayaran anda.";
  });
};
