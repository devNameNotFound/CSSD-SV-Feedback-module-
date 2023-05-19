import mailUtil from "@sitevision/api/server/MailUtil";
import appData from "@sitevision/api/server/appData";

export function sendMail(pageName, pageURL) {
  const confMail = appData.get("mail");
  const mailBuilder = mailUtil.getMailBuilder();
  const mail = mailBuilder
    .setSubject(`A new feedback on page ${pageName}`)
    .setHtmlMessage(
      `Click here to read the feedback: <a href='${pageURL}'>${pageName}</a>`
    )
    .addRecipient(confMail)
    .build();

  mail.send();
}
