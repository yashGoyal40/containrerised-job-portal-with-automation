export const approvalMessage = (username, title, company) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    .header {
      background-color: #28a745;
      color: #ffffff;
      padding: 15px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
    }
    .content {
      padding: 15px;
    }
    .content h2 {
      font-size: 18px;
      margin-bottom: 10px;
      color: #28a745;
    }
    .content p {
      margin: 10px 0;
    }
    .details {
      background-color: #f1f1f1;
      padding: 10px;
      border-radius: 5px;
      margin: 15px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #777;
      margin-top: 15px;
    }
    .cta {
      display: inline-block;
      background-color: #28a745;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: bold;
    }
    .cta:hover {
      background-color: #218838;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Congratulations!</h1>
    </div>
    <div class="content">
      <h2>Hi ${username},</h2>
      <p>We’re thrilled to inform you that your application for the position of <strong>${title}</strong> at <strong>${company}</strong> has been <span style="color: #28a745;">approved</span>.</p>
      <div class="details">
        <p><strong>Job Details:</strong></p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Position:</strong> ${title}</li>
          <li><strong>Company:</strong> ${company}</li>
        </ul>
      </div>
      <p>The employer will reach out to you shortly with further details about your onboarding process.</p>
      <p>Meanwhile, if you have any questions, feel free to contact us at <a href="mailto:support@nichenest.com" style="color: #28a745;">support@nichenest.com</a>.</p>
      <p style="text-align: center;">
        <a href="https://your-job-portal-link.com/jobs/" class="cta">View Job Details</a>
      </p>
    </div>
    <div class="footer">
      <p>Best Regards,<br>NicheNest Team</p>
      <p>If you have any questions, reach out to us at <a href="mailto:support@nichenest.com">support@nichenest.com</a>.</p>
    </div>
  </div>
</body>
</html>
`;
