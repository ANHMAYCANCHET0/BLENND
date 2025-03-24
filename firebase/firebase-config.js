// Import các hàm từ Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics"; // ⚠️ Thêm isSupported

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC5MK9aOuHhapJGnt4bckjf5aB21uIzqjQ",
  authDomain: "blennd-3fadf.firebaseapp.com",
  projectId: "blennd-3fadf",
  storageBucket: "blennd-3fadf.firebasestorage.app",
  messagingSenderId: "373715774646",
  appId: "1:373715774646:web:c5000f5c00b8cdd280ca17",
  measurementId: "G-D2HDWCE5DZ"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Chỉ khởi tạo Analytics nếu chạy trên trình duyệt
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized");
    } else {
      console.log("Firebase Analytics is not supported in this environment.");
    }
  });
}

// Xuất module
export { app, analytics };
