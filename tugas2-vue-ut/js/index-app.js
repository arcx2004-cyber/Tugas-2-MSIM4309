/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

var app = new Vue({
  el: '#app',
  data: {
    // Data stok berdasarkan dataBahanAjar.js
    stok: [
      { qty: 28 },
      { qty: 7 },
      { qty: 12 },
      { qty: 2 }
    ],
    // Data tracking simulasi awal
    trackingData: [
      { nomorDO: "DO2025-001" }
    ],
    currentTime: new Date()
  },
  computed: {
    totalStok: function() {
      return this.stok.reduce((sum, item) => sum + item.qty, 0);
    },
    totalPengiriman: function() {
      return this.trackingData.length;
    },
    hari: function() {
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return days[this.currentTime.getDay()];
    },
    tanggal: function() {
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const date = this.currentTime.getDate();
      const month = months[this.currentTime.getMonth()];
      const year = this.currentTime.getFullYear();
      return `${date} ${month} ${year}`;
    },
    jam: function() {
      let h = this.currentTime.getHours().toString().padStart(2, '0');
      let m = this.currentTime.getMinutes().toString().padStart(2, '0');
      let s = this.currentTime.getSeconds().toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    },
    sapaan: function() {
      let hour = this.currentTime.getHours();
      if (hour >= 4 && hour < 11) {
        return "Selamat Pagi";
      } else if (hour >= 11 && hour < 15) {
        return "Selamat Siang";
      } else if (hour >= 15 && hour < 18) {
        return "Selamat Sore";
      } else {
        return "Selamat Malam";
      }
    }
  },
  mounted: function() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
});
