import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { dateToReadble } from "../../utils/readableDate";
import * as DateActions from "../../actions/date";
import styles from "./Date.css";

class Date extends Component<Props> {
    props: Props;

    render() {
        const { t } = this.props;

        return (
            <React.Fragment>                
                <div className={`columns ${styles.white}`}>
                    <div className="column col-12 col-mx-auto">
                        <div className="columns col-gapless">
                            <div className={`column col-auto col-ml-auto ${styles['btn-fix']}`}>
                                <button className="btn btn-primary btn-lg" onClick={this.props.decrement} type="button">&lt;</button>
                            </div>
                            <div className={`column col-auto text-center ${styles.middle}`}>
                                <div className="popover popover-bottom">
                                    <h5 className={`${styles.pt}`}>{dateToReadble(t, this.props.date)}</h5>
                                    <div className="popover-container">
                                        <div className="card">
                                            <div className="card-header" style={{color: "black"}}>
                                                {t("quicklyJumpToAnotherMonthPeriod")}
                                            </div>
                                            <div className="card-body">
                                                <div className="columns">
                                                    <div className="column col-2">
                                                        <button type="button" className="btn btn-primary" onClick={() => this.props.decrement12()}>-12</button>
                                                    </div>
                                                    <div className="column col-2">
                                                        <button type="button" className="btn btn-primary" onClick={() => this.props.decrement6()}>-6</button>
                                                    </div>
                                                    <div className="column col-4">
                                                        <button type="button" className="btn" onClick={() => this.props.now()}>{t("Now")}</button>
                                                    </div>
                                                    <div className="column col-2">
                                                        <button type="button" className="btn btn-primary" onClick={() => this.props.increment6()}>+6</button>
                                                    </div>
                                                    <div className="column col-2">
                                                        <button type="button" className="btn btn-primary" onClick={() => this.props.increment12()}>+12</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>                                
                            </div>
                            <div className={`column col-auto col-mr-auto ${styles['btn-fix']}`}>
                                <button className="btn btn-primary btn-lg" onClick={this.props.increment} type="button">&gt;</button>
                            </div>
                        </div>                                                                        
                    </div>
                </div>
            </React.Fragment>            
        );
    }
}


// Don't know where this is supposed to go,
// so sticking it here instead
function mapStateToProps(state) {
    return {
        date: state.date
    };
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators(DateActions, dispatch);
}
  
const translatedComponent = withTranslation()(Date);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translatedComponent);