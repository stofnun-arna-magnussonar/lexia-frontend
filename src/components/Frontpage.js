import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import OrdVikunnar from './OrdVikunnar';
import PageView from './PageView';

class Frontpage extends Component {
	render() {
		return (
			<React.Fragment>

				<div className="row front">
					<div className="col-md-9">

						<PageView url={this.props.location.pathname} />

					</div>

					<div className="col-md-3">
						<OrdVikunnar />
					</div>

				</div>

			</React.Fragment>
		);
	}
}

export default withRouter(Frontpage);
