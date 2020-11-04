import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {faSearch} from "@fortawesome/free-solid-svg-icons/index";
import PropTypes from "prop-types";
import {connectHits} from 'react-instantsearch-dom';
import {Link} from "react-router-dom";
import AwesomeDebouncePromise from 'awesome-debounce-promise/dist/index';
import _ from "lodash";
import {connect} from 'react-redux';
// import $ from "jquery";

class SearchBox extends Component {

    // Query & Category
    state = {
        query: "",
    };
    // Search function
    searchAPI = (text, refine) => {
        refine(text);
        // console.log(text)
    };

    static propTypes = {
        categories: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })).isRequired,
        currentRefinement: PropTypes.string.isRequired,
        refine: PropTypes.func.isRequired,
        isSearchStalled: PropTypes.bool.isRequired,
    };


    // Searc debounced
    searchAPIDebounced = AwesomeDebouncePromise(this.searchAPI, 500);

    // Query Update
    handleQueryUpdate = async (e, refine) => {
        // console.log(e.target.value);
        const value = e.target.value;
        this.setState({
            query: value.trimStart()
        });

        this.searchAPIDebounced(value, refine);

    };

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        // console.log("Right");
    }


    render() {
        const {currentRefinement, refine, isSearchStalled} = this.props;
        const {query} = this.state;

        const CustomHits = connectHits(({hits}) => {
                // console.log(hits);
                return (
                    isSearchStalled ?
                        <div className="spinner-grow text-secondary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        : (
                            hits.length === 0 ? <div className="disabled">Aucun résultat trouvé</div>
                                : (
                                    <React.Fragment>
                                        {/*Five results only */}
                                        {_.map(_.slice(hits, 0, 5), (hit, index) => {
                                                return (
                                                    <Link className={"s-click"} key={hit.objectID} to={`/p/${hit.slug}`}
                                                          onClick={e => this.setState({query: ""})}
                                                    >
                                                        <div className="row hover-bg">
                                                            <div className="col-2">
                                                                {/*FIXME : Change the image url*/}
                                                                <img src={`${hit.image1_url}`} alt="search-item"
                                                                     style={{height: "40px"}}
                                                                />
                                                            </div>
                                                            <div className="col-10 text-left">
                                                                <div className="text-dark"><b>{hit.name}</b></div>
                                                                <div className="text-secondary">
                                                                    <small>dans {hit.category}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {index === hits.length - 1 ? null : <hr className="dropdown-divider"/>}
                                                    </Link>
                                                )
                                            }
                                        )}

                                        <Link className={"s-click"} to={`/search?q=${currentRefinement}`}
                                              onClick={e => this.setState({query: ""})}>
                                            <div className="row hover-bg">
                                                <div className="col-12 text-center">
                                                    <div className="text-dark"><b>Voir tous les résultats</b></div>
                                                </div>
                                            </div>
                                        </Link>
                                    </React.Fragment>
                                )
                        )
                )
            }
        );

        return (
            <React.Fragment>
                <div className="input-group mb-3">
                    <input
                        type="search"
                        className="form-control"
                        aria-label="Text input with dropdown button"
                        placeholder="Que recherchez vous ?"
                        value={query}
                        onChange={(event => {
                            this.handleQueryUpdate(event, refine)
                        })}
                    />

                    <div
                        className={`dropdown-menu ${query.length === 0 ? "" : "show"} search-dropdown p-3`}>
                        {currentRefinement.length > 0 ? <CustomHits/> : null}
                    </div>

                    <div className="input-group-append">
                        <button
                            className={`btn btn-danger`}
                            style={{
                                border: "2px solid #fff",
                                padding: "2px 1rem"
                            }}
                            onClick={event => event.preventDefault()}
                        >
                            <FontAwesomeIcon icon={faSearch}/>
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        categories: state.categories,
        currentRefinement: ownProps.currentRefinement,
        refine: ownProps.refine,
        isSearchStalled: ownProps.isSearchStalled
    }
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
