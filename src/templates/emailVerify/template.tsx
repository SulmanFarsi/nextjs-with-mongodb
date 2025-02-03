import React from "react";
import { Html, Head, Body, Container, Text } from "@react-email/components";

interface Props {
  otp: string;
  username: string;
}

const OTPEmail: React.FC<Props> = ({ otp, username }) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9",
          padding: "20px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
            Hello, {username}!
          </Text>
          <Text>Your One-Time Password (OTP) for verification is:</Text>
          <Text
            style={{ fontSize: "24px", fontWeight: "bold", color: "#007bff" }}
          >
            {otp}
          </Text>
          <Text>
            This OTP will expire in <strong>1 minute</strong>. Please use it
            promptly.
          </Text>
          <Text>If you didn't request this, please ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OTPEmail;
