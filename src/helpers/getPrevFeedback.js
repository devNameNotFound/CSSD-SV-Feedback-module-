import storage from "@sitevision/api/server/storage";
import appData from "@sitevision/api/server/appData";
const feedbackData = storage.getCollectionDataStore("feedbackStorage");
const quantityOfFeedback = appData.get("quantity");

const getPrevFeedback = (id) => {
  const feedbackPosts = feedbackData
    .find(`ds.analyzed.pageID:${id}`, `${quantityOfFeedback}`)
    .toArray();
  return feedbackPosts;
};

export default getPrevFeedback;
