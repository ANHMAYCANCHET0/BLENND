// Import các hàm từ Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics"; // ⚠️ Thêm isSupported
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC5MK9aOuHhapJGnt4bckjf5aB21uIzqjQ",
  authDomain: "blennd-3fadf.firebaseapp.com",
  projectId: "blennd-3fadf",
  storageBucket: "blennd-3fadf.appspot.com",
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

const db = getFirestore(app);
const auth = getAuth(app);

// Hàm đăng ký người dùng với vai trò
async function registerUser(email, password, role, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lưu thông tin người dùng vào Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      role: role,
      name: name
    });

    console.log("Người dùng đã được đăng ký với vai trò:", role);
  } catch (error) {
    console.error("Lỗi khi đăng ký người dùng:", error);
  }
}

// Hàm đăng nhập người dùng
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lấy thông tin vai trò từ Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("Vai trò người dùng:", userData.role);
      return userData.role;
    } else {
      console.error("Không tìm thấy thông tin người dùng.");
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
  }
}

// Xuất module
export { app, analytics, registerUser, loginUser, db, auth };
