import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './DefaultLoaderView.scss'

export class DefaultLoaderView extends Component {

    static propTypes = {

        stagePercentage: PropTypes.number.isRequired,
        stepPercentage: PropTypes.number.isRequired,
        totalPercentage: PropTypes.number.isRequired

    }

    render() {
        return (<div id="ufp-loader">
                <div id="ufp-spinner">
                    <div className="ufp-loader-bar"
                         style={
                             {

                                 height: this.props.totalPercentage + '%'
                             }} />
                    <div className="ufp-loader-bar"
                         style={
                             {

                                 height: this.props.stepPercentage + '%'
                             }} />
                    <div className="ufp-loader-bar"
                         style={
                             {

                                 height: this.props.stagePercentage + '%'
                             }
                         } />
                </div>
            </div>
        )
    }

}
export default DefaultLoaderView
