import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import _ from "lodash";
import {Typeahead} from "react-bootstrap-typeahead";
import {search} from "../../../actions";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.min.css";
import queryString from "query-string";

class SearchFilters extends Component {
    state = {
        selected_tags: [],
        selected_category: null,
        filters: [],
        query: ""
    };

    static propTypes = {
        tags: PropTypes.arrayOf(PropTypes.object).isRequired,
        categories: PropTypes.arrayOf(PropTypes.object).isRequired,
        history: PropTypes.object.isRequired,
        isLoading: PropTypes.bool,
        linkPrefix: PropTypes.string,
    };

    constructUrl = (category, tags = [], filters = [], query = "", page = 1) => {
        let url = `q=${window.encodeURI(query)}`;

        if (category) {
            url = `${url}&c=${category.slug}`;
        }

        for (let i = 0; i < tags.length; i++) {
            url = `${url}&tags[]=${window.encodeURI(tags[i])}`;
        }

        for (let i = 0; i < filters.length; i++) {
            url = `${url}&filters[]=${window.encodeURI(filters[i])}`;
        }

        if (!isNaN(Number.parseInt(page))) {
            url = `${url}&p=${page}`;
        }

        return url;
    };

    handleChanged = (name, value) => {
        const {categories, history, linkPrefix} = this.props;

        let {selected_category, selected_tags, filters, query} = this.state;

        switch (name) {
            case "tags":
                selected_tags = [...value];
                this.setState({selected_tags});
                break;
            case "category":
                selected_category = _.find(categories, cat => cat.name === value);
                filters = [];
                this.setState({selected_category, filters});
                break;
            case "filters":
                filters = value;
                // console.log(value);
                this.setState({filters});
                break;
            case "query":
                query = value;
                this.setState({query: value});
                break;
            default:
                break;
        }

        // Construct Url
        const url = this.constructUrl(
            selected_category,
            selected_tags,
            filters,
            query
        );

        // go to search
        history.push(`${linkPrefix}/search?${url}`);
    };

    handleSubmit = e => {
        e.preventDefault();
        const {history, linkPrefix} = this.props;
        let {selected_category, selected_tags, filters, query} = this.state;
        const url = this.constructUrl(
            selected_category,
            selected_tags,
            filters,
            query
        );

        // go to search
        history.push(`${linkPrefix}/search?${url}`);
    };

    setParams = (params, categories) => {
        // query
        const query = params.q ? params.q : "";

        // category
        const category_slug = params.c ? params.c : "";

        let selected_tags = params["tags[]"] ? params["tags[]"] : [];
        let filters = params["filters[]"] ? params["filters[]"] : [];

        if (!_.isArray(selected_tags)) {
            selected_tags = [selected_tags];
        }

        if (!_.isArray(filters)) {
            filters = [filters];
        }

        console.log("PARAMS ==> ", params);
        let selected_category = _.find(categories, c => c.slug === category_slug);

        // set category and query
        this.setState({
            query,
            selected_tags,
            filters,
            selected_category
        });
    };

    componentWillMount() {
        const {categories} = this.props;
        // alert("Will !!");
        const params = queryString.parse(window.location.search);

        this.setParams(params, categories);
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        const {categories} = nextProps;
        const params = queryString.parse(window.location.search);

        this.setParams(params, categories);
    }

    render() {
        const {tags, categories} = this.props;
        let {selected_tags, selected_category, filters} = this.state;

        let option_names = [];
        let option_category = [];

        if (selected_category) {
            option_names = selected_category.categoryfilter_set;
            option_category = [selected_category.name];
        }

        if(option_names === undefined || option_names === null) {
            option_names = [];
        }

        // Options to display
        let option_tags = tags ? _.map(tags, tag => tag.tag) : [];
        let option_categories = categories ? _.map(categories, category => category.name) : [];

        // console.log(option_category, option_categories);

        return (
            <>
                <form onSubmit={this.handleSubmit}>
                    {/* QUERY */}
                    <div id="category">
                        <h5 className="card-title text-uppercase">Que recherchez vous ?</h5>
                        <div
                            className=""
                            style={{
                                overflowY: "show",
                                maxHeight: "500px"
                            }}
                        >
                            <div
                                style={{
                                    marginBottom: "1rem"
                                }}
                            >
                                <input
                                    className={"form-control"}
                                    value={this.state.query}
                                    onChange={e => this.handleChanged("query", e.target.value)}
                                    placeholder="Saisissez quelque chose..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* BY CATEGORY */}
                    <div id="category">
                        <h5 className="card-title text-uppercase">Catégorie</h5>
                        <div
                            className=""
                            style={{
                                overflowY: "show",
                                maxHeight: "500px"
                            }}
                        >
                            <div
                                style={{
                                    marginBottom: "1rem"
                                }}
                            >
                                <Typeahead
                                    id={"categories"}
                                    labelKey="name"
                                    defaultSelected={option_category}
                                    options={option_categories}
                                    onChange={value => this.handleChanged("category", value[0])}
                                    placeholder="Choisissez une catégorie"
                                />
                            </div>

                            {option_names.length > 0 && <h6>Filtres de la catégorie</h6>}
                            {_.map(option_names, option => (
                                <label
                                    className="custom-control custom-checkbox"
                                    key={option.id}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.includes(option.name)}
                                        className="custom-control-input"
                                        onChange={e => {
                                            if (e.target.checked) {
                                                filters = [...filters, option.name];
                                            } else {
                                                filters = _.filter(
                                                    filters,
                                                    filter => filter !== option.name
                                                );
                                            }
                                            // console.log(filters);
                                            this.handleChanged("filters", [...filters]);
                                        }}
                                    />
                                    <div className="custom-control-label">{option.name}</div>
                                </label>
                            ))}
                        </div>
                    </div>
                    <hr/>

                    {/*  BY TAGS  */}
                    <div
                        id="tags"
                        style={{
                            marginBottom: "1rem"
                        }}
                    >
                        <h5 className="card-title text-uppercase">mot-clés</h5>

                        <Typeahead
                            clearButton
                            id={"tags"}
                            defaultSelected={selected_tags}
                            labelKey="tag"
                            multiple
                            onChange={selected => this.handleChanged("tags", selected)}
                            options={option_tags}
                            placeholder="Saisissez un mot-clé"
                        />
                    </div>

                    <button
                        className="btn btn-block btn-primary"
                        data-dismiss="modal"
                        type={"submit"}
                    >
                        Appliquer
                    </button>
                </form>
            </>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        tags: ownProps.tags,
        categories: ownProps.categories,
        history: ownProps.history,
        isLoading: state.loading,
        linkPrefix: ownProps.linkPrefix
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilters);
