import * as React from "react";
import PropTypes from "prop-types";
import i18n from "@sitevision/api/common/i18n";

const FeedbackPost = ({ posts }) => {
  const newPostStyle =
    "env-alert--success env-block-secondary env-block-secondary--border";
  const notNewPostStyle = "env-block-primary env-block-primary--border";
  const defaultStyle =
    "env-shadow-large env-m-vertical--small env-m-around--medium example-border-util";

  return (
    <>
      {posts &&
        posts.map((post, index) => {
          return (
            <div
              key={post.dsid}
              className={`${
                post.isNew ? newPostStyle : notNewPostStyle
              } ${defaultStyle}`}
            >
              <div className="env-card__body ">
                <p className="env-ui-text-caption example-flex env-flex env-flex--justify-content-end">
                  {index + 1}.
                </p>
                <p className="env-ui-text-caption">{post.userName}</p>
                <p className="env-ui-rtext-caption">
                  {i18n.get("comment")}: {post.clientFeedback}
                </p>
              </div>
            </div>
          );
        })}
    </>
  );
};

FeedbackPost.propTypes = {
  posts: PropTypes.array,
};

export default FeedbackPost;
