"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import "./login.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      {/* LEFT SIDE (Login form) */}
      <div className="login-left">
        <h1 className="login-greeting">Đăng nhập</h1>
        <div className="login-box">
          <motion.h1
            className="welcome-text"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
          </motion.h1>

          <form className="form">
            <label>Email</label>
            <input type="email" placeholder="Nhập email của bạn" />

            <label>Mật khẩu</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-btn"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="help-row">
              <a href="#" className="forgot">
                Quên mật khẩu?
              </a>
            </div>

            <button type="submit" className="login-btn">
              Đăng nhập
            </button>
          </form>
        </div>
        <p className="footer">© 2025 Secret Weapon</p>
      </div>

      {/* RIGHT SIDE (Image) */}
      <div className="login-right">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >

          <p className="welcomeText">Chúc bạn một ngày làm việc hiệu quả!</p>
          <Image
            src="/assets/welcomeGirl.png"
            alt="Welcome"
            width={1000}
            height={1000}
            className="welcome-img"
          />
        </motion.div>

      </div>
    </div>
  );
}
