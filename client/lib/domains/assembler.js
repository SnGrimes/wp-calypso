/** @format */

/**
 * External dependencies
 */

import { camelCase, find, mapKeys, without } from 'lodash';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { getDomainType, getTransferStatus, getGdprConsentStatus } from './utils';

export function createDomainObjects( dataTransferObject ) {
	let domains = [];

	if ( ! Array.isArray( dataTransferObject ) ) {
		return domains;
	}

	domains = dataTransferObject.map( domain => {
		return {
			autoRenewalMoment: domain.auto_renewal_date && i18n.moment( domain.auto_renewal_date ),
			adminEmail: domain.admin_email,
			currentUserCanManage: domain.current_user_can_manage,
			canSetAsPrimary: domain.can_set_as_primary,
			domainLockingAvailable: domain.domain_locking_available,
			expirationMoment: domain.expiry && i18n.moment( domain.expiry ),
			expired: domain.expired,
			expirySoon: domain.expiry_soon,
			gdprConsentStatus: getGdprConsentStatus( domain ),
			googleAppsSubscription: assembleGoogleAppsSubscription( domain.google_apps_subscription ),
			hasPrivacyProtection: domain.has_private_registration,
			hasWpcomNameservers: domain.has_wpcom_nameservers,
			hasZone: domain.has_zone,
			isAutoRenewing: domain.auto_renewing,
			isPendingIcannVerification: domain.is_pending_icann_verification,
			isPrimary: domain.primary_domain,
			isPendingWhoisUpdate: domain.pending_whois_update,
			manualTransferRequired: domain.manual_transfer_required,
			name: domain.domain,
			owner: domain.owner,
			privacyAvailable: domain.privacy_available,
			privateDomain: domain.private_domain,
			pendingTransfer: domain.pending_transfer,
			pointsToWpcom: domain.points_to_wpcom,
			registrar: domain.registrar,
			registrationMoment: domain.registration_date && i18n.moment( domain.registration_date ),
			subscriptionId: domain.subscription_id,
			tldMaintenanceEndTime: domain.tld_maintenance_end_time,
			transferLockOnWhoisUpdateOptional: domain.transfer_lock_on_whois_update_optional,
			type: getDomainType( domain ),
			transferStatus: getTransferStatus( domain ),
			whoisUpdateUnmodifiableFields: domain.whois_update_unmodifiable_fields,
		};
	} );

	return ensurePrimaryDomainIsFirst( domains );
}

export function assembleGoogleAppsSubscription( googleAppsSubscription ) {
	if ( ! googleAppsSubscription ) {
		return;
	}

	return mapKeys( googleAppsSubscription, ( value, key ) => camelCase( key ) );
}

function ensurePrimaryDomainIsFirst( domains ) {
	const primaryDomain = find( domains, { isPrimary: true } );

	if ( ! primaryDomain ) {
		return domains;
	}

	return [ primaryDomain ].concat( without( domains, primaryDomain ) );
}
