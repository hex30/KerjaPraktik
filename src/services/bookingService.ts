/**
 * Booking Service - Simulasi Logika Pemesanan
 */

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const bookingService = {
  async submitBooking(payload: any) {
    console.log(`Mengirim pesanan ${payload.layanan} ke API...`, payload);
    await delay(2500); // Simulasi proses booking yang lebih lama

    // Simulasi penyimpanan ke riwayat lokal
    const existingHistory = JSON.parse(localStorage.getItem("order_history") || "[]");
    const newOrder = {
      id: `RTP-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: "PENDING",
      ...payload
    };
    
    existingHistory.unshift(newOrder);
    localStorage.setItem("order_history", JSON.stringify(existingHistory));

    return { success: true, orderId: newOrder.id };
  },

  async getHistory() {
    await delay(1000);
    return JSON.parse(localStorage.getItem("order_history") || "[]");
  }
};
