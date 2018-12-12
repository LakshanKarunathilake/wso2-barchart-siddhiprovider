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

const style = {
  resizableBox: {
    border: "solid 1px #ddd",
    background: "#f0f0f0"
  },
  cardHeader: {
    height: "10%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  titleOptionsTray: {
    float: "right",
    display: "inline",
    fontSize: "1rem"
  },
  cardContent: {
    padding: "0px",
    backgroundColor: "#1a262e",
    height: "100%",
    border: "1px solid black"
  },
  optionsMenuIcon: {
    position: "absolute",
    right: "20px",
    bottom: "20px",
    color: "#ffffff"
  }
};
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
    }
  }
});

class Frame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      glContainer: undefined,
      modalView: false,
      maximizeButtonColor: "white",
      exportButtonColor: "white",
      buttonBaseColor: "white",
      theme: "dark",
      defaultContainer: undefined,
      glContainer: { width: "100%", height: "100%", on: event => {} }
    };
    window.addEventListener("resize", () => {
      console.log("resizing");
      this.setState({
        glContainer: {
          width: this.cardContent.clientWidth,
          height: this.cardContent.clientHeight,
          on: event => {}
        }
      });
    });
  }

  componentDidMount() {
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

  setGLContainerSize = () => {
    this.setState(
      {
        glContainer: {
          width: this.cardContent.clientWidth,
          height: this.cardContent.clientHeight,
          on: event => {}
        }
      },
      () => {
        console.log("setGlContainer");
      }
    );
  };

  render() {
    console.log("frame states", this.state);

    //Mapping additional to the props.children
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
            console.log(
              "this.cardContent.clientWidth :",
              this.cardContent.clientWidth
            );
            console.log(
              "this.cardContent.clientHeight :",
              this.cardContent.clientHeight
            );
            this.setState({
              glContainer: {
                width: this.cardContent.clientWidth,
                height: this.cardContent.clientHeight,
                on: event => {}
              }
            });
          }}
          style={style.resizableBox}
          defaultSize={{
            height: "100%",
            width: "100%"
          }}
          maxWidth={"100%"}
          maxHeight={"100%"}
        >
          <Card style={{ height: "100%" }}>
            <CardHeader
              title={
                <div style={style.cardHeader}>
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
                  <div style={style.titleOptionsTray}>
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
                        window.setTimeout(() => {
                          this.setState({
                            glContainer: {
                              width: this.cardContent.clientWidth,
                              height: this.cardContent.clientHeight,
                              on: event => {}
                            }
                          });
                        }, 0);
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
              style={{
                height: "100%"
              }}
            >
              <CardContent
                style={
                  this.state.theme === "dark"
                    ? {
                        ...style.cardContent,
                        backgroundColor: "#1a262e"
                      }
                    : {
                        ...style.cardContent,
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
            style={style.optionsMenuIcon}
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
