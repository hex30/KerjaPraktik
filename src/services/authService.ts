/**
 * Auth Service - Simulasi Logika Autentikasi
 */

// Simulasi delay jaringan (misal 1.5 detik)
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const authService = {
  async login(payload: any) {
    console.log("Mengirim data login ke API...", payload);
    await delay(1500); // Simulasi loading

    const savedDataString = localStorage.getItem("dummy_user_rini_trans");
    if (!savedDataString) {
      throw new Error("Akun tidak ditemukan. Silakan daftar terlebih dahulu!");
    }

    const savedUser = JSON.parse(savedDataString);
    if (payload.email === savedUser.email && payload.password === savedUser.password) {
      localStorage.setItem("is_logged_in", "true");
      return { success: true, user: savedUser };
    } else {
      throw new Error("Email atau Kata Sandi salah!");
    }
  },

  async register(payload: any) {
    console.log("Mengirim data pendaftaran ke API...", payload);
    await delay(2000); // Simulasi proses di server

    // Simpan ke localStorage sebagai "Database Sementara"
    localStorage.setItem("dummy_user_rini_trans", JSON.stringify(payload));
    return { success: true, message: "Pendaftaran berhasil!" };
  },

  async logout() {
    await delay(500);
    localStorage.removeItem("is_logged_in");
    return { success: true };
  }
};
