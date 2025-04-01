import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Xử lý đăng nhập
document.getElementById("loginFormElement").addEventListener("submit", async (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của form

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const loginButton = document.getElementById("loginButton");
  loginButton.textContent = "Đang đăng nhập...";
  loginButton.disabled = true;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lấy thông tin vai trò từ Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role;

      // Chuyển hướng dựa trên vai trò
      if (role === "admin") {
        window.location.href = "/views/admin.html";
      } else if (role === "staff") {
        window.location.href = "/views/staff.html";
      } else if (role === "customer") {
        window.location.href = "/views/customer.html";
      } else {
        alert("Vai trò không hợp lệ!");
      }
    } else {
      alert("Không tìm thấy thông tin người dùng!");
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
  } finally {
    loginButton.textContent = "Đăng nhập";
    loginButton.disabled = false;
  }
});