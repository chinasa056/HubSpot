exports.verify = (link, firstName) => {
    return `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cohort 5 Class </title>
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
            background:#1E3A8A;
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
            background-color:  #F2994A; /* Green background */
            color: #131111;
            padding: 15px 30px;
            font-size: 18px;
            text-decoration: none;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color:  #F2994A;
        }
        .footer {
            background: #1E3A8A;
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
            <h1>Welcome To HubSpot!</h1>
        </div>
        <div class="content">
            <p>Hello ${firstName},</p>
            <p>Thank you for signing up on HubSpot App. We are excited to have you on board.</p>
            <p>Please click the button below to verify your account:</p>
            <div class="button-container">
                <a href="${link}" class="button">Verify My Account</a>
            </div>
            <p>If you did not sign up on our platform, kindly ignore this email.</p>
            <p>Best regards,<br>HubSpot Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
        </div>  
    </div>
</body>
</html>
`
};

exports.bookingSuccess = (firstName, bookingDetails) => {
    const { reference, startDate, checkinTime, endDate } = bookingDetails;

    return `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #2c2c2c;
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
            background-color: #f4f4f4;
        }
        .header {
            background: #1E3A8A;
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
        .footer {
            background: #1E3A8A;
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
            <h1>Booking Confirmed!</h1>
        </div>
        <div class="content">
            <p>Hello ${firstName},</p>
            <p>Your booking has been successfully confirmed! Here are your booking details:</p>
            <p><strong>Start Date & Time:</strong> ${startDate} ${checkinTime}</p>
            <p><strong>End Date & Time:</strong> ${endDate}</p>
            <p><strong>Reference:</strong> ${reference}</p>
            <p>Please keep this reference code for verification when you visit the hub.</p>
            <p>Thank you for choosing our services.</p>
            <p>Best regards,<br>Booking Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
        </div>  
    </div>
</body>
</html>
    `;
};

exports.bookingFailure = (firstName, supportEmail, reference) => {
    return `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Failed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #2c2c2c;
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
            background-color: #f4f4f4;
        }
        .header {
            background: #DC2626; /* Red background */
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
        .footer {
            background: #1E3A8A;
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
            <h1>Booking Failed</h1>
        </div>
        <div class="content">
            <p>Hello ${firstName},</p>
            <p>We regret to inform you that your booking could not be completed at this time. Here are the details:</p>
            <p><strong>Reference Code:</strong> ${reference}</p>
            <p>Please verify the details and try again. If the issue persists, feel free to reach out to our support team for assistance.</p>
            <p>You can contact us at <strong>${supportEmail}</strong>. We’re here to help resolve this as soon as possible.</p>
            <p>We apologize for any inconvenience caused.</p>
            <p>Best regards,<br>Booking Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
        </div>  
    </div>
</body>
</html>
    `;
};