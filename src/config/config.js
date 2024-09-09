//https://developer.sitevision.se/docs/webapps/webapps-2/configuration/config.js/validation
(() => {
  window.validate = () => {
    const emailInput = document.getElementById("email");
    let isValid = true;

    if (!emailInput.validity.valid) {
      isValid = false;
      window.sv.addErrorMessage(emailInput, {
        component: errorMessage,
        message: emailInput.validationMessage,
        isValid: function (e) {
          return e.target.validity.valid;
        },
      });
    }
    return isValid && window.sv.validate();
  };
})();
