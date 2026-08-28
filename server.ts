import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// File storage path for persistent server-side JSON database
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}

const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default initial dataset
const INITIAL_DATA = {
  settings: {
    namaMadrasah: 'Madrasah Ibtidaiyah Negeri 1 Model',
    npsn: '60728192',
    alamatMadrasah: 'Jl. Kemenag No. 45, Komplek Pendidikan Islami, Jakarta Timur',
    namaKepalaMadrasah: 'Drs. H. M. Syaifuddin, M.Pd.I',
    nipKepalaMadrasah: '197405121999031004',
    logoUrl: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=160&auto=format&fit=crop&q=80',
    timezone: 'Asia/Jakarta',
    latitudeMadrasah: -6.229728,
    longitudeMadrasah: 106.829445,
    radiusAbsensiMeter: 150,
    batasTerlambatMenit: 10,
    modeQR: 'PERMANEN',
    fiturLokasi: true,
    fiturSelfie: true,
    modeRamadan: false,
    toleransiScanAwalMenit: 15,
    autoRefreshIntervalDetik: 15,
    googleSheetsWebhookUrl: '',
  },
  users: [
    {
      id: 'USR-ADMIN',
      username: 'admin',
      name: 'Administrator Madrasah',
      role: 'ADMIN',
      email: 'admin@min1model.sch.id',
      nip: '198801152014031002',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'USR-KEPALA',
      username: 'kepala',
      name: 'Drs. H. M. Syaifuddin, M.Pd.I',
      role: 'KEPALA',
      email: 'kepala@min1model.sch.id',
      nip: '197405121999031004',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'USR-GURU-01',
      username: 'ahmad',
      name: 'Ahmad Fauzi, S.Pd.I',
      role: 'GURU',
      guruId: 'GURU-01',
      email: 'ahmad.fauzi@min1model.sch.id',
      nip: '198506122010011018',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'USR-GURU-02',
      username: 'siti',
      name: 'Siti Rahmawati, S.Pd',
      role: 'GURU',
      guruId: 'GURU-02',
      email: 'siti.rahma@min1model.sch.id',
      nip: '199003152015022004',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'USR-GURU-03',
      username: 'budi',
      name: 'Budi Santoso, M.Pd',
      role: 'GURU',
      guruId: 'GURU-03',
      email: 'budi.santoso@min1model.sch.id',
      nip: '198207192008011009',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'USR-GURU-04',
      username: 'nur',
      name: 'Nurul Hidayah, S.Pd',
      role: 'GURU',
      guruId: 'GURU-04',
      email: 'nurul.h@min1model.sch.id',
      nip: '199211042019032011',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'USR-GURU-05',
      username: 'ridwan',
      name: 'M. Ridwan Kamil, Lc',
      role: 'GURU',
      guruId: 'GURU-05',
      email: 'ridwan.lc@min1model.sch.id',
      nip: '198709282011011003',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    },
  ],
  guru: [
    {
      id: 'GURU-01',
      nip: '198506122010011018',
      nik: '3174091206850001',
      nama: 'Ahmad Fauzi, S.Pd.I',
      username: 'ahmad',
      password: 'password123',
      mapelUtama: 'IPAS & Sains',
      noHp: '081234567890',
      status: 'AKTIF',
      fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      pendidikan: 'S1 Pendidikan Agama Islam',
      email: 'ahmad.fauzi@min1model.sch.id',
    },
    {
      id: 'GURU-02',
      nip: '199003152015022004',
      nik: '3174091503900002',
      nama: 'Siti Rahmawati, S.Pd',
      username: 'siti',
      password: 'password123',
      mapelUtama: 'Bahasa Indonesia',
      noHp: '081298765432',
      status: 'AKTIF',
      fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      pendidikan: 'S1 Pendidikan Bahasa Indonesia',
      email: 'siti.rahma@min1model.sch.id',
    },
    {
      id: 'GURU-03',
      nip: '198207192008011009',
      nik: '3174091907820003',
      nama: 'Budi Santoso, M.Pd',
      username: 'budi',
      password: 'password123',
      mapelUtama: 'Matematika',
      noHp: '081311223344',
      status: 'AKTIF',
      fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      pendidikan: 'S2 Pendidikan Matematika',
      email: 'budi.santoso@min1model.sch.id',
    },
    {
      id: 'GURU-04',
      nip: '199211042019032011',
      nik: '3174090411920004',
      nama: 'Nurul Hidayah, S.Pd',
      username: 'nur',
      password: 'password123',
      mapelUtama: "Al-Qur'an Hadis & Fikih",
      noHp: '081255667788',
      status: 'AKTIF',
      fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      pendidikan: 'S1 Pendidikan Islam',
      email: 'nurul.h@min1model.sch.id',
    },
    {
      id: 'GURU-05',
      nip: '198709282011011003',
      nik: '3174092809870005',
      nama: 'M. Ridwan Kamil, Lc',
      username: 'ridwan',
      password: 'password123',
      mapelUtama: 'Bahasa Arab',
      noHp: '081377889900',
      status: 'AKTIF',
      fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      pendidikan: 'S1 Sastra & Bahasa Arab Al-Azhar',
      email: 'ridwan.lc@min1model.sch.id',
    },
  ],
  kelas: [
    {
      id: 'KELAS-6A',
      namaKelas: 'Kelas 6A',
      tingkat: '6',
      waliKelasId: 'GURU-01',
      waliKelasNama: 'Ahmad Fauzi, S.Pd.I',
      ruangan: 'Gedung Umar bin Khattab Lt. 2 R.201',
      qrCode: 'QR-KELAS-6A-WM928',
      status: 'AKTIF',
      kapasitas: 28,
    },
    {
      id: 'KELAS-6B',
      namaKelas: 'Kelas 6B',
      tingkat: '6',
      waliKelasId: 'GURU-02',
      waliKelasNama: 'Siti Rahmawati, S.Pd',
      ruangan: 'Gedung Umar bin Khattab Lt. 2 R.202',
      qrCode: 'QR-KELAS-6B-WM929',
      status: 'AKTIF',
      kapasitas: 30,
    },
    {
      id: 'KELAS-5A',
      namaKelas: 'Kelas 5A',
      tingkat: '5',
      waliKelasId: 'GURU-03',
      waliKelasNama: 'Budi Santoso, M.Pd',
      ruangan: 'Gedung Abu Bakar Ash-Shiddiq Lt. 1 R.101',
      qrCode: 'QR-KELAS-5A-WM814',
      status: 'AKTIF',
      kapasitas: 30,
    },
    {
      id: 'KELAS-5B',
      namaKelas: 'Kelas 5B',
      tingkat: '5',
      waliKelasId: 'GURU-04',
      waliKelasNama: 'Nurul Hidayah, S.Pd',
      ruangan: 'Gedung Abu Bakar Ash-Shiddiq Lt. 1 R.102',
      qrCode: 'QR-KELAS-5B-WM815',
      status: 'AKTIF',
      kapasitas: 29,
    },
    {
      id: 'KELAS-4A',
      namaKelas: 'Kelas 4A',
      tingkat: '4',
      waliKelasId: 'GURU-05',
      waliKelasNama: 'M. Ridwan Kamil, Lc',
      ruangan: 'Gedung Ali bin Abi Thalib Lt. 1 R.103',
      qrCode: 'QR-KELAS-4A-WM701',
      status: 'AKTIF',
      kapasitas: 28,
    },
    {
      id: 'KELAS-4B',
      namaKelas: 'Kelas 4B',
      tingkat: '4',
      waliKelasId: 'GURU-01',
      waliKelasNama: 'Ahmad Fauzi, S.Pd.I',
      ruangan: 'Gedung Ali bin Abi Thalib Lt. 1 R.104',
      qrCode: 'QR-KELAS-4B-WM702',
      status: 'AKTIF',
      kapasitas: 31,
    },
  ],
  mapel: [
    { id: 'MP-01', kode: 'IPAS', nama: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)', kelompok: 'Umum' },
    { id: 'MP-02', kode: 'BIND', nama: 'Bahasa Indonesia', kelompok: 'Umum' },
    { id: 'MP-03', kode: 'MTK', nama: 'Matematika', kelompok: 'Umum' },
    { id: 'MP-04', kode: 'QH', nama: "Al-Qur'an Hadis", kelompok: 'Agama' },
    { id: 'MP-05', kode: 'AA', nama: 'Akidah Akhlak', kelompok: 'Agama' },
    { id: 'MP-06', kode: 'FIQ', nama: 'Fikih', kelompok: 'Agama' },
    { id: 'MP-07', kode: 'SKI', nama: 'Sejarah Kebudayaan Islam (SKI)', kelompok: 'Agama' },
    { id: 'MP-08', kode: 'BARB', nama: 'Bahasa Arab', kelompok: 'Agama' },
    { id: 'MP-09', kode: 'PJOK', nama: 'Pendidikan Jasmani, Olahraga, dan Kesehatan', kelompok: 'Umum' },
    { id: 'MP-10', kode: 'SBDP', nama: 'Seni Budaya dan Prakarya', kelompok: 'Muatan Lokal' },
  ],
  jadwal: [
    {
      id: 'JDW-RAB-01',
      hari: 'Rabu',
      jamKe: 1,
      jamMulai: '07:00',
      jamSelesai: '07:35',
      guruId: 'GURU-01',
      guruNama: 'Ahmad Fauzi, S.Pd.I',
      mapelId: 'MP-01',
      mapelNama: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
      kelasId: 'KELAS-6A',
      kelasNama: 'Kelas 6A',
      mode: 'NORMAL',
    },
    {
      id: 'JDW-RAB-02',
      hari: 'Rabu',
      jamKe: 2,
      jamMulai: '07:35',
      jamSelesai: '08:10',
      guruId: 'GURU-01',
      guruNama: 'Ahmad Fauzi, S.Pd.I',
      mapelId: 'MP-01',
      mapelNama: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
      kelasId: 'KELAS-6A',
      kelasNama: 'Kelas 6A',
      mode: 'NORMAL',
    },
    {
      id: 'JDW-RAB-03',
      hari: 'Rabu',
      jamKe: 1,
      jamMulai: '07:00',
      jamSelesai: '07:35',
      guruId: 'GURU-02',
      guruNama: 'Siti Rahmawati, S.Pd',
      mapelId: 'MP-02',
      mapelNama: 'Bahasa Indonesia',
      kelasId: 'KELAS-5B',
      kelasNama: 'Kelas 5B',
      mode: 'NORMAL',
    },
    {
      id: 'JDW-RAB-04',
      hari: 'Rabu',
      jamKe: 1,
      jamMulai: '07:00',
      jamSelesai: '07:35',
      guruId: 'GURU-03',
      guruNama: 'Budi Santoso, M.Pd',
      mapelId: 'MP-03',
      mapelNama: 'Matematika',
      kelasId: 'KELAS-4A',
      kelasNama: 'Kelas 4A',
      mode: 'NORMAL',
    },
    {
      id: 'JDW-RAB-05',
      hari: 'Rabu',
      jamKe: 2,
      jamMulai: '07:35',
      jamSelesai: '08:10',
      guruId: 'GURU-04',
      guruNama: 'Nurul Hidayah, S.Pd',
      mapelId: 'MP-04',
      mapelNama: "Al-Qur'an Hadis",
      kelasId: 'KELAS-5A',
      kelasNama: 'Kelas 5A',
      mode: 'NORMAL',
    },
    {
      id: 'JDW-RAB-06',
      hari: 'Rabu',
      jamKe: 3,
      jamMulai: '08:10',
      jamSelesai: '08:45',
      guruId: 'GURU-05',
      guruNama: 'M. Ridwan Kamil, Lc',
      mapelId: 'MP-08',
      mapelNama: 'Bahasa Arab',
      kelasId: 'KELAS-6B',
      kelasNama: 'Kelas 6B',
      mode: 'NORMAL',
    },
    {
      id: 'JDW-RAB-07',
      hari: 'Rabu',
      jamKe: 4,
      jamMulai: '09:00',
      jamSelesai: '09:35',
      guruId: 'GURU-01',
      guruNama: 'Ahmad Fauzi, S.Pd.I',
      mapelId: 'MP-01',
      mapelNama: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
      kelasId: 'KELAS-5A',
      kelasNama: 'Kelas 5A',
      mode: 'NORMAL',
    },
  ],
  presensi: [
    {
      id: 'ABS-20260826-001',
      tanggal: '2026-08-26',
      guruId: 'GURU-01',
      guruNama: 'Ahmad Fauzi, S.Pd.I',
      nip: '198506122010011018',
      kelasId: 'KELAS-6A',
      kelasNama: 'Kelas 6A',
      mapelId: 'MP-01',
      mapelNama: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
      jadwalId: 'JDW-RAB-01',
      jamKe: 1,
      jamMulai: '07:00',
      jamSelesai: '07:35',
      waktuScan: '07:02:15',
      status: 'SEDANG_MENGAJAR',
      menitKeterlambatan: 0,
      catatan: 'Materi Bab 3: Ekosistem dan Rantai Makanan',
      materiAjar: 'Ekosistem Darat & Air',
      deviceInfo: 'Samsung Galaxy A54 (Android 14)',
      browser: 'Chrome Mobile 128.0',
      latitude: -6.229712,
      longitude: 106.829458,
      distanceFromSchool: 15,
      isInsideRadius: true,
      selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      qrCodeScanned: 'QR-KELAS-6A-WM928',
      serverTimestamp: '2026-08-26T07:02:15+07:00',
    },
    {
      id: 'ABS-20260826-002',
      tanggal: '2026-08-26',
      guruId: 'GURU-02',
      guruNama: 'Siti Rahmawati, S.Pd',
      nip: '199003152015022004',
      kelasId: 'KELAS-5B',
      kelasNama: 'Kelas 5B',
      mapelId: 'MP-02',
      mapelNama: 'Bahasa Indonesia',
      jadwalId: 'JDW-RAB-03',
      jamKe: 1,
      jamMulai: '07:00',
      jamSelesai: '07:35',
      waktuScan: '07:04:40',
      status: 'SEDANG_MENGAJAR',
      menitKeterlambatan: 0,
      catatan: 'Membaca Teks Eksplanasi Ilmiah',
      materiAjar: 'Struktur Teks Eksplanasi',
      deviceInfo: 'iPhone 14 (iOS 17.5)',
      browser: 'Safari Mobile 17.0',
      latitude: -6.229740,
      longitude: 106.829430,
      distanceFromSchool: 22,
      isInsideRadius: true,
      selfieUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      qrCodeScanned: 'QR-KELAS-5B-WM815',
      serverTimestamp: '2026-08-26T07:04:40+07:00',
    },
  ],
  logs: [],
  lastUpdated: new Date().toISOString(),
};

