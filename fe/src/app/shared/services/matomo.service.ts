import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatomoTags } from 'src/app/shared/models';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
export class MatomoService extends ResourceService<MatomoTags> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'matomo';
  }

  getAllModules() {
    return [
      {
        name: 'Module API',
        value: 'API',
      },
      {
        name: 'Module Actions',
        value: 'Actions',
      },
      {
        name: 'Module Annotations',
        value: 'Annotations',
      },
      {
        name: 'Module Bandwidth',
        value: 'Bandwidth',
      },
      {
        name: 'Module Contents',
        value: 'Contents',
      },
      {
        name: 'Module CoreAdminHome',
        value: 'CoreAdminHome',
      },
      {
        name: 'Module CustomAlerts',
        value: 'CustomAlerts',
      },
      {
        name: 'Module CustomDimensions',
        value: 'CustomDimensions',
      },
      {
        name: 'Module CustomJsTracker',
        value: 'CustomJsTracker',
      },
      {
        name: 'Module CustomVariables',
        value: 'CustomVariables',
      },
      {
        name: 'Module DBStats',
        value: 'DBStats',
      },
      {
        name: 'Module Dashboard',
        value: 'Dashboard',
      },
      {
        name: 'Module DevicePlugins',
        value: 'DevicePlugins',
      },
      {
        name: 'Module DevicesDetection',
        value: 'DevicesDetection',
      },
      {
        name: 'Module Events',
        value: 'Events',
      },
      {
        name: 'Module ExampleAPI',
        value: 'ExampleAPI',
      },
      {
        name: 'Module ExamplePlugin',
        value: 'ExamplePlugin',
      },
      {
        name: 'Module ExampleReport',
        value: 'ExampleReport',
      },
      {
        name: 'Module ExampleUI',
        value: 'ExampleUI',
      },
      {
        name: 'Module Feedback',
        value: 'Feedback',
      },
      {
        name: 'Module Goals',
        value: 'Goals',
      },
      {
        name: 'Module ImageGraph',
        value: 'ImageGraph',
      },
      {
        name: 'Module Insights',
        value: 'Insights',
      },
      {
        name: 'Module LanguagesManager',
        value: 'LanguagesManager',
      },
      {
        name: 'Module Live',
        value: 'Live',
      },
      {
        name: 'Module LogViewer',
        value: 'LogViewer',
      },
      {
        name: 'Module LoginLdap',
        value: 'LoginLdap',
      },
      {
        name: 'Module Login',
        value: 'Login',
      },
      {
        name: 'Module MarketingCampaignsReporting',
        value: 'MarketingCampaignsReporting',
      },
      {
        name: 'Module Marketplace',
        value: 'Marketplace',
      },
      {
        name: 'Module MobileMessaging',
        value: 'MobileMessaging',
      },
      {
        name: 'Module MultiSites',
        value: 'MultiSites',
      },
      {
        name: 'Module Overlay',
        value: 'Overlay',
      },
      {
        name: 'Module PagePerformance',
        value: 'PagePerformance',
      },
      {
        name: 'Module PrivacyManager',
        value: 'PrivacyManager',
      },
      {
        name: 'Module Provider',
        value: 'Provider',
      },
      {
        name: 'Module Referrers',
        value: 'Referrers',
      },
      {
        name: 'Module SEO',
        value: 'SEO',
      },
      {
        name: 'Module ScheduledReports',
        value: 'ScheduledReports',
      },
      {
        name: 'Module SegmentEditor',
        value: 'SegmentEditor',
      },
      {
        name: 'Module SitesManager',
        value: 'SitesManager',
      },
      {
        name: 'Module TagManager',
        value: 'TagManager',
      },
      {
        name: 'Module Tour',
        value: 'Tour',
      },
      {
        name: 'Module Transitions',
        value: 'Transitions',
      },
      {
        name: 'Module TreemapVisualization',
        value: 'TreemapVisualization',
      },
      {
        name: 'Module TwoFactorAuth',
        value: 'TwoFactorAuth',
      },
      {
        name: 'Module UserCountry',
        value: 'UserCountry',
      },
      {
        name: 'Module UserId',
        value: 'UserId',
      },
      {
        name: 'Module UserLanguage',
        value: 'UserLanguage',
      },
      {
        name: 'Module UsersManager',
        value: 'UsersManager',
      },
      {
        name: 'Module VisitFrequency',
        value: 'VisitFrequency',
      },
      {
        name: 'Module VisitTime',
        value: 'VisitTime',
      },
      {
        name: 'Module VisitorInterest',
        value: 'VisitorInterest',
      },
      {
        name: 'Module VisitsSummary',
        value: 'VisitsSummary',
      },
    ];
  }

  //***************************************************************************************************** */
  //***************************************************************************************************** */
  //***************************************************************************************************** */
  //***************************************************************************************************** */
  //***************************************************************************************************** */
  getModuleAPi() {
    return [
      {
        name: 'getMatomoVersion',
        value: 'getMatomoVersion',
      },
      {
        name: 'getPhpVersion',
        value: 'getPhpVersion',
      },
      {
        name: 'getIpFromHeader',
        value: 'getIpFromHeader',
      },
      {
        name: 'getSettings',
        value: 'getSettings',
      },
      {
        name: 'getSegmentsMetadata',
        value: 'getSegmentsMetadata',
      },
      {
        name: 'getMetadata',
        value: 'getMetadata',
      },
      {
        name: 'getReportMetadata',
        value: 'getReportMetadata',
      },
      {
        name: 'getProcessedReport',
        value: 'getProcessedReport',
      },
      {
        name: 'getReportPagesMetadata',
        value: 'getReportPagesMetadata',
      },
      {
        name: 'getWidgetMetadata',
        value: 'getWidgetMetadata',
      },
      {
        name: 'get',
        value: 'get',
      },
      {
        name: 'getRowEvolution',
        value: 'getRowEvolution',
      },
      {
        name: 'getBulkRequest',
        value: 'getBulkRequest',
      },
      {
        name: 'isPluginActivated',
        value: 'isPluginActivated',
      },
      {
        name: 'getSuggestedValuesForSegment',
        value: 'getSuggestedValuesForSegment',
      },
      {
        name: 'getPagesComparisonsDisabledFor',
        value: 'getPagesComparisonsDisabledFor',
      },
      {
        name: 'getGlossaryReports',
        value: 'getGlossaryReports',
      },
      {
        name: 'getGlossaryMetrics',
        value: 'getGlossaryMetrics',
      },
    ];
  }

  getModuleActions() {
    return [
      {
        name: 'get',
        value: 'get',
      },
      {
        name: 'getPageUrls',
        value: 'getPageUrls',
      },
      {
        name: 'getPageUrlsFollowingSiteSearch',
        value: 'getPageUrlsFollowingSiteSearch',
      },
      {
        name: 'getPageTitlesFollowingSiteSearch',
        value: 'getPageTitlesFollowingSiteSearch',
      },
      {
        name: 'getEntryPageUrls',
        value: 'getEntryPageUrls',
      },
      {
        name: 'getExitPageUrls',
        value: 'getExitPageUrls',
      },
      {
        name: 'getPageUrl',
        value: 'getPageUrl',
      },
      {
        name: 'getPageTitles',
        value: 'getPageTitles',
      },
      {
        name: 'getEntryPageTitles',
        value: 'getEntryPageTitles',
      },
      {
        name: 'getExitPageTitles',
        value: 'getExitPageTitles',
      },
      {
        name: 'getPageTitle',
        value: 'getPageTitle',
      },
      {
        name: 'getDownloads',
        value: 'getDownloads',
      },
      {
        name: 'getDownload',
        value: 'getDownload',
      },
      {
        name: 'getOutlinks',
        value: 'getOutlinks',
      },
      {
        name: 'getOutlink',
        value: 'getOutlink',
      },
      {
        name: 'getSiteSearchKeywords',
        value: 'getSiteSearchKeywords',
      },
      {
        name: 'getSiteSearchNoResultKeywords',
        value: 'getSiteSearchNoResultKeywords',
      },
      {
        name: 'getSiteSearchCategories',
        value: 'getSiteSearchCategories',
      },
    ];
  }

  getModuleAnnotations() {
    return [
      {
        name: 'add',
        value: 'add',
      },
      {
        name: 'save',
        value: 'save',
      },
      {
        name: 'delete',
        value: 'delete',
      },
      {
        name: 'deleteAll',
        value: 'deleteAll',
      },
      {
        name: 'get',
        value: 'getAll',
      },
      {
        name: 'getAnnotationCountForDates',
        value: 'getAnnotationCountForDates',
      },
    ];
  }
  getModuleBandwidth() {
    return [
      {
        name: 'get',
        value: 'get',
      },
    ];
  }
  getModuleContents() {
    return [
      {
        name: 'getContentNames',
        value: 'getContentNames',
      },
      {
        name: 'getContentPieces',
        value: 'getContentPieces',
      },
    ];
  }

  getModuleCoreAdminHome() {
    return [
      {
        name: 'runScheduledTasks',
        value: 'runScheduledTasks',
      },
      {
        name: 'invalidateArchivedReports',
        value: 'invalidateArchivedReports',
      },
      {
        name: 'runCronArchiving',
        value: 'runCronArchiving',
      },
      {
        name: 'deleteAllTrackingFailures',
        value: 'deleteAllTrackingFailures',
      },
      {
        name: 'deleteTrackingFailure',
        value: 'deleteTrackingFailure',
      },
      {
        name: 'getTrackingFailures',
        value: 'getTrackingFailures',
      },
    ];
  }

  getModuleCustomAlerts() {
    return [
      {
        name: 'getValuesForAlertInPast',
        value: 'getValuesForAlertInPast',
      },
      {
        name: 'getAlert',
        value: 'getAlert',
      },
      {
        name: 'getAlerts',
        value: 'getAlerts',
      },
      {
        name: 'addAlert',
        value: 'addAlert',
      },
      {
        name: 'editAlert',
        value: 'editAlert',
      },
      {
        name: 'deleteAlert',
        value: 'deleteAlert',
      },
      {
        name: 'getTriggeredAlerts',
        value: 'getTriggeredAlerts',
      },
    ];
  }

  getModuleCustomDimensions() {
    return [
      {
        name: 'getCustomDimension',
        value: 'getCustomDimension',
      },
      {
        name: 'configureNewCustomDimension',
        value: 'configureNewCustomDimension',
      },
      {
        name: 'configureExistingCustomDimension ',
        value: 'configureExistingCustomDimension ',
      },
      {
        name: 'getConfiguredCustomDimensions ',
        value: 'getConfiguredCustomDimensions ',
      },
      {
        name: 'getConfiguredCustomDimensionsHavingScope ',
        value: 'getConfiguredCustomDimensionsHavingScope ',
      },
      {
        name: 'getAvailableScopes ',
        value: 'getAvailableScopes ',
      },
      {
        name: 'getAvailableExtractionDimensions ',
        value: 'getAvailableExtractionDimensions ',
      },
    ];
  }

  getModuleCustomJsTracker() {
    return [
      {
        name: 'doesIncludePluginTrackersAutomatically  ',
        value: 'doesIncludePluginTrackersAutomatically ',
      },
    ];
  }

  getModuleCustomVariables() {
    return [
      {
        name: 'getCustomVariables',
        value: 'getCustomVariables',
      },
      {
        name: 'getCustomVariablesValuesFromNameId ',
        value: 'getCustomVariablesValuesFromNameId ',
      },
      {
        name: 'getUsagesOfSlots',
        value: 'getUsagesOfSlots',
      },
    ];
  }

  getModuleDBStats() {
    return [
      {
        name: 'getGeneralInformation',
        value: 'getGeneralInformation',
      },
      {
        name: 'getDBStatus',
        value: 'getDBStatus',
      },
      {
        name: 'getDatabaseUsageSummary',
        value: 'getDatabaseUsageSummary',
      },
      {
        name: 'getTrackerDataSummary',
        value: 'getTrackerDataSummary',
      },
      {
        name: 'getMetricDataSummary ',
        value: 'getMetricDataSummary ',
      },
      {
        name: 'getMetricDataSummaryByYear',
        value: 'getMetricDataSummaryByYear ',
      },
      {
        name: 'getReportDataSummary ',
        value: 'getReportDataSummary ',
      },
      {
        name: 'getReportDataSummaryByYear',
        value: 'getReportDataSummaryByYear ',
      },
      {
        name: 'getAdminDataSummary',
        value: 'getAdminDataSummary',
      },
      {
        name: 'getIndividualReportsSummary',
        value: 'getIndividualReportsSummary',
      },
      {
        name: 'getIndividualMetricsSummary',
        value: 'getIndividualMetricsSummary',
      },
    ];
  }
  getModuleDashboard() {
    return [
      {
        name: 'getDashboards',
        value: 'getDashboards',
      },
      {
        name: 'createNewDashboardForUser',
        value: 'createNewDashboardForUser',
      },
      {
        name: 'removeDashboard',
        value: 'removeDashboard',
      },
      {
        name: 'copyDashboardToUser',
        value: 'copyDashboardToUser',
      },
      {
        name: 'resetDashboardLayout',
        value: 'resetDashboardLayout',
      },
    ];
  }

  getModuleDevicePlugins() {
    return [
      {
        name: 'getPlugin',
        value: 'getPlugin',
      },
    ];
  }

  getModuleDevicesDetection() {
    return [
      {
        name: 'getType',
        value: 'getType',
      },
      {
        name: 'getBrand',
        value: 'getBrand',
      },
      {
        name: 'getModel',
        value: 'getModel',
      },
      {
        name: 'getOsFamilies',
        value: 'getOsFamilies',
      },
      {
        name: 'getOsVersions',
        value: 'getOsVersions',
      },
      {
        name: 'getBrowsers',
        value: 'getBrowsers',
      },
      {
        name: 'getBrowserVersions',
        value: 'getBrowserVersions',
      },
      {
        name: 'getBrowserEngines',
        value: 'getBrowserEngines',
      },
    ];
  }

  getModuleEvents() {
    return [
      {
        name: 'getCategory',
        value: 'getCategory',
      },
      {
        name: 'getAction',
        value: 'getAction',
      },
      {
        name: 'getName',
        value: 'getName',
      },
      {
        name: 'getActionFromCategoryId',
        value: 'getActionFromCategoryId',
      },
      {
        name: 'getNameFromCategoryId',
        value: 'getNameFromCategoryId',
      },
      {
        name: 'getCategoryFromActionId',
        value: 'getCategoryFromActionId',
      },
      {
        name: 'getNameFromActionId',
        value: 'getNameFromActionId',
      },
      {
        name: 'getActionFromNameId',
        value: 'getActionFromNameId',
      },
      {
        name: 'getCategoryFromNameId',
        value: 'getCategoryFromNameId',
      },
    ];
  }

  getModuleExampleAPI() {
    return [
      {
        name: 'getMatomoVersion',
        value: 'getMatomoVersion',
      },
      {
        name: 'getAnswerToLife',
        value: 'getAnswerToLife',
      },
      {
        name: 'getObject',
        value: 'getObject',
      },
      {
        name: 'getSum',
        value: 'getSum',
      },
      {
        name: 'getNull',
        value: 'getNull',
      },
      {
        name: 'getDescriptionArray',
        value: 'getDescriptionArray',
      },
      {
        name: 'getCompetitionDatatable',
        value: 'getCompetitionDatatable',
      },
      {
        name: 'getMoreInformationAnswerToLife',
        value: 'getMoreInformationAnswerToLife',
      },
      {
        name: 'getMultiArray',
        value: 'getMultiArray',
      },
    ];
  }

  getModuleExamplePlugin() {
    return [
      {
        name: 'getAnswerToLife',
        value: 'getAnswerToLife',
      },
      {
        name: 'getExampleReport',
        value: 'getExampleReport',
      },
      {
        name: 'getExampleArchivedMetric',
        value: 'getExampleArchivedMetric',
      },
      {
        name: 'getSegmentHash',
        value: 'getSegmentHash',
      },
    ];
  }

  getModuleExampleReport() {
    return [
      {
        name: 'getExampleReport',
        value: 'getExampleReport',
      },
    ];
  }

  getModuleExampleUI() {
    return [
      {
        name: 'getTemperaturesEvolution',
        value: 'getTemperaturesEvolution',
      },
      {
        name: 'getTemperatures',
        value: 'getTemperatures',
      },
      {
        name: 'getPlanetRatios',
        value: 'getPlanetRatios',
      },
      {
        name: 'getPlanetRatiosWithLogos',
        value: 'getPlanetRatiosWithLogos',
      },
    ];
  }

  getModuleFeedback() {
    return [
      {
        name: 'sendFeedbackForFeature',
        value: 'sendFeedbackForFeature',
      },
      {
        name: 'sendFeedbackForSurvey',
        value: 'sendFeedbackForSurvey',
      },
      {
        name: 'updateFeedbackReminderDate',
        value: 'updateFeedbackReminderDate',
      },
    ];
  }

  getModuleGoals() {
    return [
      {
        name: 'getGoal',
        value: 'getGoal',
      },
      {
        name: 'getGoals',
        value: 'getGoals',
      },
      {
        name: 'addGoal',
        value: 'addGoal',
      },
      {
        name: 'updateGoal',
        value: 'updateGoal',
      },
      {
        name: 'deleteGoal',
        value: 'deleteGoal',
      },
      {
        name: 'getItemsSku',
        value: 'getItemsSku',
      },
      {
        name: 'getItemsName',
        value: 'getItemsName',
      },
      {
        name: 'getItemsCategory',
        value: 'getItemsCategory',
      },
      {
        name: 'get',
        value: 'get',
      },
      {
        name: 'getDaysToConversion',
        value: 'getDaysToConversion',
      },
      {
        name: 'getVisitsUntilConversion',
        value: 'getVisitsUntilConversion',
      },
    ];
  }

  getModuleImageGraph() {
    return [
      {
        name: 'get',
        value: 'get',
      },
    ];
  }

  getModuleInsights() {
    return [
      {
        name: 'canGenerateInsights',
        value: 'canGenerateInsights',
      },
      {
        name: 'getInsightsOverview',
        value: 'getInsightsOverview',
      },
      {
        name: 'getMoversAndShakersOverview',
        value: 'getMoversAndShakersOverview',
      },
      {
        name: 'getMoversAndShakers',
        value: 'getMoversAndShakers',
      },
      {
        name: 'getInsights',
        value: 'getInsights',
      },
    ];
  }

  getModuleLanguagesManager() {
    return [
      {
        name: 'isLanguageAvailable',
        value: 'isLanguageAvailable',
      },
      {
        name: 'getAvailableLanguages',
        value: 'getAvailableLanguages',
      },
      {
        name: 'getAvailableLanguagesInfo',
        value: 'getAvailableLanguagesInfo',
      },
      {
        name: 'getAvailableLanguageNames',
        value: 'getAvailableLanguageNames',
      },
      {
        name: 'getTranslationsForLanguage',
        value: 'getTranslationsForLanguage',
      },
      {
        name: 'getLanguageForUser',
        value: 'getLanguageForUser',
      },
      {
        name: 'setLanguageForUser',
        value: 'setLanguageForUser',
      },
      {
        name: 'uses12HourClockForUser',
        value: 'uses12HourClockForUser',
      },
      {
        name: 'set12HourClockForUser',
        value: 'set12HourClockForUser',
      },
    ];
  }

  getModuleLive() {
    return [
      {
        name: 'getCounters',
        value: 'getCounters',
      },
      {
        name: 'getLastVisitsDetails',
        value: 'getLastVisitsDetails',
      },
      {
        name: 'getVisitorProfile',
        value: 'getVisitorProfile',
      },
      {
        name: 'getMostRecentVisitorId',
        value: 'getMostRecentVisitorId',
      },
    ];
  }

  getModuleLogViewer() {
    return [
      {
        name: 'getLogEntries ',
        value: 'getLogEntries ',
      },
      {
        name: 'getAvailableLogReaders',
        value: 'getAvailableLogReaders',
      },
      {
        name: 'getConfiguredLogReaders',
        value: 'getConfiguredLogReaders',
      },
      {
        name: 'getLogConfig',
        value: 'getLogConfig',
      },
    ];
  }

  getModuleLoginLdap() {
    return [
      {
        name: 'saveLdapConfig',
        value: 'saveLdapConfig',
      },
      {
        name: 'saveServersInfo',
        value: 'saveServersInfo',
      },
      {
        name: 'getCountOfUsersMemberOf',
        value: 'getCountOfUsersMemberOf',
      },
      {
        name: 'getCountOfUsersMatchingFilter',
        value: 'getCountOfUsersMatchingFilter',
      },
      {
        name: 'synchronizeUser',
        value: 'synchronizeUser',
      },
    ];
  }

  getModuleLogin() {
    return [
      {
        name: 'unblockBruteForceIPs',
        value: 'unblockBruteForceIPs',
      },
    ];
  }

  getModuleMarketingCampaignsReporting() {
    return [
      {
        name: 'getId',
        value: 'getId',
      },
      {
        name: 'getName',
        value: 'getName',
      },
      {
        name: 'getKeywordContentFromNameId',
        value: 'getKeywordContentFromNameId',
      },
      {
        name: 'getKeyword',
        value: 'getKeyword',
      },
      {
        name: 'getSource',
        value: 'getSource',
      },
      {
        name: 'getMedium',
        value: 'getMedium',
      },
      {
        name: 'getContent',
        value: 'getContent',
      },
      {
        name: 'getGroup',
        value: 'getGroup',
      },
      {
        name: 'getPlacement',
        value: 'getPlacement',
      },
      {
        name: 'getSourceMedium',
        value: 'getSourceMedium',
      },
      {
        name: 'getNameFromSourceMediumId',
        value: 'getNameFromSourceMediumId',
      },
    ];
  }

  getModuleMarketplace() {
    return [
      {
        name: 'deleteLicenseKey',
        value: 'deleteLicenseKey',
      },
      {
        name: 'saveLicenseKey',
        value: 'saveLicenseKey',
      },
    ];
  }

  getModuleMobileMessaging() {
    return [
      {
        name: 'areSMSAPICredentialProvided',
        value: 'areSMSAPICredentialProvided',
      },
      {
        name: 'getSMSProvider',
        value: 'getSMSProvider',
      },
      {
        name: 'setSMSAPICredential',
        value: 'setSMSAPICredential',
      },
      {
        name: 'addPhoneNumber',
        value: 'addPhoneNumber',
      },
      {
        name: 'getCreditLeft',
        value: 'getCreditLeft',
      },
      {
        name: 'removePhoneNumber',
        value: 'removePhoneNumber',
      },
      {
        name: 'validatePhoneNumber',
        value: 'validatePhoneNumber',
      },
      {
        name: 'deleteSMSAPICredential',
        value: 'deleteSMSAPICredential',
      },
      {
        name: 'setDelegatedManagement',
        value: 'setDelegatedManagement',
      },
      {
        name: 'getDelegatedManagement',
        value: 'getDelegatedManagement',
      },
    ];
  }

  getModuleMultiSites() {
    return [
      {
        name: 'getAll',
        value: 'getAll',
      },
      {
        name: 'getOne',
        value: 'getOne',
      },
    ];
  }

  getModuleOverlay() {
    return [
      {
        name: 'getTranslations',
        value: 'getTranslations',
      },
      {
        name: 'getExcludedQueryParameters',
        value: 'getExcludedQueryParameters',
      },
      {
        name: 'getFollowingPages',
        value: 'getFollowingPages',
      },
    ];
  }

  getModulePagePerformance() {
    return [
      {
        name: 'get',
        value: 'get',
      },
    ];
  }
  getModuleProvider() {
    return [
      {
        name: 'getProvider',
        value: 'getProvider',
      },
    ];
  }

  getModulePrivacyManager() {
    return [
      {
        name: 'deleteDataSubjects',
        value: 'deleteDataSubjects',
      },
      {
        name: 'exportDataSubjects',
        value: 'exportDataSubjects',
      },
      {
        name: 'findDataSubjects',
        value: 'findDataSubjects',
      },
      {
        name: 'anonymizeSomeRawData',
        value: 'anonymizeSomeRawData',
      },
      {
        name: 'getAvailableVisitColumnsToAnonymize',
        value: 'getAvailableVisitColumnsToAnonymize',
      },
      {
        name: 'getAvailableLinkVisitActionColumnsToAnonymize',
        value: 'getAvailableLinkVisitActionColumnsToAnonymize',
      },
    ];
  }

  getModuleReferrers() {
    return [
      {
        name: 'get',
        value: 'get',
      },
      {
        name: 'getReferrerType',
        value: 'getReferrerType',
      },
      {
        name: 'getAll',
        value: 'getAll',
      },
      {
        name: 'getKeywords',
        value: 'getKeywords',
      },
      {
        name: 'getSearchEnginesFromKeywordId',
        value: 'getSearchEnginesFromKeywordId',
      },
      {
        name: 'getSearchEngines',
        value: 'getSearchEngines',
      },
      {
        name: 'getKeywordsFromSearchEngineId',
        value: 'getKeywordsFromSearchEngineId',
      },
      {
        name: 'getCampaigns',
        value: 'getCampaigns',
      },
      {
        name: 'getKeywordsFromCampaignId',
        value: 'getKeywordsFromCampaignId',
      },
      {
        name: 'getWebsites',
        value: 'getWebsites',
      },
      {
        name: 'getUrlsFromWebsiteId',
        value: 'getUrlsFromWebsiteId',
      },
      {
        name: 'getSocials',
        value: 'getSocials',
      },
      {
        name: 'getUrlsForSocial',
        value: 'getUrlsForSocial',
      },
      {
        name: 'getNumberOfDistinctSearchEngines',
        value: 'getNumberOfDistinctSearchEngines',
      },
      {
        name: 'getNumberOfDistinctSocialNetworks',
        value: 'getNumberOfDistinctSocialNetworks',
      },
      {
        name: 'getNumberOfDistinctKeywords',
        value: 'getNumberOfDistinctKeywords',
      },
      {
        name: 'getNumberOfDistinctCampaigns',
        value: 'getNumberOfDistinctCampaigns',
      },
      {
        name: 'getNumberOfDistinctWebsites',
        value: 'getNumberOfDistinctWebsites',
      },
      {
        name: 'getNumberOfDistinctWebsitesUrls',
        value: 'getNumberOfDistinctWebsitesUrls',
      },
    ];
  }

  getModuleResolution() {
    return [
      {
        name: 'getResolution',
        value: 'getResolution',
      },
      {
        name: 'getConfiguration',
        value: 'getConfiguration',
      },
    ];
  }

  getModuleSEO() {
    return [
      {
        name: 'getRank',
        value: 'getRank',
      },
    ];
  }

  getModuleScheduledReports() {
    return [
      {
        name: 'addReport',
        value: 'addReport',
      },
      {
        name: 'updateReport',
        value: 'updateReport',
      },
      {
        name: 'deleteReport',
        value: 'deleteReport',
      },
      {
        name: 'getReports',
        value: 'getReports',
      },
      {
        name: 'generateReport',
        value: 'generateReport',
      },
      {
        name: 'sendReport',
        value: 'sendReport',
      },
    ];
  }

  getModuleSegmentEditor() {
    return [
      {
        name: 'isUserCanAddNewSegment',
        value: 'isUserCanAddNewSegment',
      },
      {
        name: 'delete',
        value: 'delete',
      },
      {
        name: 'update',
        value: 'update',
      },
      {
        name: 'add',
        value: 'add',
      },
      {
        name: 'get',
        value: 'get',
      },
      {
        name: 'getAll',
        value: 'getAll',
      },
    ];
  }

  getModuleSitesManager() {
    return [
      {
        name: 'getJavascriptTag',
        value: 'getJavascriptTag',
      },
      {
        name: 'getImageTrackingCode',
        value: 'getImageTrackingCode',
      },
      {
        name: 'getSitesFromGroup',
        value: 'getSitesFromGroup',
      },
      {
        name: 'getSitesGroups',
        value: 'getSitesGroups',
      },
      {
        name: 'getSiteFromId',
        value: 'getSiteFromId',
      },
      {
        name: 'getSiteUrlsFromId',
        value: 'getSiteUrlsFromId',
      },
      {
        name: 'getAllSites',
        value: 'getAllSites',
      },
      {
        name: 'getAllSitesId',
        value: 'getAllSitesId',
      },
      {
        name: 'getSitesWithAdminAccess',
        value: 'getSitesWithAdminAccess',
      },
      {
        name: 'getSitesWithAdminAccess',
        value: 'getSitesWithAdminAccess',
      },
      {
        name: 'getSitesWithAtLeastViewAccess',
        value: 'getSitesWithAtLeastViewAccess',
      },
      {
        name: 'getSitesIdWithAdminAccess',
        value: 'getSitesIdWithAdminAccess',
      },
      {
        name: 'getSitesIdWithViewAccess',
        value: 'getSitesIdWithViewAccess',
      },
      {
        name: 'getSitesIdWithWriteAccess',
        value: 'getSitesIdWithWriteAccess',
      },
      {
        name: 'getSitesIdWithAtLeastViewAccess',
        value: 'getSitesIdWithAtLeastViewAccess',
      },
      {
        name: 'getSitesIdFromSiteUrl',
        value: 'getSitesIdFromSiteUrl',
      },
      {
        name: 'addSite',
        value: 'addSite',
      },
      {
        name: 'getSiteSettings',
        value: 'getSiteSettings',
      },
      {
        name: 'deleteSite',
        value: 'deleteSite',
      },
      {
        name: 'addSiteAliasUrls',
        value: 'addSiteAliasUrls',
      },
      {
        name: 'setSiteAliasUrls',
        value: 'setSiteAliasUrls',
      },
      {
        name: 'getIpsForRange',
        value: 'getIpsForRange',
      },
      {
        name: 'setGlobalExcludedIps',
        value: 'setGlobalExcludedIps',
      },
      {
        name: 'setGlobalSearchParameters',
        value: 'setGlobalSearchParameters',
      },
      {
        name: 'getSearchKeywordParametersGlobal',
        value: 'getSearchKeywordParametersGlobal',
      },
      {
        name: 'getSearchCategoryParametersGlobal',
        value: 'getSearchCategoryParametersGlobal',
      },
      {
        name: 'getExcludedQueryParametersGlobal',
        value: 'getExcludedQueryParametersGlobal',
      },
      {
        name: 'getExcludedUserAgentsGlobal',
        value: 'getExcludedUserAgentsGlobal',
      },
      {
        name: 'setGlobalExcludedUserAgents',
        value: 'setGlobalExcludedUserAgents',
      },
      {
        name: 'getKeepURLFragmentsGlobal',
        value: 'getKeepURLFragmentsGlobal',
      },
      {
        name: 'setKeepURLFragmentsGlobal',
        value: 'setKeepURLFragmentsGlobal',
      },
      {
        name: 'setGlobalExcludedQueryParameters',
        value: 'setGlobalExcludedQueryParameters',
      },
      {
        name: 'getExcludedIpsGlobal',
        value: 'getExcludedIpsGlobal',
      },
      {
        name: 'getDefaultCurrency',
        value: 'getDefaultCurrency',
      },
      {
        name: 'setDefaultCurrency',
        value: 'setDefaultCurrency',
      },
      {
        name: 'getDefaultTimezone',
        value: 'getDefaultTimezone',
      },
      {
        name: 'setDefaultTimezone',
        value: 'setDefaultTimezone',
      },
      {
        name: 'updateSite',
        value: 'updateSite',
      },
      {
        name: 'getCurrencyList',
        value: 'getCurrencyList',
      },
      {
        name: 'getCurrencySymbols',
        value: 'getCurrencySymbols',
      },
      {
        name: 'isTimezoneSupportEnabled',
        value: 'isTimezoneSupportEnabled',
      },
      {
        name: 'getTimezonesList',
        value: 'getTimezonesList',
      },
      {
        name: 'getTimezoneName',
        value: 'getTimezoneName',
      },
      {
        name: 'getUniqueSiteTimezones',
        value: 'getUniqueSiteTimezones',
      },
      {
        name: 'renameGroup',
        value: 'renameGroup',
      },
      {
        name: 'getPatternMatchSites',
        value: 'getPatternMatchSites',
      },
      {
        name: 'getNumWebsitesToDisplayPerPage',
        value: 'getNumWebsitesToDisplayPerPage',
      },
    ];
  }

  getModuleTagManager() {
    return [
      {
        name: 'getAvailableContexts',
        value: 'getAvailableContexts',
      },
      {
        name: 'getAvailableEnvironment',
        value: 'getAvailableEnvironment',
      },
      {
        name: 'getAvailableEnvironmentsWithPublishCapability',
        value: 'getAvailableEnvironmentsWithPublishCapability',
      },
      {
        name: 'getAvailableTagFireLimits',
        value: 'getAvailableTagFireLimits',
      },
      {
        name: 'getAvailableComparisons',
        value: 'getAvailableComparisons',
      },
      {
        name: 'getAvailableTagTypesInContext',
        value: 'getAvailableTagTypesInContext',
      },
      {
        name: 'getAvailableTriggerTypesInContext',
        value: 'getAvailableTriggerTypesInContext',
      },
      {
        name: 'getAvailableVariableTypesInContext',
        value: 'getAvailableVariableTypesInContext',
      },
      {
        name: 'getContainerEmbedCode',
        value: 'getContainerEmbedCode',
      },
      {
        name: 'getContainerInstallInstructions',
        value: 'getContainerInstallInstructions',
      },
      {
        name: 'getContainerTags',
        value: 'getContainerTags',
      },
      {
        name: 'createDefaultContainerForSite',
        value: 'createDefaultContainerForSite',
      },
      {
        name: 'addContainerTag',
        value: 'addContainerTag',
      },
      {
        name: 'updateContainerTag',
        value: 'updateContainerTag',
      },
      {
        name: 'deleteContainerTag',
        value: 'deleteContainerTag',
      },
      {
        name: 'getContainerTag',
        value: 'getContainerTag',
      },
      {
        name: 'getContainerTriggerReferences',
        value: 'getContainerTriggerReferences',
      },
      {
        name: 'getContainerTriggers',
        value: 'getContainerTriggers',
      },
      {
        name: 'addContainerTrigger',
        value: 'addContainerTrigger',
      },
      {
        name: 'updateContainerTrigger',
        value: 'updateContainerTrigger',
      },
      {
        name: 'deleteContainerTrigger',
        value: 'deleteContainerTrigger',
      },
      {
        name: 'getContainerTrigger',
        value: 'getContainerTrigger',
      },
      {
        name: 'getContainerVariableReferences',
        value: 'getContainerVariableReferences',
      },
      {
        name: 'getContainerVariables',
        value: 'getContainerVariables',
      },
      {
        name: 'getAvailableContainerVariables',
        value: 'getAvailableContainerVariables',
      },
      {
        name: 'addContainerVariable',
        value: 'addContainerVariable',
      },
      {
        name: 'updateContainerVariable',
        value: 'updateContainerVariable',
      },
      {
        name: 'deleteContainerVariable',
        value: 'deleteContainerVariable',
      },
      {
        name: 'getContainerVariable',
        value: 'getContainerVariable',
      },
      {
        name: 'getContainers',
        value: 'getContainers',
      },
      {
        name: 'addContainer',
        value: 'addContainer',
      },
      {
        name: 'updateContainer',
        value: 'updateContainer',
      },
      {
        name: 'createContainerVersion',
        value: 'createContainerVersion',
      },
      {
        name: 'updateContainerVersion',
        value: 'updateContainerVersion',
      },
      {
        name: 'getContainerVersions',
        value: 'getContainerVersions',
      },
      {
        name: 'getContainerVersion',
        value: 'getContainerVersion',
      },
      {
        name: 'deleteContainerVersion',
        value: 'deleteContainerVersion',
      },
      {
        name: 'publishContainerVersion',
        value: 'publishContainerVersion',
      },
      {
        name: 'deleteContainer',
        value: 'deleteContainer',
      },
      {
        name: 'getContainer',
        value: 'getContainer',
      },
      {
        name: 'enablePreviewMode',
        value: 'enablePreviewMode',
      },
      {
        name: 'disablePreviewMode',
        value: 'disablePreviewMode',
      },
      {
        name: 'changeDebugUrl',
        value: 'changeDebugUrl',
      },
      {
        name: 'exportContainerVersion',
        value: 'exportContainerVersion',
      },
      {
        name: 'importContainerVersion',
        value: 'importContainerVersion',
      },
    ];
  }

  getModuleTour() {
    return [
      {
        name: 'getChallenge',
        value: 'getChallenge',
      },
      {
        name: 'skipChallenge',
        value: 'skipChallenge',
      },
      {
        name: 'getLevel',
        value: 'getLevel',
      },
    ];
  }
  getModuleTransitions() {
    return [
      {
        name: 'getTransitionsForPageTitle',
        value: 'getTransitionsForPageTitle',
      },
      {
        name: 'getTransitionsForPageUrl',
        value: 'getTransitionsForPageUrl',
      },
      {
        name: 'getTransitionsForAction',
        value: 'getTransitionsForAction',
      },
      {
        name: 'getTranslations',
        value: 'getTranslations',
      },
      {
        name: 'isPeriodAllowed',
        value: 'isPeriodAllowed',
      },
    ];
  }

  getModuleTreemapVisualization() {
    return [
      {
        name: 'getTreemapData',
        value: 'getTreemapData',
      },
    ];
  }

  getModuleTwoFactorAuth() {
    return [
      {
        name: 'resetTwoFactorAuth',
        value: 'resetTwoFactorAuth',
      },
    ];
  }

  getModuleUserCountry() {
    return [
      {
        name: 'getCountry',
        value: 'getCountry',
      },
      {
        name: 'getContinent',
        value: 'getContinent',
      },
      {
        name: 'getRegion',
        value: 'getRegion',
      },
      {
        name: 'getCity',
        value: 'getCity',
      },
      {
        name: 'getCountryCodeMapping',
        value: 'getCountryCodeMapping',
      },
      {
        name: 'getLocationFromIP',
        value: 'getLocationFromIP',
      },
      {
        name: 'setLocationProvider',
        value: 'setLocationProvider',
      },
      {
        name: 'getNumberOfDistinctCountries',
        value: 'getNumberOfDistinctCountries',
      },
    ];
  }

  getModuleUserId() {
    return [
      {
        name: 'getUsers',
        value: 'getUsers',
      },
    ];
  }

  getModuleUserLanguage() {
    return [
      {
        name: 'getLanguage ',
        value: 'getLanguage ',
      },
      {
        name: 'getLanguageCode',
        value: 'getLanguageCode',
      },
    ];
  }

  getModuleUsersManager() {
    return [
      {
        name: 'getAvailableRoles',
        value: 'getAvailableRoles',
      },
      {
        name: 'getAvailableCapabilities',
        value: 'getAvailableCapabilities',
      },
      {
        name: 'setUserPreference',
        value: 'setUserPreference',
      },
      {
        name: 'getUserPreference',
        value: 'getUserPreference',
      },
      {
        name: 'getUsersPlusRole',
        value: 'getUsersPlusRole',
      },
      {
        name: 'getUsers',
        value: 'getUsers',
      },
      {
        name: 'getUsersLogin',
        value: 'getUsersLogin',
      },
      {
        name: 'getUsersSitesFromAccess',
        value: 'getUsersSitesFromAccess',
      },
      {
        name: 'getUsersAccessFromSite',
        value: 'getUsersAccessFromSite',
      },
      {
        name: 'getUsersWithSiteAccess',
        value: 'getUsersWithSiteAccess',
      },
      {
        name: 'getSitesAccessFromUser',
        value: 'getSitesAccessFromUser',
      },
      {
        name: 'getSitesAccessForUser',
        value: 'getSitesAccessForUser',
      },
      {
        name: 'getUser',
        value: 'getUser',
      },
      {
        name: 'getUserByEmail',
        value: 'getUserByEmail',
      },
      {
        name: 'addUser',
        value: 'addUser',
      },
      {
        name: 'setSuperUserAccess',
        value: 'setSuperUserAccess',
      },
      {
        name: 'hasSuperUserAccess',
        value: 'hasSuperUserAccess',
      },
      {
        name: 'getUsersHavingSuperUserAccess',
        value: 'getUsersHavingSuperUserAccess',
      },
      {
        name: 'updateUser',
        value: 'updateUser',
      },
      {
        name: 'deleteUser',
        value: 'deleteUser',
      },
      {
        name: 'userExists',
        value: 'userExists',
      },
      {
        name: 'userEmailExists',
        value: 'userEmailExists',
      },
      {
        name: 'getUserLoginFromUserEmail',
        value: 'getUserLoginFromUserEmail',
      },
      {
        name: 'setUserAccess',
        value: 'setUserAccess',
      },
      {
        name: 'addCapabilities',
        value: 'addCapabilities',
      },
      {
        name: 'removeCapabilities',
        value: 'removeCapabilities',
      },
      {
        name: 'createAppSpecificTokenAuth',
        value: 'createAppSpecificTokenAuth',
      },
      {
        name: 'newsletterSignup',
        value: 'newsletterSignup',
      },
    ];
  }

  getModuleVisitFrequency() {
    return [
      {
        name: 'get',
        value: 'get',
      },
    ];
  }

  getModuleVisitTime() {
    return [
      {
        name: 'getVisitInformationPerLocalTime',
        value: 'getVisitInformationPerLocalTime',
      },
      {
        name: 'getVisitInformationPerServerTime',
        value: 'getVisitInformationPerServerTime',
      },
      {
        name: 'getByDayOfWeek',
        value: 'getByDayOfWeek',
      },
    ];
  }

  getModuleVisitorInterest() {
    return [
      {
        name: 'getNumberOfVisitsPerVisitDuration',
        value: 'getNumberOfVisitsPerVisitDuration',
      },
      {
        name: 'getNumberOfVisitsPerPage',
        value: 'getNumberOfVisitsPerPage',
      },
      {
        name: 'getNumberOfVisitsByDaysSinceLast',
        value: 'getNumberOfVisitsByDaysSinceLast',
      },
      {
        name: 'getNumberOfVisitsByVisitCount',
        value: 'getNumberOfVisitsByVisitCount',
      },
    ];
  }

  getModuleVisitsSummary() {
    return [
      {
        name: 'get',
        value: 'get',
      },
      {
        name: 'getVisits',
        value: 'getVisits',
      },
      {
        name: 'getUniqueVisitors',
        value: 'getUniqueVisitors',
      },
      {
        name: 'getUsers',
        value: 'getUsers',
      },
      {
        name: 'getActions',
        value: 'getActions',
      },
      {
        name: 'getMaxActions',
        value: 'getMaxActions',
      },
      {
        name: 'getBounceCount',
        value: 'getBounceCount',
      },
      {
        name: 'getVisitsConverted',
        value: 'getVisitsConverted',
      },
      {
        name: 'getSumVisitsLength',
        value: 'getSumVisitsLength',
      },
      {
        name: 'getSumVisitsLengthPretty',
        value: 'getSumVisitsLengthPretty',
      },
    ];
  }
}
