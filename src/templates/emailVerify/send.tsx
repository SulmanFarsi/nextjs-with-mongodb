import { log } from "@/lib/utils";
import resend from "../resend";
import OTPEmail from "./template";
import { render } from "@react-email/render";

interface Props {
  otp: string;
  username: string;
  email: string;
}

export default async function sendEmailVerificationEmail(
  props: Props
): Promise<boolean> {
  try {
    const emailHtml = await render(<OTPEmail {...props} />);
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: props.email,
      html: emailHtml,
      subject: "verification email",
    });
    return true;
  } catch (error) {
    log({
      type: "ERROR",
      process: "MAIL",
      message: error instanceof Error ? error.message : "Failed to send mail",
    });
    return false;
  }
}
