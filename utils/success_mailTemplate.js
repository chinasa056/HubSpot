exports.successfulSubscription = (link, firstName, planName, startDate, endDate) => {
    return `
        <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Successful</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
          }
          .container {
              width: 80%;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: #4CAF50;
              padding: 20px;
              text-align: center;
              color: #ffffff;
              border-radius: 10px 10px 0 0;
          }
          .content {
              padding: 20px;
              color: #333333;
          }
          .button-container {
              text-align: center;
              margin: 20px 0;
          }
          .button {
              display: inline-block;
              background-color: #4CAF50;
              color: #ffffff;
              padding: 15px 30px;
              font-size: 18px;
              text-decoration: none;
              border-radius: 5px;
              transition: background-color 0.3s ease;
          }
          .button:hover {
              background-color: #45a049;
          }
          .footer {
              background: #4CAF50;
              padding: 10px;
              text-align: center;
              font-size: 0.9em;
              color: #ffffff;
              border-radius: 0 0 10px 10px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Subscription Successful</h1>
          </div>
          <div class="content">
              <p>Hello ${firstName},</p>
              <p>We’re thrilled to inform you that your subscription to the <strong>${planName}</strong> plan has been successfully activated!</p>
              <p>Your subscription details:</p>
              <ul>
                  <li><strong>Start Date:</strong> ${startDate}</li>
                  <li><strong>End Date:</strong> ${endDate}</li>
              </ul>
              <p>Click below to manage your subscription or explore more features:</p>
              <div class="button-container">
                  <a href="${link}" class="button">Manage My Subscription</a>
              </div>
              <p>Thank you for choosing us! We’re excited to have you onboard.</p>
              <p>Best regards,<br>HubSpot Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
    `;
  };
  