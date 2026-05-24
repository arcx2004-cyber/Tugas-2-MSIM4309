/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// Menggunakan dataBahanAjar.js sebagai basis untuk stok-app.js
var app = new Vue({
  el: '#app',
  data: {
    // Data List
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    
    // Data Stok
    stok: [
      { kode: "EKMA4116", judul: "Pengantar Manajemen", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A3", harga: 65000, qty: 28, safety: 20, catatanHTML: "<em>Edisi 2024, cetak ulang</em>" },
      { kode: "EKMA4115", judul: "Pengantar Akuntansi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A4", harga: 60000, qty: 7, safety: 15, catatanHTML: "<strong>Cover baru</strong>" },
      { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R3-B2", harga: 80000, qty: 12, safety: 10, catatanHTML: "Butuh <u>pendingin</u> untuk kit basah" },
      { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R2-C1", harga: 55000, qty: 2, safety: 8, catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder" }
    ],

    // State untuk Filter & Sort
    filterDaerah: '',
    filterKategori: '',
    filterStatus: '', // '' = semua, 'kritis' = qty < safety atau qty = 0
    sortBy: '',       // 'judul', 'qty', 'harga'

    // State Modal
    showModal: false,
    editMode: false,
    editIndex: -1,
    
    // Form Model
    form: {
      kode: '',
      judul: '',
      kategori: '',
      upbjj: '',
      lokasiRak: '',
      harga: 0,
      qty: 0,
      safety: 0,
      catatanHTML: ''
    }
  },

  computed: {
    // Menghasilkan data yang sudah di-filter dan di-sort
    filteredStok: function() {
      let result = this.stok;

      // Filter UT-Daerah
      if (this.filterDaerah) {
        result = result.filter(item => item.upbjj === this.filterDaerah);
      }

      // Filter Kategori (Dependent)
      if (this.filterKategori) {
        result = result.filter(item => item.kategori === this.filterKategori);
      }

      // Filter Status Kritis
      if (this.filterStatus === 'kritis') {
        result = result.filter(item => item.qty < item.safety || item.qty === 0);
      }

      // Sort
      if (this.sortBy === 'judul') {
        result = result.slice().sort((a, b) => a.judul.localeCompare(b.judul));
      } else if (this.sortBy === 'qty') {
        result = result.slice().sort((a, b) => a.qty - b.qty);
      } else if (this.sortBy === 'harga') {
        result = result.slice().sort((a, b) => a.harga - b.harga);
      }

      return result;
    },
    
    totalSKU: function() {
      return this.filteredStok.length;
    }
  },

  watch: {
    // 1. Watcher untuk dependent option: Reset kategori jika daerah berubah
    filterDaerah: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.filterKategori = '';
      }
    },
    // 2. Watcher untuk memantau form Qty tidak boleh negatif
    'form.qty': function(newVal) {
      if (newVal < 0) {
        this.form.qty = 0;
      }
    }
  },

  methods: {
    resetFilter: function() {
      this.filterDaerah = '';
      this.filterKategori = '';
      this.filterStatus = '';
      this.sortBy = '';
    },
    
    openAddModal: function() {
      this.editMode = false;
      this.editIndex = -1;
      this.form = {
        kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: ''
      };
      this.showModal = true;
    },

    openEditModal: function(item, index) {
      this.editMode = true;
      // Menemukan index asli di array this.stok berdasarkan kode
      this.editIndex = this.stok.findIndex(s => s.kode === item.kode);
      
      // Clone data ke form
      this.form = Object.assign({}, item);
      this.showModal = true;
    },

    closeModal: function() {
      this.showModal = false;
    },

    saveStok: function() {
      // Validasi sederhana
      if (!this.form.kode || !this.form.judul) {
        alert("Kode dan Judul tidak boleh kosong!");
        return;
      }

      if (this.editMode && this.editIndex !== -1) {
        // Edit menggunakan Vue.set agar reaktif jika perlu, atau ganti object di array
        this.$set(this.stok, this.editIndex, Object.assign({}, this.form));
      } else {
        // Tambah baru
        this.stok.push(Object.assign({}, this.form));
      }
      this.closeModal();
    },

    formatRupiah: function(angka) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    }
  }
});
