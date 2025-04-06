import React from "react";
import { ContactFormData } from "../../contact/actions";

export const EmailTemplate: React.FC<ContactFormData> = ({ fullName, email, phone, message }) => (
  <div
    style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "24px",
      backgroundColor: "#ffffff",
      color: "#00003f",
      borderRadius: "8px",
      fontFamily: "Arial, Helvetica, sans-serif",
    }}>
    <h1
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "16px",
        color: "#0f82eb",
      }}>
      New Contact Form Submission
    </h1>
    <p style={{ marginBottom: "24px" }}>You received a new message from your website contact form.</p>

    <h2
      style={{
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "12px",
        color: "#0053a4",
      }}>
      Contact Details:
    </h2>
    <ul
      style={{
        marginBottom: "24px",
        paddingLeft: "16px",
        listStyle: "none",
      }}>
      <li style={{ marginBottom: "8px" }}>
        <strong style={{ fontWeight: "500" }}>Name:</strong> {fullName}
      </li>
      <li style={{ marginBottom: "8px" }}>
        <strong style={{ fontWeight: "500" }}>Email:</strong> {email}
      </li>
      {phone && (
        <li style={{ marginBottom: "8px" }}>
          <strong style={{ fontWeight: "500" }}>Phone:</strong> {phone}
        </li>
      )}
    </ul>

    <h2
      style={{
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "12px",
        color: "#0053a4",
      }}>
      Message:
    </h2>
    <p
      style={{
        whiteSpace: "pre-wrap",
        padding: "16px",
        backgroundColor: "#e7f5fe",
        borderRadius: "6px",
      }}>
      {message}
    </p>
  </div>
);
