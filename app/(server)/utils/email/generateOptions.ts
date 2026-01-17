const generateOptions = (
  link: string,
  email: string,
  unHashedToken: string,
  name: string
) => {
  let options = {
    link: link,
    email: email,
    subject: "Please verify your email",
    mailgenContent: {
      body: {
        name: name,
        intro: "Welcome to  miilaan! We're very excited to have you on board.",
        action: {
          instructions: `Use this confirmation code: ${unHashedToken} or just click the confirm your account button to complete confirmation `,
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: `${link}/auth/confirm?code=${unHashedToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    },
  };
  return options;
};
