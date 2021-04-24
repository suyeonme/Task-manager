const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_Key;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'tndusrkd92@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to our app, ${name}.`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'tndusrkd92@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Goodbye, ${name}.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
