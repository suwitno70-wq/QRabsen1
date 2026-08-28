import React, { useState } from 'react';
import { User, Guru } from '../../types';
import { Building2, Shield, Lock, User as UserIcon, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: User) => void;
  guruList: Guru[];
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, guruList }) => {
  const [username, setUsername] = useState<string>('ahmad');
  const [password, setPassword] = useState<string>('password123');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = username.trim().toLowerCase();

    // Check predefined Admin / Kepala
    if (trimmed === 'kepala') {
      onLogin({
        id: 'KEP-01',
        username: 'kepala',
        name: 'Drs. H. Mulyadi, M.Pd.I',
        role: 'KEPALA',
        nip: '197003151995031001',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      });
      return;
    }

    if (trimmed === 'admin') {
      onLogin({
        id: 'ADM-01',
        username: 'admin',
        name: 'Administrator SI-ABSEN',
        role: 'ADMIN',
        nip: '198801152014031002',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      });
      return;
    }

    // Check Guru list by username, NIP, or NIK
    const foundGuru = guruList.find(
      (g) =>
        g.username.toLowerCase() === trimmed ||
        g.nip.toLowerCase() === trimmed ||
        (g.nik && g.nik.toLowerCase() === trimmed)
    );

    if (foundGuru) {
      onLogin({
        id: foundGuru.id,
        username: foundGuru.username,
        guruId: foundGuru.id,
        name: foundGuru.nama,
        role: 'GURU',
        nip: foundGuru.nip,
        avatarUrl: foundGuru.fotoUrl,
      });
      return;
    }

    setErrorMsg(`Username / NIP "${username}" tidak ditemukan di database.`);
  };

  const handleQuickLogin = (role: 'GURU' | 'KEPALA' | 'ADMIN', guru?: Guru) => {
    if (role === 'ADMIN') {
      onLogin({
        id: 'ADM-01',
        username: 'admin',
        name: 'Administrator SI-ABSEN',
        role: 'ADMIN',
        nip: '198801152014031002',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      });
    } else if (role === 'KEPALA') {
      onLogin({
        id: 'KEP-01',
        username: 'kepala',
        name: 'Drs. H. Mulyadi, M.Pd.I',
        role: 'KEPALA',
        nip: '197003151995031001',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      });
    } else {
      const selected = guru || guruList[0];
      onLogin({
        id: selected.id,
        username: selected.username,
        guruId: selected.id,
        name: selected.nama,
        role: 'GURU',
        nip: selected.nip,
        avatarUrl: selected.fotoUrl,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 flex flex-col justify-between p-4 sm:p-6 text-white font-sans">
      <div className="max-w-md w-full mx-auto my-auto space-y-6">
        {/* App Header Branding matching Sleek Interface */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-xl border-2 border-emerald-300">
            <div className="text-emerald-700 font-bold text-2xl tracking-tighter">K</div>
          </div>
          <h1 className="font-bold text-xl sm:text-2xl leading-tight uppercase tracking-wider text-white">
            SI-ABSEN GURU
          </h1>
          <p className="text-emerald-400 text-xs italic font-medium">
            Kreatif by Witno
          </p>
          <p className="text-xs text-emerald-200/80 pt-1">
            Sistem Presensi Realtime Berbasis Scan QR Code per Ruang Kelas
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 border border-emerald-500/20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
              Masuk ke Aplikasi
            </h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              LIVE SYSTEM
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-600 mb-1">
                Username / NIP:
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: ahmad / admin / kepala"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-slate-800 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">
                Password:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl transition shadow-lg shadow-emerald-800/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Aplikasi</span>
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
              Pilihan Masuk Cepat
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('GURU')}
                className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-center transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white mx-auto flex items-center justify-center font-bold text-[10px] mb-1">
                  👨‍🏫
                </div>
                <p className="font-extrabold text-[11px] leading-tight">Guru (Utama)</p>
                <p className="text-[9px] text-emerald-700 truncate mt-0.5">{guruList[0]?.nama || 'Guru'}</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('KEPALA')}
                className="p-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-950 text-center transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-teal-700 text-white mx-auto flex items-center justify-center font-bold text-[10px] mb-1">
                  👔
                </div>
                <p className="font-extrabold text-[11px] leading-tight">Kepala</p>
                <p className="text-[9px] text-teal-700 truncate mt-0.5">Monitoring Live</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-center transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white mx-auto flex items-center justify-center font-bold text-[10px] mb-1">
                  ⚙️
                </div>
                <p className="font-extrabold text-[11px] leading-tight">Admin</p>
                <p className="text-[9px] text-slate-600 truncate mt-0.5">Kelola Data</p>
              </button>
            </div>

            {guruList.length > 0 && (
              <div className="pt-2">
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
                  Atau pilih akun guru ({guruList.length} guru terdaftar):
                </label>
                <select
                  className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
                  onChange={(e) => {
                    const selectedGuru = guruList.find((g) => g.id === e.target.value);
                    if (selectedGuru) {
                      setUsername(selectedGuru.username);
                      setPassword(selectedGuru.password || 'password123');
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>-- Pilih Guru untuk Auto-Fill --</option>
                  {guruList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nama} ({g.username}) - {g.mapelUtama}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-emerald-400/80 pb-2">
        SI-ABSEN GURU MENGAJAR v1.0.0 &bull; Kreatif by Witno &bull; Scan • Mengajar • Tercatat
      </div>
    </div>
  );
};
