import React, { Component } from "react";
import {
  Modal,
  Typography,
  Button,
  CardHeader,
  Card,
  CardContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import widgetConf from "../../../resources/widgetConf.json";

const styles = {
  title: {
    fontsize: "2rem"
  }
};

export class SettingsModal extends Component {
  state = {
    open: this.props.open
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.modalClose();
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  renderCustomPublisher = () => {
    return (
      <div>
        <Typography>You can publish your own name value pair</Typography>
        <div
          style={{
            border: "1px solid black",
            padding: "10px",
            display: "flex",
            justifyContent: "space-around",
            margin: "10px"
          }}
        >
          <TextField
            id="outlined-name"
            label="Name"
            variant="outlined"
            style={{ paddingRight: "10px" }}
          />
          <TextField id="outlined-name" label="Value" variant="outlined" />

          <Button size={"small"} color={"primary"}>
            Publish
          </Button>
        </div>
      </div>
    );
  };

  changeTheme = theme => {
    this.setState({ theme });
    this.props.changeTheme(theme);
  };

  render() {
    const { classes } = this.props;
    console.log("props", classes);
    console.log("rendering Settings modal", this.state);
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.open}
        onClose={this.handleClose}
        style={{
          display: "flex",
          // width: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Card style={{ maxHeight: "50%" }}>
          <CardHeader
            style={{
              height: "10px",
              backgroundColor: "#1f2c33"
            }}
            title={"Configurations applied for the widget preview"}
            classes={{ title: styles.title }}
          />
          <CardContent
            style={{ display: "float", justifyContent: "space-between" }}
          >
            <label style={{ fontFamily: "Roboto" }}>Theme : </label>

            <Button
              style={{
                backgroundColor: "#18242a",
                color: "white",
                marginLeft: "30px"
              }}
              onClick={() => this.changeTheme("dark")}
            >
              Dark Theme
            </Button>
            <Button
              style={{
                borderColor: "#18242a",
                borderWidth: "1px",
                borderStyle: "solid",
                color: "#18242a",
                marginLeft: "30px"
              }}
              onClick={() => this.changeTheme("light")}
            >
              Light Theme
            </Button>
            <hr />
            <div
              style={{ marginTop: "10px" }}
              // hidden={widgetConf.configs.pubsub}
            >
              <Typography style={{ fontsize: "1.5rem", fontWeight: "bold" }}>
                Subscribing Model
              </Typography>
              <FormControl component="fieldset" style={{ marginLeft: "20px" }}>
                <RadioGroup
                  style={{ display: "inline", justifyContent: "space-between" }}
                  value={this.state.value}
                  onChange={this.handleChange}
                >
                  <FormControlLabel
                    value="Dummy publisher"
                    control={<Radio />}
                    label="Dummy publisher"
                    style={{ marginRight: "10px" }}
                  />
                  <FormControlLabel
                    value="Custom values"
                    control={<Radio />}
                    label="Custom values"
                    style={{ paddingRight: "10px" }}
                  />
                </RadioGroup>
              </FormControl>
              {this.state.value === "Custom values" &&
                this.renderCustomPublisher()}
            </div>
          </CardContent>
        </Card>
      </Modal>
    );
  }
}

export default withStyles(styles)(SettingsModal);
