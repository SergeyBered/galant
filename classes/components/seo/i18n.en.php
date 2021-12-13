<?php

	/** Языковые константы для английской версии */
	$i18n = [
		'perms-seo-seo' => 'SEO functions',
		'perms-seo-guest' => 'Guest permissions',
		'perms-seo-config' => 'Permissions for working with settings',
		'perms-seo-delete' => 'Permissions for deleting site from Yandex.WebMaster',
		'header-seo-config' => 'Settings',
		'header-seo-getBrokenLinks' => 'Broken links',
		'header-seo-emptyMetaTags' => 'Empty meta tags',
		'header-seo-getSiteInfo' => 'Site information from Yandex.WebMaster',
		'header-seo-sitemap' => 'Site map',
		'header-seo-robots' => 'robots.txt',
		'label-seo-domain' => 'Domains',
		'label-seo-empty-meta-tags-settings' => 'Empty meta tags settings',
		'option-seo-title' => 'TITLE prefix',
		'option-seo-default-title' => 'TITLE (default)',
		'option-seo-keywords' => 'Keywords (default)',
		'option-seo-description' => 'Description (default)',
		'option-seo-is-case-sensitive' => 'Case sensitive URL',
		'option-seo-case-sensitive-status' => 'Way of processing сase sensitive URL',
		'option-seo-is-process-slashes' => 'Process repeated slashes (/) in URL',
		'option-seo-process-slashes-status' => 'Way of processing repeated slashes in URL',
		'option-seo-add-id-to-alt-name' => 'Add page id in repeated pages alt-name',
		'option-delete-slashes-and-redirect' => 'Delete repeated slashes and redirect to page',
		'option-redirect-to-not-found-page' => 'Open 404 page',
		'option-redirect-to-similar-url' => 'Redirect on similar existing URL',
		'option-seo-empty-h1' => 'Allow h1 field',
		'option-seo-empty-title' => 'Allow title field',
		'option-seo-empty-description' => 'Allow description field',
		'option-seo-empty-keywords' => 'Allow keywords field',
		'header-seo-domains' => 'Domains settings',
		'seo-site-settings' => 'Settings for site',
		'label-repeat' => 'Repeat',
		'label-price' => 'Price',
		'error-authorization-failed' => 'Invalid login or password',
		'error' => 'Error: ',
		'error-data' => 'Error: Invalid data',
		'header-seo-webmaster' => 'Yandex.Webmaster',
		'header-seo-yandex' => 'Yandex.Webmaster settings',
		'footer-webmaster-text' => 'Based on ',
		'footer-webmaster-link' => 'Yandex.Webmaster',
		'link-code' => 'Get code',
		'label-link-address' => 'Link address',
		'label-page-address' => 'Page address',
		'js-label-view-button' => 'View sources',
		'label-error-links-not-found' => 'Sources of this link is not found, please contact Care Service for help.',
		'js-label-place-type-template' => 'In template: ',
		'js-label-place-type-object' => 'In object: ',
		'js-label-header-sources' => 'Broken link was found in:',
		'js-label-title-sources' => 'Bad link sources',
		'js-confirm' => 'Ok',
		'label-button-find-bad-links' => 'Find bad links',
		'label-info-DesignTemplates' => 'Looking for links in the design templates...',
		'label-info-ObjectsFields' => 'Looking for links in the object text properties...',
		'label-info-ObjectsNames' => 'Looking for links in the object names...',
		'label-info-SitesUrls' => 'Looking for links in the site pages...',
		'label-info-linksChecker' => 'Checking links...',
		'js-label-step-linksChecker' => 'check',
		'js-label-step-linksGrabber' => 'index',
		'js-label-bad-links-search-complete' => 'Search complete',
		'js-label-close' => 'Close',
		'js-label-interrupt' => 'Interrupt',
		'js-label-bad-links-search' => 'Bad links search',
		'js-label-bad-links-search-start-message' => 'Bad links search starts',
		'js-error-label-unknown-search-step-name' => 'Unknown search step',
		'label-error-seo-admin-not-implemented' => 'We could not use the administrative functionality of the "SEO" module',
		'label-error-yandex-create-verify-file' => 'Could not create verification file',
		'label-error-yandex-wrong-code' => 'Incorrect validation code',
		'label-error-yandex-web-master-invalid-token' => 'Service "Yandex.Webmaster" declined your token. Please check the validity of the <a href="%s/admin/seo/yandex/">token</a>.',
		'label-yandex-site-name' => 'Name',
		'label-yandex-site-address' => 'Address',
		'label-yandex-site-index-state' => 'Indexation',
		'label-yandex-site-verify-state' => 'Verification',
		'label-yandex-site-sqi' => 'Site quality index',
		'label-yandex-site-map-added' => 'Site map added',
		'label-yandex-site-excluded-count' => 'Excluded pages count',
		'label-yandex-site-searchable-count' => 'Searchable pages count',
		'label-yandex-site-problems-count' => 'Errors count',
		'js-label-yandex-button-view' => 'View details',
		'js-label-yandex-button-add' => 'Add site to Yandex.WebMaster',
		'js-label-yandex-button-verify' => 'Verify rights',
		'js-label-yandex-button-add_site_map' => 'Add site map to Yandex.WebMaster',
		'js-label-yandex-button-delete' => 'Delete site from Yandex.WebMaster',
		'js-label-yandex-button-refresh' => 'Refresh data',
		'label-yandex-site-status-NOT_ADDED' => 'No added to Yandex.WebMaster',
		'label-yandex-site-status-UNDEFINED' => 'Status not defined',
		'label-yandex-site-status-NOT_INDEXED' => 'Not indexed',
		'label-yandex-site-status-NOT_LOADED' => 'Not loaded',
		'label-yandex-site-status-OK' => 'Indexed and loaded',
		'label-yandex-site-option-null-value' => 'Unknown',
		'label-yandex-verify-status-NONE' => 'No confirmation was sent',
		'label-yandex-verify-status-VERIFIED' => 'Rights confirmed',
		'label-yandex-verify-status-IN_PROGRESS' => 'Verification of rights',
		'label-yandex-verify-status-VERIFICATION_FAILED' => 'Rights not confirmed',
		'label-yandex-verify-status-INTERNAL_ERROR' => 'An error has occurred',
		'label-yandex-external-links' => 'External links',
		'label-yandex-top-popular-queries' => 'Top search queries per week',
		'label-yandex-indexation-history' => 'History of indexing for 2 month',
		'label-yandex-top-popular-queries-shows' => 'Top 5 queries by shows',
		'label-yandex-top-popular-queries-clicks' => 'Top 5 queries by clicks',
		'label-yandex-all' => 'All',
		'label-yandex-downloaded-pages-history' => 'Changing the number of pages loaded',
		'label-yandex-downloaded-with-code-2xx' => 'Code 2XX',
		'label-yandex-downloaded-with-code-3xx' => 'Code 3XX',
		'label-yandex-downloaded-with-code-4xx' => 'Code 4XX',
		'label-yandex-downloaded-with-code-5xx' => 'Code 5XX',
		'label-yandex-sqi-history' => 'Changing the site\'s SQI',
		'label-yandex-external-links-count-history' => 'Change the number of external links to the site',
		'label-yandex-destination-url' => 'Link',
		'label-yandex-source-url' => 'Address of the link page',
		'label-yandex-discovery-date' => 'Date of discovery',
		'label-yandex-source-last-access-date' => 'Date of last access',
		'js-label-button-refresh-sitemap' => 'Update sitemap.xml',
		'js-label-button-refresh-sitemap-images' => 'Update sitemap-images.xml',
		'js-label-button-edit-robots' => 'Edit robots.txt',
		'js-label-robots-txt-title' => 'Additional entries in robots.txt',
		'js-label-save-robots-txt' => 'Save',
		'label-error-wrong-domain' => 'Wrong domain',
		'js-updating-sitemap' => 'Updating is in progress...',
		'js-update-sitemap' => 'Update sitemap.xml',
		'js-update-sitemap-images' => 'Update sitemap-images.xml',
		'js-update-sitemap-submit' => 'Do you want to update sitemap.xml now?',
		'js-update-sitemap-images-submit' => 'Do you want to update sitemap-images.xml now?',
		'js-sitemap-updating-complete' => 'Updating complete',
	];