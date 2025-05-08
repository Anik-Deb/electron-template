import React, { forwardRef, useContext } from "react";
import { DashIcon } from "@radix-ui/react-icons";
import { OTPInput, OTPInputContext } from "input-otp";

import { cn } from "@/utils";

const InputOTP = forwardRef((props, ref) => {
  const { className, containerClassName, ...restProps } = props;

  return (
    <OTPInput
      ref={ref}
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...restProps}
    />
  );
});
InputOTP.displayName = "InputOTP";

const InputOTPGroup = forwardRef((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <div ref={ref} className={cn("flex items-center", className)} {...restProps} />
  );
});
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = forwardRef((props, ref) => {
  const { index, className, ...restProps } = props;
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      )}
      {...restProps}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = forwardRef((props, ref) => (
  <div ref={ref} role="separator" {...props}>
    <DashIcon />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
