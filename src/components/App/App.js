import * as React from "react";
import PropTypes from "prop-types";
import requester from "@sitevision/api/client/requester";
import router from "@sitevision/api/common/router";
import toasts from "@sitevision/api/client/toasts";
import i18n from "@sitevision/api/common/i18n";
import Textarea from "./Textarea/TextArea";
import FeedbackPost from "./FeedbackPost/FeedbackPost";

const App = ({ prevFeedback }) => {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    if (prevFeedback) {
      setPosts(prevFeedback);
    }
  }, [prevFeedback]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    requester
      .doPost({
        url: router.getStandaloneUrl("/feedback"),
        data: formData,
        fileUpload: true,
      })
      .then((response, status, options) => {
        if (status === "success" && options.status == 200) {
          form.reset();
          toasts.publish({
            message: i18n.get("successMessage"),
            type: "success",
            ttl: 5,
          });
          setPosts([response.post, ...posts]);
        }
      })
      .catch((error) =>
        alert(`Error! Something unfortunate occured: ${error}`)
      );
  };

  return (
    <>
      <form
        className="env-form env-m-around--medium"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <Textarea text="text" name="clientFeedback"></Textarea>
        <button
          type="submit"
          className="env-button env-button--primary env-m-vertical--medium"
        >
          {i18n.get("submitFeedback")}
        </button>
      </form>
      <FeedbackPost posts={posts}></FeedbackPost>
    </>
  );
};

App.propTypes = {
  prevFeedback: PropTypes.array,
};

export default App;
