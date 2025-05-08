import React from 'react';
import { useState } from 'react';
import OTPMatch from './OTPMatch';
import ResetPassword from './ResetPassword';

export default function Verify() {
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [userId, setUserId] = useState(null);
  return !isOtpValid ? (
    <OTPMatch setIsOtpValid={setIsOtpValid} setUserId={setUserId} />
  ) : (
    <ResetPassword userId={userId} setIsOtpValid={setIsOtpValid} />
  );
}
