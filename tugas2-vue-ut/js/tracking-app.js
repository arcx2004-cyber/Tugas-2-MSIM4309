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
    // Data list dari dataBahanAjar.js
    pengirimanList: [
      { kode: "REG", nama: "Reguler (3-5 hari)" },
      { kode: "EXP", nama: "Ekspres (1-2 hari)" }
    ],
    paket: [
      { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
      { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
    ],
    
    // Data Simulasi DO Aktif
    trackingData: [
      {
        nomorDO: "DO2025-001",
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Transit",
        ekspedisi: "REG",
        tanggalKirim: "2025-08-25",
        paket: "PAKET-UT-001",
        total: 120000,
        timeline: [
          { waktu: "2025-08-25 10:12:20", keterangan: "Order Placed" },
          { waktu: "2025-08-25 14:07:56", keterangan: "Packing & Sorting" },
          { waktu: "2025-08-26 08:44:01", keterangan: "In Transit" }
        ]
      }
    ],

    // Form Tambah DO
    form: {
      nim: '',
      nama: '',
      ekspedisi: '',
      paket: '',
      tanggalKirim: ''
    },

    // State
    showAddModal: false,
    detailPaketHTML: ''
  },

  computed: {
    // Generate Nomor DO
    // Format: DO[Tahun]-[Sequence]
    generatedDO: function() {
      let d = new Date();
      let year = d.getFullYear();
      let sequence = this.trackingData.length + 1;
      let seqStr = sequence.toString().padStart(3, '0');
      return "DO" + year + "-" + seqStr;
    },

    // Dapatkan Total Harga berdasarkan paket yang dipilih
    selectedTotalHarga: function() {
      if (!this.form.paket) return 0;
      let selected = this.paket.find(p => p.kode === this.form.paket);
      return selected ? selected.harga : 0;
    }
  },

  watch: {
    // Watcher: Saat pilihan paket berubah, update detailPaketHTML
    'form.paket': function(newVal) {
      if (!newVal) {
        this.detailPaketHTML = '';
        return;
      }
      let selected = this.paket.find(p => p.kode === newVal);
      if (selected) {
        this.detailPaketHTML = '<strong>Isi Paket:</strong><ul>' + 
                              selected.isi.map(item => '<li>' + item + '</li>').join('') + 
                              '</ul>';
      }
    }
  },

  methods: {
    openAddModal: function() {
      // Set Default Tanggal Kirim ke hari ini (local time yyyy-mm-dd)
      let d = new Date();
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      let year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      this.form = {
        nim: '',
        nama: '',
        ekspedisi: '',
        paket: '',
        tanggalKirim: [year, month, day].join('-')
      };
      
      this.showAddModal = true;
    },

    closeModal: function() {
      this.showAddModal = false;
    },

    saveDO: function() {
      // Validasi
      if (!this.form.nim || !this.form.nama || !this.form.ekspedisi || !this.form.paket || !this.form.tanggalKirim) {
        alert("Mohon lengkapi semua field formulir!");
        return;
      }

      let newDO = {
        nomorDO: this.generatedDO,
        nim: this.form.nim,
        nama: this.form.nama,
        status: "Order Placed",
        ekspedisi: this.form.ekspedisi,
        tanggalKirim: this.form.tanggalKirim,
        paket: this.form.paket,
        total: this.selectedTotalHarga,
        timeline: [
          { 
            waktu: new Date().toISOString().replace('T', ' ').substring(0, 19), 
            keterangan: "Order Placed" 
          }
        ]
      };

      this.trackingData.push(newDO);
      this.closeModal();
    },

    formatRupiah: function(angka) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    }
  }
});
