import React from "react";
import PropTypes from "prop-types";
//Stylings
import "../css/PreLoader.css";
import "../css/Message.css";
import "../css/Selector.css";
//Widget configuration source
import widgetConf from "../../resources/widgetConf.json";

import VizG from "react-vizgrammar";
/**
 * For the production build compatible for working on dashboard portal uncomment the line #17 and comment the line #19
 */

// import Widget from "@wso2-dashboards/widget";
import Widget from "../../mocking/Widget";

export class MyWidget extends Widget {
  state = {
    loading: true,
    values: {},
    x_axis: widgetConf.chartConfigs.x_axis || "",
    y_axis: widgetConf.chartConfigs.y_axis || "",
    chart_type: "bar",
    metadata: {},
    DataSet: [],
    hasError: false,
    errorMsg: "",
    theme: "dark",
    width: window.innerWidth,
    height: window.innerHeight
  };

  componentWillMount() {
    console.log("passed props", this.props);
    const { x_axis, y_axis } = this.state;
    const { muiTheme, glContainer } = this.props;
    if (x_axis === "" || y_axis === "") {
      this.state.hasError = true;
      this.state.errorMsg =
        "Axis configurations are not defined or may not defined properly";
    }

    if (muiTheme) {
      this.state.theme = this.props.muiTheme.name === "dark" ? "light" : "dark";
    }
    if (glContainer) {
      glContainer.on("resize", () =>
        this.setState({
          width: glContainer.width,
          height: glContainer.height
        })
      );
    }
  }

  /**
   * Obtain the Channel Manager via the Widget and passing the data to the relevant Widget in the golden layout.
   */
  componentDidMount() {
    console.log("props", this.props);
    try {
      if (this.state.loading) {
        const dataProviderConf = widgetConf.configs.providerConfig;
        super
          .getWidgetChannelManager()
          .subscribeWidget(
            this.props.id || "dummyID",
            this.formatDataToVizGrammar,
            dataProviderConf
          );
      }
    } catch (error) {
      this.setState({
        hasError: "true",
        errorMsg: "Error in @wso2-DashboardWidget" + error.message,
        loading: "false"
      });
      console.error(
        "Error in loading the data using Dashboard Widget",
        error.message
      );
    }
  }

  componentWillUpdate() {
    const { muiTheme } = this.props;
    console.log("component will update", muiTheme.name);
    if (muiTheme) {
      this.state.theme = muiTheme.name === "dark" ? "light" : "dark";
    }
  }

  formatDataToVizGrammar = stats => {
    console.log("stats", stats);
    if (stats.metadata != undefined) {
      const metaName_arr = [];
      const metaType_arr = [];
      stats.metadata.names.map(el => {
        metaName_arr.push(el);
      });
      stats.metadata.types.map(el => {
        metaType_arr.push(el.toLowerCase());
      });
      const metaVals = { ...this.state.metadata };
      metaVals.names = metaName_arr;
      metaVals.types = metaType_arr;

      this.setState({
        loading: false,
        metadata: metaVals,
        DataSet: stats.data
      });
    }
  };

  /**
   * Rendering the pre Loading view
   *
   * @returns {PreLoader}
   */
  renderPreLoader = () => {
    return (
      <div className={"outer-div"}>
        <div className={"center-div"}>
          <div className={"inner-div"}>
            <div>
              <h2>Loading Data....</h2>
              <div className={"psoload"}>
                <div className={"straight"} />
                <div className={"curve"} />
                <div className={"center"} />
                <div className={"inner"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Rendering the bar chart
   *
   * @returns {BarChart}
   */
  renderBarChart = () => {
    console.log("rendering chart");
    const {
      x_axis,
      y_axis,
      metadata,
      DataSet,
      theme,
      chart_type,
      hasError,
      width,
      height
    } = this.state;
    const { glContainer } = this.props;
    if (x_axis != "" && y_axis != "" && hasError != true) {
      return (
        <VizG
          config={{
            x: x_axis,
            charts: [
              {
                type: chart_type,
                y: y_axis,
                fill: "#00C853"
              }
            ],
            maxLength: 7,
            interactiveLegend: true,
            legend: true,
            legendOrientation: "bottom",
            animate: true
          }}
          metadata={metadata}
          data={DataSet}
          theme={theme}
          // height={
          //   this.props.glContainer
          //     ? this.props.glContainer.height
          //     : window.innerHeight - 100
          // }
          // width={
          //   this.props.glContainer
          //     ? this.props.glContainer.width
          //     : window.innerWidth
          // }
          height={glContainer ? glContainer.height : height}
          width={glContainer ? glContainer.width : width}
        />
      );
    } else {
      this.renderErrorMessage(
        "Axis configuration is not defined properly in the widgetConf file"
      );
    }
  };

  renderErrorMessage = () => {
    if (this.state.hasError === true)
      return (
        <div class="error message">
          <h2>Error</h2>
          <p>{this.state.errorMsg}</p>
        </div>
      );
  };

  render() {
    return (
      <div style={{ height: "100%" }}>
        {this.renderErrorMessage()}
        {this.state.loading ? this.renderPreLoader() : this.renderBarChart()}
      </div>
    );
  }
}

// Verifying that the dashboard availability to register the widget in the portal
if (global.dashboard != undefined) {
  global.dashboard.registerWidget(widgetConf.id, MyWidget);
}
