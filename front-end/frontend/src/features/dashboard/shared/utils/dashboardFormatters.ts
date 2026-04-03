/**
 * Dashboard Formatters
 * Xử lý format số liệu, ngày tháng trên biểu đồ
 */

export const dashboardFormatters = {
  /**
   * Format số lớn thành dạng rút gọn (1.2K, 1.5M, ...)
   */
  formatNumber: (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  },

  /**
   * Format ngày thành dạng dd/MM/yyyy
   */
  formatDate: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN");
  },

  /**
   * Format phần trăm
   */
  formatPercentage: (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
  },

  /**
   * Format thời gian (days, hours, ...)
   */
  formatDuration: (days: number): string => {
    if (days < 1) {
      return "Less than 1 day";
    }
    if (days < 7) {
      return `${Math.ceil(days)} days`;
    }
    if (days < 30) {
      return `${Math.ceil(days / 7)} weeks`;
    }
    return `${Math.ceil(days / 30)} months`;
  },

  /**
   * Format tiền tệ
   */
  formatCurrency: (amount: number, currency: string = "VND"): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
    }).format(amount);
  },
};
