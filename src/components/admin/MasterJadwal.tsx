import React, { useState } from 'react';
import { Jadwal, Guru, Kelas, Mapel, Hari } from '../../types';
import {
  exportJadwalToCSV,
  parseJadwalCSV,
  downloadCSV,
  JADWAL_CSV_TEMPLATE,
} from '../../utils/csvHelper';
import {
  Calendar,
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  Layers,
  User,
  X,
  Download,
  Upload,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';

interface MasterJadwalProps {
  jadwalList: Jadwal[];
  guruList: Guru[];
  kelasList: Kelas[];
  mapelList: Mapel[];
  onSaveJadwal: (jadwal: Jadwal) => void;
  onDeleteJadwal: (id: string) => void;
  onImportJadwal?: (imported: Jadwal[]) => void;
}

const HARI_LIST: Hari[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const MasterJadwal: React.FC<MasterJadwalProps> = ({
  jadwalList,
  guruList,
  kelasList,
  mapelList,
  onSaveJadwal,
  onDeleteJadwal,
  onImportJadwal,
}) => {
  const [selectedHari, setSelectedHari] = useState<Hari | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingJadwal, setEditingJadwal] = useState<Jadwal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [csvInput, setCsvInput] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string>('');
  const [clashWarning, setClashWarning] = useState<string>('');

  const [formData, setFormData] = useState<Partial<Jadwal>>({
    id: '',
    hari: 'Senin',
    jamKe: 1,
    jamMulai: '07:00',
    jamSelesai: '07:35',
    guruId: '',
    guruNama: '',
    mapelId: '',
    mapelNama: '',
    kelasId: '',
    kelasNama: '',
    mode: 'NORMAL',
  });

  const handleOpenAdd = () => {
    setFormData({
      id: `JDW-${Date.now()}`,
      hari: 'Senin',
      jamKe: 1,
      jamMulai: '07:00',
      jamSelesai: '07:35',
      guruId: guruList[0]?.id || '',
      guruNama: guruList[0]?.nama || '',
      mapelId: mapelList[0]?.id || '',
      mapelNama: mapelList[0]?.nama || '',
      kelasId: kelasList[0]?.id || '',
      kelasNama: kelasList[0]?.namaKelas || '',
      mode: 'NORMAL',
    });
    setEditingJadwal(null);
    setClashWarning('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (jadwal: Jadwal) => {
    setEditingJadwal(jadwal);
    setFormData({ ...jadwal });
    setClashWarning('');
    setIsModalOpen(true);
  };

  // Clash / Conflict check: check if same teacher or same class is booked at the exact same day & jamKe
  const checkClash = (hari: Hari, jamKe: number, guruId: string, kelasId: string, currentId?: string) => {
    const clashTeacher = jadwalList.find(
      (j) => j.id !== currentId && j.hari === hari && j.jamKe === jamKe && j.guruId === guruId
    );
    if (clashTeacher) {
      return `Peringatan: Guru (${clashTeacher.guruNama}) sudah memiliki jadwal di ${clashTeacher.kelasNama} pada hari ${hari} Jam Ke-${jamKe}.`;
    }
    const clashClass = jadwalList.find(
      (j) => j.id !== currentId && j.hari === hari && j.jamKe === jamKe && j.kelasId === kelasId
    );
    if (clashClass) {
      return `Peringatan: ${clashClass.kelasNama} sudah ada jadwal mapel ${clashClass.mapelNama} (${clashClass.guruNama}) pada hari ${hari} Jam Ke-${jamKe}.`;
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const g = guruList.find((x) => x.id === formData.guruId);
    const k = kelasList.find((x) => x.id === formData.kelasId);
    const m = mapelList.find((x) => x.id === formData.mapelId);

    const warn = checkClash(
      formData.hari || 'Senin',
      Number(formData.jamKe) || 1,
      formData.guruId || '',
      formData.kelasId || '',
      formData.id
    );

    if (warn) {
      setClashWarning(warn);
      const allowAnyway = confirm(`${warn}\n\nTetap simpan jadwal ini?`);
      if (!allowAnyway) return;
    }

    const finalJadwal: Jadwal = {
      id: formData.id || `JDW-${Date.now()}`,
      hari: formData.hari || 'Senin',
      jamKe: Number(formData.jamKe) || 1,
      jamMulai: formData.jamMulai || '07:00',
      jamSelesai: formData.jamSelesai || '07:35',
      guruId: formData.guruId || guruList[0]?.id || '',
      guruNama: g?.nama || formData.guruNama || '',
      mapelId: formData.mapelId || mapelList[0]?.id || '',
      mapelNama: m?.nama || formData.mapelNama || '',
      kelasId: formData.kelasId || kelasList[0]?.id || '',
      kelasNama: k?.namaKelas || formData.kelasNama || '',
      mode: formData.mode || 'NORMAL',
    };

    onSaveJadwal(finalJadwal);
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const csv = exportJadwalToCSV(jadwalList);
    downloadCSV(`jadwal-mengajar-${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const handleDownloadTemplate = () => {
    downloadCSV('template-import-jadwal.csv', JADWAL_CSV_TEMPLATE);
  };

  const handleImportSubmit = () => {
    setImportStatus('');
    if (!csvInput.trim()) {
      setImportStatus('Silakan tempel isi CSV atau unggah file.');
      return;
    }

    const parsed = parseJadwalCSV(csvInput, guruList, kelasList, mapelList);
    if (parsed.length === 0) {
      setImportStatus('Gagal membaca data jadwal. Pastikan nama guru, kelas, dan mapel sesuai data yang ada.');
      return;
    }

    if (onImportJadwal) {
      onImportJadwal(parsed);
    } else {
      parsed.forEach((j) => onSaveJadwal(j));
    }

    setImportStatus(`Berhasil mengimpor ${parsed.length} jadwal mengajar!`);
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

  const filtered = jadwalList.filter((j) => {
    const matchesHari = selectedHari === 'ALL' || j.hari === selectedHari;
    const matchesSearch =
      j.guruNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.kelasNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.mapelNama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesHari && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            Manajemen Jadwal Mengajar ({jadwalList.length} Sesi)
          </h2>
          <p className="text-xs text-slate-500">
            Penghubung Guru + Kelas + Mapel + Hari + Jam Mengajar untuk verifikasi Scan QR
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
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
            <span>Tambah Jadwal</span>
          </button>
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedHari('ALL')}
          className={`px-3 py-2 rounded-2xl font-bold whitespace-nowrap transition cursor-pointer ${
            selectedHari === 'ALL'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Semua Hari ({jadwalList.length})
        </button>
        {HARI_LIST.map((h) => {
          const count = jadwalList.filter((j) => j.hari === h).length;
          return (
            <button
              key={h}
              onClick={() => setSelectedHari(h)}
              className={`px-3 py-2 rounded-2xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedHari === h
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {h} ({count})
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari guru, kelas, atau mapel..."
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none shadow-xs"
        />
      </div>

      {/* Jadwal Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Hari / Jam</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Guru Pengajar</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                        {j.hari}
                      </span>
                      <span className="font-mono text-slate-600 font-bold">Jam Ke-{j.jamKe}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {j.jamMulai} - {j.jamSelesai}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{j.guruNama}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-teal-900 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                      {j.kelasNama}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{j.mapelNama}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(j)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                        title="Edit Jadwal"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus jadwal ${j.hari} Jam Ke-${j.jamKe} (${j.guruNama})?`)) {
                            onDeleteJadwal(j.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title="Hapus Jadwal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
            <p className="text-xs font-bold">Tidak ada jadwal ditemukan.</p>
          </div>
        )}
      </div>

      {/* Modal Add/Edit Jadwal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-300" />
                {editingJadwal ? 'Edit Jadwal Mengajar' : 'Tambah Jadwal Mengajar'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3 text-xs flex-1">
              {clashWarning && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{clashWarning}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hari:</label>
                  <select
                    value={formData.hari}
                    onChange={(e) => setFormData({ ...formData, hari: e.target.value as Hari })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none bg-white font-medium"
                  >
                    {HARI_LIST.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jam Mengajar Ke-:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.jamKe}
                    onChange={(e) => setFormData({ ...formData, jamKe: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jam Mulai (HH:mm):</label>
                  <input
                    type="time"
                    required
                    value={formData.jamMulai}
                    onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jam Selesai (HH:mm):</label>
                  <input
                    type="time"
                    required
                    value={formData.jamSelesai}
                    onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Guru Pengajar:</label>
                <select
                  required
                  value={formData.guruId}
                  onChange={(e) => {
                    const sel = guruList.find((g) => g.id === e.target.value);
                    setFormData({
                      ...formData,
                      guruId: e.target.value,
                      guruNama: sel?.nama || '',
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none bg-white font-medium"
                >
                  <option value="">-- Pilih Guru Pengajar --</option>
                  {guruList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nama} ({g.mapelUtama})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas:</label>
                  <select
                    required
                    value={formData.kelasId}
                    onChange={(e) => {
                      const sel = kelasList.find((k) => k.id === e.target.value);
                      setFormData({
                        ...formData,
                        kelasId: e.target.value,
                        kelasNama: sel?.namaKelas || '',
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none bg-white font-medium"
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.namaKelas} ({k.ruangan})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran:</label>
                  <select
                    required
                    value={formData.mapelId}
                    onChange={(e) => {
                      const sel = mapelList.find((m) => m.id === e.target.value);
                      setFormData({
                        ...formData,
                        mapelId: e.target.value,
                        mapelNama: sel?.nama || '',
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none bg-white font-medium"
                  >
                    <option value="">-- Pilih Mapel --</option>
                    {mapelList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nama} ({m.kode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 cursor-pointer"
                >
                  {editingJadwal ? 'Simpan Perubahan' : 'Tambahkan Jadwal'}
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
                Impor Jadwal Mengajar dari CSV
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
                  <p className="text-[11px] text-teal-700">Unduh template CSV untuk data jadwal mengajar</p>
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
                  placeholder={`Hari,Jam Ke,Jam Mulai,Jam Selesai,Nama Guru,Nama Kelas,Nama Mapel\nSenin,1,07:00,07:35,Ahmad Fauzi,Kelas 6A,IPAS & Sains`}
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
