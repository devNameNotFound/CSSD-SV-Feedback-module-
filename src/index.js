import * as React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import router from '@sitevision/api/common/router';
import App from './components/App';
import i18n from '@sitevision/api/common/i18n';
import versionUtil from '@sitevision/api/server/VersionUtil';
import systemUserUtil from '@sitevision/api/server/SystemUserUtil';
import properties from '@sitevision/api/server/Properties';
import roleUtil from '@sitevision/api/server/RoleUtil';
import logUtil from '@sitevision/api/server/LogUtil';
import storage from '@sitevision/api/server/storage';
import portletContextUtil from '@sitevision/api/server/PortletContextUtil';
import getPrevFeedback from './helpers/getPrevFeedback';
import { sendMail } from './helpers/sendMail';
const feedbackData = storage.getCollectionDataStore('feedbackStorage')


router.use(isUserAuthorized);

function isUserAuthorized(req, res, next) {
  if (systemUserUtil.isAnonymous()) {
    if (req.xhr) {
      return res.status(401);
    }
    logUtil.info(JSON.stringify(portletContextUtil.getCurrentUser().getIdentifier()));
    return;
  }

  const roleMatcherBuilder = roleUtil.getRoleMatcherBuilder();
  const currentUser = portletContextUtil.getCurrentUser();
  const roleAdmin = roleUtil.getRoleByName('Administrator');
  const currentPage = portletContextUtil.getCurrentPage();
  roleMatcherBuilder.setUser(currentUser);
  roleMatcherBuilder.addRole(roleAdmin);
  const roleMatcher = roleMatcherBuilder.build();
  const userIsAdmin = roleMatcher.matchesAny(currentPage);
  if (userIsAdmin) {
    req.permission = { role: 'admin' }
  } else {
    req.permission = { role: 'isLoggedIn' }
  }
  next()
};

router.get('/', (req, res) => {
  try {
    const isInEditorMode = versionUtil.OFFLINE_VERSION == versionUtil.getCurrentVersion();

    if (isInEditorMode) {
      return res.send(
        renderToStaticMarkup(
          <div className="env-alert env-alert--danger" role="alert">
            <p>
              {i18n.get("alertIsInEditMode")}
            </p>
          </div>
        )
      );
    }
  } catch (error) {
    logUtil.error(JSON.stringify(error))
  }

  const pageID = portletContextUtil.getCurrentPage().getIdentifier();
  let prevFeedback = [];
  logUtil.error(JSON.stringify(req.permission))
  if (req.permission.role == 'admin') {
    prevFeedback = getPrevFeedback(pageID);
  }

  const propsInObj = {
    prevFeedback,
  }

  res.agnosticRender(renderToString(<App {...propsInObj} />),
    propsInObj);
})

router.post('/feedback', (req, res) => {
  const { clientFeedback } = req.params;
  const pageID = portletContextUtil.getCurrentPage().getIdentifier();
  const pageName = properties.get(pageID, 'displayName')
  const pageURL = properties.get(pageID, 'URL');
  const currentUser = portletContextUtil.getCurrentUser();
  const userName = properties.get(currentUser, 'displayName')
  const isNew = true;

  try {
    const feedbackObj = {
      pageID,
      clientFeedback,
      userName,
      isNew,
      pageName
    }

    const { dsid } = feedbackData.add(feedbackObj)
    feedbackData.instantIndex(dsid);

    sendMail(pageName, pageURL);

    res.json({ post: feedbackObj })
  } catch (error) {
    logUtil.error(JSON.stringify(error));
  }
})