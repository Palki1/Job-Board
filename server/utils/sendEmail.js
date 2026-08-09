import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

// Generic sender. Fails silently (logs only) so email issues never break
// the main request/response flow (e.g. an application submission).
export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`[email skipped - no SMTP config] To: ${to} | Subject: ${subject}`);
      return;
    }
    const info = await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
  }
};

export const applicationConfirmationEmail = (candidateName, jobTitle, companyName) => ({
  subject: `Application received: ${jobTitle} at ${companyName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;">
      <h2 style="color:#1E3A5F;">Application submitted successfully</h2>
      <p>Hi ${candidateName},</p>
      <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been received. The employer will review your profile and get back to you.</p>
      <p>You can track the status of this application from your Candidate Dashboard at any time.</p>
      <p style="margin-top:24px;color:#6B7280;font-size:13px;">— The Job Board Team</p>
    </div>
  `,
});

export const newApplicantEmail = (employerName, jobTitle, candidateName) => ({
  subject: `New applicant for ${jobTitle}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;">
      <h2 style="color:#1E3A5F;">You have a new applicant</h2>
      <p>Hi ${employerName},</p>
      <p><strong>${candidateName}</strong> just applied for your job posting <strong>${jobTitle}</strong>.</p>
      <p>Log in to your Employer Dashboard to review the application and resume.</p>
      <p style="margin-top:24px;color:#6B7280;font-size:13px;">— The Job Board Team</p>
    </div>
  `,
});

export const applicationStatusUpdateEmail = (candidateName, jobTitle, companyName, status) => ({
  subject: `Update on your application: ${jobTitle}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;">
      <h2 style="color:#1E3A5F;">Application status updated</h2>
      <p>Hi ${candidateName},</p>
      <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated to: <strong style="text-transform:capitalize;">${status}</strong>.</p>
      <p>Log in to your Candidate Dashboard for more details.</p>
      <p style="margin-top:24px;color:#6B7280;font-size:13px;">— The Job Board Team</p>
    </div>
  `,
});

export const welcomeEmail = (name, role) => ({
  subject: `Welcome to Job Board!`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;">
      <h2 style="color:#1E3A5F;">Welcome, ${name}!</h2>
      <p>Your ${role} account has been created successfully.</p>
      <p>${
        role === "employer"
          ? "You can now post jobs and manage applicants from your Employer Dashboard."
          : "You can now search jobs, build your profile, and apply in a few clicks."
      }</p>
      <p style="margin-top:24px;color:#6B7280;font-size:13px;">— The Job Board Team</p>
    </div>
  `,
});
