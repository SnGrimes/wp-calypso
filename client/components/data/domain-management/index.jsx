/** @format */
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import StoreConnection from 'components/data/store-connection';
import DomainsStore from 'lib/domains/store';
import CartStore from 'lib/cart/store';
import observe from 'lib/mixins/data-observe';
import { fetchDomains } from 'lib/upgrades/actions';
import QuerySitePlans from 'components/data/query-site-plans';
import QueryContactDetailsCache from 'components/data/query-contact-details-cache';
import { getPlansBySite } from 'state/sites/plans/selectors';
import { getSelectedSite } from 'state/ui/selectors';
import PageViewTracker from 'lib/analytics/page-view-tracker';

const stores = [ DomainsStore, CartStore ];

function getStateFromStores( props ) {
	return {
		cart: CartStore.get(),
		context: props.context,
		domains: props.selectedSite ? DomainsStore.getBySite( props.selectedSite.ID ) : null,
		products: props.products,
		selectedDomainName: props.selectedDomainName,
		selectedSite: props.selectedSite,
		sitePlans: props.sitePlans,
	};
}

const DomainManagementData = createReactClass( {
	displayName: 'DomainManagementData',

	propTypes: {
		analyticsPath: PropTypes.string,
		analyticsTitle: PropTypes.string,
		context: PropTypes.object.isRequired,
		productsList: PropTypes.object.isRequired,
		selectedDomainName: PropTypes.string,
		selectedSite: PropTypes.object,
		sitePlans: PropTypes.object.isRequired,
	},

	mixins: [ observe( 'productsList' ) ],

	componentWillMount: function() {
		const { selectedSite } = this.props;

		if ( selectedSite ) {
			fetchDomains( selectedSite.ID );
		}
	},

	componentWillUpdate: function( nextProps ) {
		const { selectedSite: prevSite } = this.props;
		const { selectedSite: nextSite } = nextProps;

		if ( nextSite && nextSite !== prevSite ) {
			fetchDomains( nextSite.ID );
		}
	},

	render: function() {
		return (
			<div>
				<PageViewTracker path={ this.props.analyticsPath } title={ this.props.analyticsTitle } />
				<StoreConnection
					component={ this.props.component }
					stores={ stores }
					getStateFromStores={ getStateFromStores }
					products={ this.props.productsList.get() }
					selectedDomainName={ this.props.selectedDomainName }
					selectedSite={ this.props.selectedSite }
					sitePlans={ this.props.sitePlans }
					context={ this.props.context }
				/>
				{ this.props.selectedSite && <QuerySitePlans siteId={ this.props.selectedSite.ID } /> && (
						<QueryContactDetailsCache />
					) }
			</div>
		);
	},
} );

const mapStateToProps = state => {
	const selectedSite = getSelectedSite( state );

	return {
		sitePlans: getPlansBySite( state, selectedSite ),
		selectedSite,
	};
};

export default connect( mapStateToProps )( DomainManagementData );
