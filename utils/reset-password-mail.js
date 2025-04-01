exports.resetPasswordMail = (link, firstName) => {
    return `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #2c2c2c; /* Dark background */
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
            background-color: #f4f4f4; /* Light grey background */
        }
        .header {
            background: #570e0e;
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
            background-color: #fc7e7e; /* Button color */
            color: #131111;
            padding: 15px 30px;
            font-size: 18px;
            text-decoration: none;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #218838;
        }
        .footer {
            background: #570e0e;
            padding: 10px;
            text-align: center;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #cccccc;
            border-radius: 0 0 10px 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hello ${firstName},</p>
            <p>We received a request to reset your password for your HubSpot account.</p>
            <p>Please click the button below to reset your password:</p>
            <div class="button-container">
                <a href="${link}" class="button">Reset My Password</a>
            </div>
            <p>If you did not request this password reset, you can safely ignore this email.</p>
            <p>Best regards,<br>HubSpot Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()}. All rights reserved.</p>
        </div>  
    </div>
</body>
</html>
    `;
};
