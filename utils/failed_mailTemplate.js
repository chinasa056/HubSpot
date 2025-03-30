exports.failedSubscription = (link, firstName, planName) => {
    return `
        <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Failed</title>
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
              background: #e74c3c;
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
              background-color: #e74c3c;
              color: #ffffff;
              padding: 15px 30px;
              font-size: 18px;
              text-decoration: none;
              border-radius: 5px;
              transition: background-color 0.3s ease;
          }
          .button:hover {
              background-color: #c0392b;
          }
          .footer {
              background: #e74c3c;
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
              <h1>Subscription Failed</h1>
          </div>
          <div class="content">
              <p>Hello ${firstName},</p>
              <p>We’re sorry to inform you that your subscription to the <strong>${planName}</strong> plan could not be completed.</p>
              <p>Please check your payment details and try again. If the issue persists, contact our support team for assistance.</p>
              <div class="button-container">
                  <a href="${link}" class="button">Retry Payment</a>
              </div>
              <p>We value your interest and hope to have you onboard soon!</p>
              <p>Best regards,<br>Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
    `;
  };
  