// In-memory cached database object for fast access & persistence
let memoryDb: any = null;

function readDb(): any {
  if (memoryDb) {
    return memoryDb;
  }
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      if (content.trim()) {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object') {
          // Merge defaults for missing top-level keys
          memoryDb = {
            settings: { ...INITIAL_DATA.settings, ...(parsed.settings || {}) },
            users: Array.isArray(parsed.users) ? parsed.users : INITIAL_DATA.users,
            guru: Array.isArray(parsed.guru) ? parsed.guru : INITIAL_DATA.guru,
            kelas: Array.isArray(parsed.kelas) ? parsed.kelas : INITIAL_DATA.kelas,
            mapel: Array.isArray(parsed.mapel) ? parsed.mapel : INITIAL_DATA.mapel,
            jadwal: Array.isArray(parsed.jadwal) ? parsed.jadwal : INITIAL_DATA.jadwal,
            presensi: Array.isArray(parsed.presensi) ? parsed.presensi : INITIAL_DATA.presensi,
            logs: Array.isArray(parsed.logs) ? parsed.logs : [],
            lastUpdated: parsed.lastUpdated || new Date().toISOString(),
          };
          return memoryDb;
        }
      }
    }
  } catch (err) {
    console.error('Error reading db.json:', err);
  }

  // Initialize with initial dataset
  memoryDb = JSON.parse(JSON.stringify(INITIAL_DATA));
  writeDb(memoryDb);
  return memoryDb;
}

