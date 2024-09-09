import PropTypes from 'prop-types';
import * as React from 'react';
import i18n from "@sitevision/api/common/i18n";

const TextArea = ({ name, type }) => {
  return (
    <>
      <label for={name} class="env-form-element__label">{i18n.get("labelInputFeedback")}</label>
      <div class="env-form-element__control">
        <textarea
          className="env-form-input"
          type={type}
          id={name}
          placeholder={i18n.get("feedbackInputPlaceholder")}
          name={name}
          rows="3"
          required
          />
        </div>
    </>
  )
}

TextArea.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string
}

export default TextArea