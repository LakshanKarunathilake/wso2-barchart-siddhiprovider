import {
  Card,
  CardHeader,
  CardContent,
  MuiThemeProvider,
  createMuiTheme,
  IconButton,
  Fab,
  Tooltip,
  Typography
} from "@material-ui/core";
import React, { Component } from "react";
import widgetConf from "../../../resources/widgetConf.json";
import Resizable from "re-resizable";
import TuneIcon from "@material-ui/icons/Tune";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import TabIcon from "@material-ui/icons/Tab";
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
        height: "10px",
        border: "1px solid black"
      },
      title: {
        fontSize: "0.5rem",
        color: "#ffffff"
      }
    },
    MuiCardContent: {
      root: {
        height: window.innerHeight - 108,
        border: "1px solid black"
      }
    }
  }
});

class Frame extends Component {
  state = {
    glContainer: undefined,
    modalView: false,
    maximizeButtonColor: "white",
    exportButtonColor: "white",
    buttonBaseColor: "white",
    theme: "dark",
    defaultContainer: undefined
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
      },
      defaultContainerSize: {
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

  changeTheme = theme => {
    theme === "dark"
      ? this.setState({
          theme,
          exportButtonColor: "white",
          maximizeButtonColor: "white",
          buttonBaseColor: "white"
        })
      : this.setState({
          theme,
          exportButtonColor: "black",
          maximizeButtonColor: "black",
          buttonBaseColor: "black"
        });
  };

  render() {
    console.log("frame states", this.state);

    //Mapping a new prop to the props.children
    const childrenWithProp = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        glContainer: this.state.glContainer,
        muiTheme: {
          name: this.state.theme
        }
      });
    });

    return (
      <MuiThemeProvider theme={Theme}>
        <Resizable
          ref={c => {
            this.resizable = c;
          }}
          onResizeStop={(e, direction, ref, d) => {
            console.log("resizing stopped");
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
          }}
        >
          <Card>
            <CardHeader
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Typography
                    style={
                      this.state.theme === "dark"
                        ? {
                            color: "white",
                            fontSize: "0.5rem",
                            float: "left"
                          }
                        : {
                            color: "black",
                            fontSize: "0.5rem",
                            float: "left"
                          }
                    }
                  >
                    {widgetConf.name.toUpperCase()}
                  </Typography>
                  <div
                    style={{
                      float: "right",
                      display: "inline",
                      fontSize: "1rem"
                    }}
                  >
                    <IconButton
                      style={{ color: this.state.exportButtonColor }}
                      onMouseEnter={() =>
                        this.setState({ exportButtonColor: "#ee6c09" })
                      }
                      onMouseLeave={() =>
                        this.setState({
                          exportButtonColor: this.state.buttonBaseColor
                        })
                      }
                    >
                      <SaveAltIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: this.state.maximizeButtonColor }}
                      onMouseEnter={() =>
                        this.setState({ maximizeButtonColor: "#ee6c09" })
                      }
                      onMouseLeave={() =>
                        this.setState({
                          maximizeButtonColor: this.state.buttonBaseColor
                        })
                      }
                      onClick={() => {
                        this.resizable.updateSize({
                          width: "100%",
                          height: "100%"
                        });
                      }}
                    >
                      <TabIcon />
                    </IconButton>
                  </div>
                </div>
              }
              style={
                this.state.theme === "dark"
                  ? { backgroundColor: "#1f2c33" }
                  : { backgroundColor: "#ffffff" }
              }
            />
            <div
              ref={content => {
                this.cardContent = content;
              }}
            >
              <CardContent
                style={
                  this.state.theme === "dark"
                    ? {
                        padding: "0px",
                        backgroundColor: "#1a262e"
                      }
                    : {
                        padding: "0px",
                        backgroundColor: "#ffffff"
                      }
                }
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
            changeTheme={this.changeTheme}
          />
        )}
      </MuiThemeProvider>
    );
  }
}

export default Frame;
