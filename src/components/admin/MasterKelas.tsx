import React, { useState } from 'react';
import { Kelas, Guru } from '../../types';
import {
  exportKelasToCSV,
  parseKelasCSV,
  downloadCSV,
  KELAS_CSV_TEMPLATE,
} from '../../utils/csvHelper';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  QrCode,
  MapPin,
  X,
  Download,
  Upload,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';

interface MasterKelasProps {
  kelasList: Kelas[];
  guruList: Guru[];
  onSaveKelas: (kelas: Kelas) => void;
  onDeleteKelas: (id: string) => void;
  onPreviewQR: (kelas: Kelas) => void;
  onOpenQRPosters?: () => void;
  onImportKelas?: (imported: Kelas[]) => void;
}

export const MasterKelas: React.FC<MasterKelasProps> = ({
  kelasList,
  guruList,
  onSaveKelas,
  onDeleteKelas,
  onPreviewQR,
  onOpenQRPosters,
  onImportKelas,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [csvInput, setCsvInput] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string>('');

  const [formData, setFormData] = useState<Partial<Kelas>>({
    id: '',
    namaKelas: '',
    tingkat: '6',
    waliKelasId: '',
    waliKelasNama: '',
    ruangan: '',
    qrCode: '',
    status: 'AKTIF',
    kapasitas: 30,
  });

  const handleOpenAdd = () => {
    const nextNum = kelasList.length + 1;
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    setFormData({
      id: `KELAS-NEW-${nextNum}`,
      namaKelas: `Kelas ${nextNum}A`,
      tingkat: String(Math.min(6, nextNum)),
      waliKelasId: guruList[0]?.id || '',
      waliKelasNama: guruList[0]?.nama || '',
      ruangan: `Gedung Utama Lt. 1 R.${100 + nextNum}`,
      qrCode: `QR-KELAS-${nextNum}A-${randomSuffix}`,
      status: 'AKTIF',
      kapasitas: 30,
    });
    setEditingKelas(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (kelas: Kelas) => {
    setEditingKelas(kelas);
    setFormData({ ...kelas });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaKelas || !formData.qrCode) return;

    const matchedWali = guruList.find((g) => g.id === formData.waliKelasId);

    const finalKelas: Kelas = {
      id: formData.id || `KELAS-${Date.now()}`,
      namaKelas: formData.namaKelas,
      tingkat: formData.tingkat || '1',
      waliKelasId: formData.waliKelasId || guruList[0]?.id || '-',
      waliKelasNama: matchedWali?.nama || formData.waliKelasNama || '-',
      ruangan: formData.ruangan || 'Ruang Kelas',
      qrCode: formData.qrCode,
      status: formData.status || 'AKTIF',
      kapasitas: Number(formData.kapasitas) || 30,
    };

    onSaveKelas(finalKelas);
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const csv = exportKelasToCSV(kelasList);
    downloadCSV(`data-kelas-madrasah-${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const handleDownloadTemplate = () => {
    downloadCSV('template-import-kelas.csv', KELAS_CSV_TEMPLATE);
  };

  const handleImportSubmit = () => {
    setImportStatus('');
    if (!csvInput.trim()) {
      setImportStatus('Silakan tempel isi CSV atau unggah file.');
      return;
    }

    const parsed = parseKelasCSV(csvInput, guruList[0]?.id);
    if (parsed.length === 0) {
      setImportStatus('Gagal membaca data. Pastikan format CSV sesuai template.');
      return;
    }

    if (onImportKelas) {
      onImportKelas(parsed);
    } else {
      parsed.forEach((k) => onSaveKelas(k));
    }

    setImportStatus(`Berhasil mengimpor ${parsed.length} kelas!`);
    setTimeout(() => {
      setIsImportModalOpen(false);
      setCsvInput('');
      setImportStatus('');
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCsvInput(content);
      };
      reader.readAsText(file);
    }
  };

  const filtered = kelasList.filter(
    (k) =>
      k.namaKelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.ruangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.qrCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            Manajemen Data Kelas &amp; Ruangan ({kelasList.length} Ruangan)
          </h2>
          <p className="text-xs text-slate-500">
            Setiap kelas memiliki kode QR unik yang ditempel pada dinding kelas untuk di-scan guru
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenQRPosters && (
            <button
              onClick={onOpenQRPosters}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Poster QR</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Ekspor CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Impor CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kelas</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama kelas, kode QR, atau ruangan..."
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none shadow-xs"
        />
      </div>

      {/* Kelas Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((kelas) => (
          <div
            key={kelas.id}
            className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {kelas.namaKelas}
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {kelas.ruangan}
                  </p>
                </div>

                <button
                  onClick={() => onPreviewQR(kelas)}
                  className="p-2 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer flex flex-col items-center gap-0.5"
                  title="Lihat & Download QR Code Kelas"
                >
                  <QrCode className="w-5 h-5 text-emerald-700" />
                  <span className="text-[9px] font-extrabold text-emerald-800">QR</span>
                </button>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Wali Kelas:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[140px]">{kelas.waliKelasNama || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kode QR:</span>
                  <span className="font-mono text-emerald-700 font-bold">{kelas.qrCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kapasitas:</span>
                  <span className="text-slate-800">{kelas.kapasitas || 30} Siswa</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(kelas)}
                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                title="Edit Data Kelas"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus kelas ${kelas.namaKelas}? Jadwal terkait akan ikut terpengaruh.`)) {
                    onDeleteKelas(kelas.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                title="Hapus Kelas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl p-8 text-center text-slate-400 border border-dashed border-slate-200">
          <Layers className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
          <p className="text-xs font-bold">Tidak ada kelas ditemukan.</p>
        </div>
      )}

      {/* Modal Add/Edit Kelas */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-300" />
                {editingKelas ? 'Edit Data Kelas' : 'Tambah Kelas Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3 text-xs flex-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kelas:</label>
                <input
                  type="text"
                  required
                  value={formData.namaKelas}
                  onChange={(e) => setFormData({ ...formData, namaKelas: e.target.value })}
                  placeholder="Contoh: Kelas 6A"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Kelas:</label>
                  <select
                    value={formData.tingkat}
                    onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none bg-white font-medium"
                  >
                    <option value="1">Kelas 1</option>
                    <option value="2">Kelas 2</option>
                    <option value="3">Kelas 3</option>
                    <option value="4">Kelas 4</option>
                    <option value="5">Kelas 5</option>
                    <option value="6">Kelas 6</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kapasitas Siswa:</label>
                  <input
                    type="number"
                    value={formData.kapasitas}
                    onChange={(e) => setFormData({ ...formData, kapasitas: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wali Kelas:</label>
                <select
                  value={formData.waliKelasId}
                  onChange={(e) => {
                    const sel = guruList.find((g) => g.id === e.target.value);
                    setFormData({
                      ...formData,
                      waliKelasId: e.target.value,
                      waliKelasNama: sel?.nama || '',
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none bg-white font-medium"
                >
                  <option value="">-- Pilih Wali Kelas --</option>
                  {guruList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nama} ({g.mapelUtama})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Gedung &amp; Ruangan:</label>
                <input
                  type="text"
                  required
                  value={formData.ruangan}
                  onChange={(e) => setFormData({ ...formData, ruangan: e.target.value })}
                  placeholder="Gedung Umar Lt. 2 R.201"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">String QR Code Kelas:</label>
                <input
                  type="text"
                  required
                  value={formData.qrCode}
                  onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                  placeholder="QR-KELAS-6A-WM928"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 font-mono outline-none font-medium"
                />
                <span className="text-[10px] text-slate-400">Kode ini yang tertanam dalam gambar QR Code kelas.</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20"
                >
                  {editingKelas ? 'Simpan Perubahan' : 'Tambahkan Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Import CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-teal-900 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-teal-300" />
                Impor Data Kelas dari Excel / CSV
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 text-xs flex-1">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900">
                <div>
                  <p className="font-bold">Gunakan Format Template</p>
                  <p className="text-[11px] text-teal-700">Unduh template CSV untuk data kelas madrasah</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center gap-1 text-[11px] cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Template
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih File CSV:</label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Atau Tempel Isi CSV di Sini:</label>
                <textarea
                  rows={6}
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder={`Nama Kelas,Tingkat,Nama Wali Kelas,Ruangan,Kapasitas\nKelas 6A,6,Ahmad Fauzi,Gedung Umar Lt. 2 R.201,28\nKelas 6B,6,Siti Rahmawati,Gedung Umar Lt. 2 R.202,30`}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 font-mono text-[11px] outline-none"
                />
              </div>

              {importStatus && (
                <div className="p-3 rounded-xl bg-slate-100 font-bold text-slate-800 text-xs">
                  {importStatus}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleImportSubmit}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md shadow-teal-700/20 cursor-pointer"
                >
                  Mulai Impor Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
