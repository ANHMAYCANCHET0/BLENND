import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebase-config.js";
import { doc, getDoc } from "firebase/firestore";

async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lấy thông tin vai trò từ Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role; // Trả về vai trò của người dùng
    } else {
      console.error("Không tìm thấy thông tin người dùng.");
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
  }
}

export { loginUser };