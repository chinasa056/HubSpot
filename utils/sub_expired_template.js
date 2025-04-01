exports.subscriptionExpired = (link, firstName, daysSinceExpiry) => {
    return `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Expired</title>
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
            border-bottom: 1px solid #ddd;
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
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #c0392b;
        }
        .footer {
            background: #e74c3c;
            padding: 10px;
            text-align: center;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #ffffff;
            border-radius: 0 0 10px 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Subscription Expired</h1>
        </div>
        <div class="content">
            <p>Hello ${firstName},</p>
            <p>We noticed that your subscription expired <strong>${daysSinceExpiry} day(s)</strong> ago. We’d hate for you to miss out on the amazing features you’ve been enjoying.</p>
            <p>Please click the button below to renew your subscription and regain full access to all the benefits.</p>
            <div class="button-container">
                <a href="${link}" class="button">Renew My Subscription</a>
            </div>
            <p>If you have already renewed your subscription, kindly ignore this email.</p>
            <p>We hope to see you back soon!<br>Best regards,<br>HubSpot Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} HubSpot. All rights reserved.</p>
        </div>  
    </div>
</body>
</html>
    `;
};
