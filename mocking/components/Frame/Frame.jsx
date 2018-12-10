import {
  Card,
  CardHeader,
  CardContent,
  MuiThemeProvider,
  createMuiTheme,
  IconButton,
  Fab,
  Tooltip
} from "@material-ui/core";
import React, { Component } from "react";
import widgetConf from "../../../resources/widgetConf.json";
import Resizable from "re-resizable";
import DeleteIcon from "@material-ui/icons/Delete";
import TuneIcon from "@material-ui/icons/Tune";
import SettingsModal from "../Settings/SettingsModal.jsx";

const Theme = createMuiTheme({
  overrides: {
    MuiCard: {
      root: {
        borderRadius: 0
      }
    },
    MuiCardHeader: {
      root: {
        height: "10px"
      },
      title: {
        fontSize: "0.5rem",
        color: "#ffffff",
        height: "10px"
      }
    },
    MuiCardContent: {
      root: {
        height: window.innerHeight - 108
      }
    },
    MuiExpansionPanelSummary: {
      root: {
        backgroundColor: "#1a262e"
      },
      content: {
        color: "#ffffff",
        fontSize: "0.8rem"
      },
      expandIcon: {
        color: "#ffffff"
      }
    }
  }
});

class Frame extends Component {
  state = {
    glContainer: undefined,
    modalView: false
  };

  resizingCardContent = () => {
    console.log("resized");
  };

  componentDidMount() {
    console.log(
      "Initial height",
      this.cardContent.clientHeight,
      " Initial Width : ",
      this.cardContent.clientWidth
    );
    this.setState({
      glContainer: {
        width: this.cardContent.clientWidth,
        height: this.cardContent.clientHeight,
        on: event => {}
      }
    });
  }

  toggleConfigMenu = () => {
    this.state.modalView
      ? this.setState({ modalView: false })
      : this.setState({ modalView: true });
  };

  render() {
    console.log("frame states", this.state);

    //Mapping a new prop to the props.children
    const childrenWithProp = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        glContainer: this.state.glContainer
      });
    });

    return (
      <MuiThemeProvider theme={Theme}>
        <Resizable
          onResizeStop={(e, direction, ref, d) => {
            this.setState({
              glContainer: {
                width: this.state.glContainer.width + d.width,
                height: this.state.glContainer.height + d.height,
                on: event => {}
              }
            });
          }}
          style={{
            display: "flex",
            border: "solid 1px #ddd",
            background: "#f0f0f0",
            flexDirection: "column"
            // position: "absolute"
          }}
          maxWidth={"99.5%"}
        >
          <Card>
            <CardHeader
              title={widgetConf.name.toUpperCase()}
              style={{
                height: "10px",
                fontSize: "1em",
                backgroundColor: "#2a353b",
                boxShadow: "5px 10px #ffffff;"
              }}
            />
            <div
              ref={content => {
                this.cardContent = content;
              }}
            >
              <CardContent
                style={{ padding: "0px", backgroundColor: "#1a262e" }}
              >
                {childrenWithProp}
              </CardContent>
            </div>
          </Card>
        </Resizable>
        <Tooltip title={"Options"}>
          <Fab
            size="small"
            color="secondary"
            aria-label="Add"
            variant="outlined"
            style={{
              position: "absolute",
              right: "20px",
              bottom: "20px",
              color: "#ffffff"
            }}
            onClick={this.toggleConfigMenu}
          >
            <TuneIcon />
          </Fab>
        </Tooltip>
        {this.state.modalView && (
          <SettingsModal
            open={this.state.modalView}
            modalClose={this.toggleConfigMenu}
          />
        )}
      </MuiThemeProvider>
    );
  }
}

export default Frame;