function writeDb(data: any): boolean {
  try {
    memoryDb = data;
    memoryDb.lastUpdated = new Date().toISOString();
    
    // Atomic write to prevent partial file writes
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(memoryDb, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err);
    return false;
  }
}

// ----------------------------------------------------
// API ROUTES FOR CENTRALIZED DATA SYNC & CRUD
// ----------------------------------------------------

// 1. Get entire synced state
app.get('/api/sync', (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db, timestamp: new Date().toISOString() });
});

// 2. Full Sync (Push client changes / bidirectional merge)
app.post('/api/sync', (req, res) => {
  try {
    const incoming = req.body;
    let currentDb = readDb();

    if (incoming.guru && Array.isArray(incoming.guru)) {
      currentDb.guru = incoming.guru;
    }
    if (incoming.users && Array.isArray(incoming.users)) {
      currentDb.users = incoming.users;
    }
    if (incoming.kelas && Array.isArray(incoming.kelas)) {
      currentDb.kelas = incoming.kelas;
    }
    if (incoming.mapel && Array.isArray(incoming.mapel)) {
      currentDb.mapel = incoming.mapel;
    }
    if (incoming.jadwal && Array.isArray(incoming.jadwal)) {
      currentDb.jadwal = incoming.jadwal;
    }
    if (incoming.settings && typeof incoming.settings === 'object') {
      currentDb.settings = { ...currentDb.settings, ...incoming.settings };
    }
    if (incoming.presensi && Array.isArray(incoming.presensi)) {
      const presensiMap = new Map();
      (currentDb.presensi || []).forEach((p: any) => presensiMap.set(p.id, p));
      incoming.presensi.forEach((p: any) => presensiMap.set(p.id, p));
      currentDb.presensi = Array.from(presensiMap.values());
    }
    if (incoming.logs && Array.isArray(incoming.logs)) {
      currentDb.logs = incoming.logs.slice(0, 200);
    }

    writeDb(currentDb);
    res.json({ success: true, data: currentDb, message: 'Sinkronisasi berhasil' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Save/Update Single Guru
app.post('/api/guru', (req, res) => {
  try {
    const guru = req.body;
    if (!guru || !guru.id || !guru.nama) {
      return res.status(400).json({ success: false, error: 'Data guru tidak valid (nama dan id wajib)' });
    }

    let currentDb = readDb();
    const list = currentDb.guru || [];
    const index = list.findIndex((g: any) => g.id === guru.id);
    if (index >= 0) {
      list[index] = guru;
    } else {
      list.push(guru);
    }
    currentDb.guru = list;

    // Sync users list
    const users = currentDb.users || [];
    const userIndex = users.findIndex((u: any) => u.guruId === guru.id || u.username === guru.username);
    const userObj = {
      id: userIndex >= 0 ? users[userIndex].id : `USR-${guru.id}`,
      username: guru.username,
      name: guru.nama,
      role: 'GURU',
      guruId: guru.id,
      email: guru.email || '',
      nip: guru.nip || '',
      avatarUrl: guru.fotoUrl || '',
    };
    if (userIndex >= 0) {
      users[userIndex] = userObj;
    } else {
      users.push(userObj);
    }
    currentDb.users = users;

    writeDb(currentDb);
    res.json({ success: true, data: guru, guruList: currentDb.guru });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Delete Single Guru
app.delete('/api/guru/:id', (req, res) => {
  try {
    const id = req.params.id;
    let currentDb = readDb();
    currentDb.guru = (currentDb.guru || []).filter((g: any) => g.id !== id);
    currentDb.users = (currentDb.users || []).filter((u: any) => u.guruId !== id);
    writeDb(currentDb);
    res.json({ success: true, guruList: currentDb.guru });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Save/Update Single Kelas
app.post('/api/kelas', (req, res) => {
  try {
    const kelas = req.body;
    if (!kelas || !kelas.id || !kelas.namaKelas) {
      return res.status(400).json({ success: false, error: 'Data kelas tidak valid' });
    }
    let currentDb = readDb();
    const list = currentDb.kelas || [];
    const index = list.findIndex((k: any) => k.id === kelas.id);
    if (index >= 0) {
      list[index] = kelas;
    } else {
      list.push(kelas);
    }
    currentDb.kelas = list;
    writeDb(currentDb);
    res.json({ success: true, data: kelas, kelasList: currentDb.kelas });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Delete Single Kelas
app.delete('/api/kelas/:id', (req, res) => {
  try {
    const id = req.params.id;
    let currentDb = readDb();
    currentDb.kelas = (currentDb.kelas || []).filter((k: any) => k.id !== id);
    writeDb(currentDb);
    res.json({ success: true, kelasList: currentDb.kelas });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Save/Update Single Mapel
app.post('/api/mapel', (req, res) => {
  try {
    const mapel = req.body;
    if (!mapel || !mapel.id || !mapel.nama) {
      return res.status(400).json({ success: false, error: 'Data mapel tidak valid' });
    }
    let currentDb = readDb();
    const list = currentDb.mapel || [];
    const index = list.findIndex((m: any) => m.id === mapel.id);
    if (index >= 0) {
      list[index] = mapel;
    } else {
      list.push(mapel);
    }
    currentDb.mapel = list;
    writeDb(currentDb);
    res.json({ success: true, data: mapel, mapelList: currentDb.mapel });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Delete Single Mapel
app.delete('/api/mapel/:id', (req, res) => {
  try {
    const id = req.params.id;
    let currentDb = readDb();
    currentDb.mapel = (currentDb.mapel || []).filter((m: any) => m.id !== id);
    writeDb(currentDb);
    res.json({ success: true, mapelList: currentDb.mapel });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Save/Update Single Jadwal
app.post('/api/jadwal', (req, res) => {
  try {
    const jadwal = req.body;
    if (!jadwal || !jadwal.id || !jadwal.hari) {
      return res.status(400).json({ success: false, error: 'Data jadwal tidak valid' });
    }
    let currentDb = readDb();
    const list = currentDb.jadwal || [];
    const index = list.findIndex((j: any) => j.id === jadwal.id);
    if (index >= 0) {
      list[index] = jadwal;
    } else {
      list.push(jadwal);
    }
    currentDb.jadwal = list;
    writeDb(currentDb);
    res.json({ success: true, data: jadwal, jadwalList: currentDb.jadwal });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Delete Single Jadwal
app.delete('/api/jadwal/:id', (req, res) => {
  try {
    const id = req.params.id;
    let currentDb = readDb();
    currentDb.jadwal = (currentDb.jadwal || []).filter((j: any) => j.id !== id);
    writeDb(currentDb);
    res.json({ success: true, jadwalList: currentDb.jadwal });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Save App Settings
app.post('/api/settings', (req, res) => {
  try {
    const settings = req.body;
    let currentDb = readDb();
    currentDb.settings = { ...currentDb.settings, ...settings };
    writeDb(currentDb);
    res.json({ success: true, settings: currentDb.settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Post/Update Presensi Scan
app.post('/api/presensi', (req, res) => {
  try {
    const newPresensi = req.body;
    if (!newPresensi || !newPresensi.id) {
      return res.status(400).json({ success: false, error: 'Invalid presensi data' });
    }

    let currentDb = readDb();
    const existingIndex = (currentDb.presensi || []).findIndex((p: any) => p.id === newPresensi.id);
    if (existingIndex >= 0) {
      currentDb.presensi[existingIndex] = { ...currentDb.presensi[existingIndex], ...newPresensi };
    } else {
      currentDb.presensi = [newPresensi, ...(currentDb.presensi || [])];
    }

    writeDb(currentDb);
    res.json({ success: true, data: newPresensi, presensiList: currentDb.presensi });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 13. Delete Presensi
app.delete('/api/presensi/:id', (req, res) => {
  try {
    const id = req.params.id;
    let currentDb = readDb();
    currentDb.presensi = (currentDb.presensi || []).filter((p: any) => p.id !== id);
    writeDb(currentDb);
    res.json({ success: true, presensiList: currentDb.presensi });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 14. Export/Backup full Database JSON
app.get('/api/backup/download', (req, res) => {
  const db = readDb();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=si-absen-backup-${new Date().toISOString().split('T')[0]}.json`);
  res.send(JSON.stringify(db, null, 2));
});

// 15. Restore database from JSON
app.post('/api/backup/restore', (req, res) => {
  try {
    const importedData = req.body;
    if (!importedData || typeof importedData !== 'object') {
      return res.status(400).json({ success: false, error: 'File format tidak valid' });
    }
    const cleanDb = {
      settings: { ...INITIAL_DATA.settings, ...(importedData.settings || {}) },
      users: Array.isArray(importedData.users) ? importedData.users : INITIAL_DATA.users,
      guru: Array.isArray(importedData.guru) ? importedData.guru : INITIAL_DATA.guru,
      kelas: Array.isArray(importedData.kelas) ? importedData.kelas : INITIAL_DATA.kelas,
      mapel: Array.isArray(importedData.mapel) ? importedData.mapel : INITIAL_DATA.mapel,
      jadwal: Array.isArray(importedData.jadwal) ? importedData.jadwal : INITIAL_DATA.jadwal,
      presensi: Array.isArray(importedData.presensi) ? importedData.presensi : [],
      logs: Array.isArray(importedData.logs) ? importedData.logs : [],
      lastUpdated: new Date().toISOString(),
    };
    writeDb(cleanDb);
    res.json({ success: true, data: cleanDb, message: 'Database berhasil dipulihkan dari backup' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 16. Reset database to default sample data
app.post('/api/reset', (req, res) => {
  try {
    const freshDb = JSON.parse(JSON.stringify(INITIAL_DATA));
    writeDb(freshDb);
    res.json({ success: true, data: freshDb, message: 'Database berhasil disetel ulang' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------
// VITE & STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server SI-ABSEN running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
