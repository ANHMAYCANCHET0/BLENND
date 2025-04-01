<script type="module" src="../public/js/main.js"></script>
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lấy thông tin vai trò từ Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return userDoc.data().role; // Trả về vai trò của người dùng
    } else {
      throw new Error("Không tìm thấy thông tin người dùng trong Firestore.");
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    throw error;
  }
}

export { loginUser };

// Xử lý sự kiện khi nhấn vào "Đăng nhập"
document.getElementById("loginLink").addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "/login"; // Sử dụng đường dẫn thân thiện
});

// Xử lý sự kiện khi nhấn vào "Đăng ký"
document.getElementById("registerLink").addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "/register"; // Sử dụng đường dẫn thân thiện
});

// Hiển thị form đăng nhập hoặc đăng ký
document.getElementById("loginLink").addEventListener("click", (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
  document.getElementById("loginForm").style.display = "block"; // Hiển thị form đăng nhập
  document.getElementById("registerForm").style.display = "none"; // Ẩn form đăng ký (nếu đang hiển thị)
});

// Xử lý sự kiện khi nhấn vào "Đăng ký"
document.getElementById("registerLink").addEventListener("click", (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
  document.getElementById("loginForm").style.display = "none"; // Ẩn form đăng nhập
  document.getElementById("registerForm").style.display = "block"; // Hiển thị form đăng ký
});

// Hàm chuyển hướng an toàn
function safeRedirect(url) {
  if (url) {
    window.location.href = url;
  } else {
    console.error("URL không hợp lệ:", url);
  }
}

// Xử lý sự kiện khi nhấn vào "Giỏ hàng"
document.getElementById("cartLink").addEventListener("click", (event) => {
  event.preventDefault();
  safeRedirect("/cart.html");
});

// Xử lý sự kiện khi nhấn vào "Tìm kiếm"
document.getElementById("searchLink").addEventListener("click", (event) => {
  event.preventDefault();
  safeRedirect("/search.html");
});

// Xử lý sự kiện khi nhấn vào "Trang chủ"
document.getElementById("homeLink").addEventListener("click", (event) => {
  event.preventDefault();
  safeRedirect("/index.html");
});

// Xử lý đăng nhập
document.getElementById("loginFormElement").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Hiển thị loader
  const loginButton = document.getElementById("loginButton");
  loginButton.textContent = "Đang đăng nhập...";
  loginButton.disabled = true;

  try {
    const role = await loginUser(email, password);

    if (role === "admin") {
      safeRedirect("/views/admin.html");
    } else if (role === "staff") {
      safeRedirect("/views/staff.html");
    } else if (role === "customer") {
      safeRedirect("/views/customer.html");
    } else {
      alert("Vai trò không hợp lệ!");
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
  } finally {
    // Ẩn loader
    loginButton.textContent = "Đăng nhập";
    loginButton.disabled = false;
  }
});

// Xử lý đăng ký
document.getElementById("registerFormElement").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !email || !password) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  // Hiển thị loader
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
    safeRedirect("/views/login.html");
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    alert("Đăng ký thất bại. Vui lòng thử lại!");
  } finally {
    // Ẩn loader
    registerButton.textContent = "Đăng ký";
    registerButton.disabled = false;
  }
});
