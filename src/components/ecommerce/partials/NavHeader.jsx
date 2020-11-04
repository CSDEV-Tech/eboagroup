import React, {Component} from "react";
import {Link} from "react-router-dom";
import logo from "../../../PNG LOGO BLANC.png";
import SearchBox from "../SearchBox";
import {connectSearchBox, InstantSearch} from "react-instantsearch-dom"
import {connect} from 'react-redux';
import PropTypes from "prop-types";

class NavHeader extends Component {

    render() {
        const {client, index} = this.props;

        const CustomSearch = connectSearchBox(({currentRefinement, isSearchStalled, refine}) => (
            <SearchBox
                currentRefinement={currentRefinement}
                isSearchStalled={isSearchStalled}
                refine={refine}
            />
        ));

        return (
            <div className="row text-center container-fluid mb-md-0 mb-sm-1 pt-2" id={"top"}>
                {/*Logo*/}
                <div className="col-md-2">
                    <Link to="/" >
                        <img
                            src={logo}
                            className="img-fluid mb-3"
                            style={{height: "60px", width: "60px" }}
                            alt="logo"
                        />
                    </Link>
                </div>

                {/*SearchBox*/}
                <div className="col-md-9 mt-md-3">
                    <InstantSearch indexName={index}
                                   searchClient={client}>
                        <CustomSearch/>
                    </InstantSearch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        client: state.searchClient,
        index: state.searchIndex
    }
};

export default connect(mapStateToProps)(NavHeader);

NavHeader.propTypes = {
  client: PropTypes.object.isRequired,
  index: PropTypes.string.isRequired
};
