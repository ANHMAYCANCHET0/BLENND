import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

// Xử lý đăng ký
document.getElementById("registerFormElement").addEventListener("submit", async (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của form

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  const registerButton = document.getElementById("registerButton");
  registerButton.textContent = "Đang đăng ký...";
  registerButton.disabled = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lưu thông tin vào Firestore với vai trò "customer"
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      name: name,
      role: "customer"
    });

    alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
    window.location.href = "/views/login.html"; // Chuyển hướng đến trang đăng nhập
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    alert("Đăng ký thất bại. Vui lòng thử lại!");
  } finally {
    registerButton.textContent = "Đăng ký";
    registerButton.disabled = false;
  }
});