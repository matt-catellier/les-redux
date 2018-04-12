function createMail(emailId ,fromUserId ,toUserId ,subject ,body) {
    return {
        type : "CREATEMAIL",
        payload: { emailId ,fromUserId ,toUserId ,subject ,body }
    }
  }
  ,function sendMail(emailId) {
    return {
        type : "SENDMAIL",
        payload: { emailId }
    }
  }
  ,function readMail(emailId ,dateTimeRead) {
    return {
        type : "READMAIL",
        payload: { emailId ,dateTimeRead }
    }
  }
  