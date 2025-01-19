export const message = (user, job) => `
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
      background-color: #007bff;
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
      color: #007bff;
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
      background-color: #007bff;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: bold;
    }
    .cta:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Hot Job Alert!</h1>
    </div>
    <div class="content">
      <h2>Hi ${user.name},</h2>
      <p>Great news! A new job that fits your niche has just been posted. The position is for a <strong>${job.title}</strong> with <strong>${job.companyName}</strong>, and they are looking to hire immediately.</p>
      <div class="details">
        <p><strong>Job Details:</strong></p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Position:</strong> ${job.title}</li>
          <li><strong>Company:</strong> ${job.companyName}</li>
          <li><strong>Location:</strong> ${job.location}</li>
          <li><strong>Salary:</strong> ${job.salary}</li>
        </ul>
      </div>
      <p>Don’t wait too long! Job openings like these are filled quickly. Click the button below to view more details and apply.</p>
      <p style="text-align: center;">
        <a href="https://your-job-portal-link.com/jobs/${job._id}" class="cta">View Job & Apply</a>
      </p>
      <p>We’re here to support you in your job search. Best of luck!</p>
    </div>
    <div class="footer">
      <p>Best Regards,<br>NicheNest Team</p>
      <p>If you have any questions, reach out to us at <a href="mailto:support@nichenest.com">support@nichenest.com</a>.</p>
    </div>
  </div>
</body>
</html>
`;
