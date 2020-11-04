import React, {Component} from "react";
import {ModalError} from "./others/ModalError";


export default class ErrorBoundary extends Component {

    state = {
        hasError: false,
    };

    static lastError = "";

    static getDerivedStateFromError(error: Error) {
        return {hasError: true, error: ErrorBoundary.lastError};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        ErrorBoundary.lastError = error.message + "\n\nStack Trace: \n" + errorInfo.componentStack;
        console.error("UNE ERREUR EST SURVENUE : ==> ", errorInfo.componentStack, " : ", error.message);
    }

    render() {
        const {hasError} = this.state;

        return <>
            {
                hasError ?
                    <ModalError onDismiss={() => {
                        this.setState({hasError: false, error: ''});
                        ErrorBoundary.lastError = "";
                    }} error={ErrorBoundary.lastError}/> :
                    (this.props.children)
            }
        </>;
    }

}
