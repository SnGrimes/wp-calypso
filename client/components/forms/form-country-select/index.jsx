/** @format */

/**
 * External dependencies
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isEmpty, omit } from 'lodash';
import { localize } from 'i18n-calypso';

export class FormCountrySelect extends Component {
	static propTypes = {
		countriesList: PropTypes.array.isRequired,
		className: PropTypes.string,
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
		translate: PropTypes.func.isRequired,
	};

	getOptions() {
		const { countriesList, translate } = this.props;

		if ( isEmpty( countriesList ) ) {
			return [
				{
					key: '',
					label: translate( 'Loading…' ),
					disabled: false,
				},
			];
		}

		return countriesList.map( ( { code, name }, idx ) => ( {
			key: idx,
			label: name,
			code,
			disabled: !code,
		} ) );
	}

	render() {
		const options = this.getOptions();

		return (
			<select
				{ ...omit( this.props, [
					'className',
					'countriesList',
					'translate',
					'moment',
					'numberFormat',
				] ) }
				className={ classnames( this.props.className, 'form-country-select' ) }
				onChange={ this.props.onChange }
				disabled={ this.props.disabled }
			>
				{ options.map( function( option ) {
					return (
						<option key={ option.key } value={ option.code } disabled={ option.disabled }>
							{ option.label }
						</option>
					);
				} ) }
			</select>
		);
	}
}

export default localize( FormCountrySelect );
