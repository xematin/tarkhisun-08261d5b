import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('محتوای جدید موجود است. آیا می‌خواهید صفحه را بارگذاری مجدد کنید؟')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('اپلیکیشن برای استفاده آفلاین آماده است');
  },
  onRegistered(registration) {
    console.log('Service Worker ثبت شد');
    
    // Check for updates every hour
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // 1 hour
    }
  },
  onRegisterError(error) {
    console.error('خطا در ثبت Service Worker:', error);
  },
});

export default updateSW;
