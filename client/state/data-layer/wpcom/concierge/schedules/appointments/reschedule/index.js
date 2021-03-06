/** @format */

/**
 * Internal dependencies
 */
import { http } from 'state/data-layer/wpcom-http/actions';
import { dispatchRequestEx } from 'state/data-layer/wpcom-http/utils';
import { updateConciergeBookingStatus } from 'state/concierge/actions';
import { CONCIERGE_APPOINTMENT_RESCHEDULE } from 'state/action-types';
import { CONCIERGE_STATUS_BOOKING } from 'me/concierge/constants';
import fromApi from '../book/from-api';
import { onSuccess, onError } from '../book';
import toApi from './to-api';

export const rescheduleConciergeAppointment = action => {
	return [
		updateConciergeBookingStatus( CONCIERGE_STATUS_BOOKING ),
		http(
			{
				method: 'POST',
				path: `/concierge/schedules/${ action.scheduleId }/appointments/${
					action.appointmentId
				}/reschedule`,
				apiNamespace: 'wpcom/v2',
				body: toApi( action ),
			},
			action
		),
	];
};

export default {
	[ CONCIERGE_APPOINTMENT_RESCHEDULE ]: [
		dispatchRequestEx( { fetch: rescheduleConciergeAppointment, onSuccess, onError, fromApi } ),
	],
};
