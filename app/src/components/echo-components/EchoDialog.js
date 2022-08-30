import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
// import { Link } from "react-router-dom";

import { getPracticeFromDialogId } from "../../models/echoes";
import withAuth from "../../withAuth";
import withParams from "../../withParams";
import "./Echo.scss";

class EchoDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleCharacterSelect = this.handleCharacterSelect.bind(this);
    this.state = {
      practice: {},
      loading: true,
      stage: null,
    };
  }
  async componentDidMount() {
    await this.props.setupAccessToken();
    const dialog_id = this.props.params.dialog_id;
    let practice;
    try {
      practice = await getPracticeFromDialogId(dialog_id);
      console.log(practice);
    } catch (e) {
      //console.log(e);
      if (e.response && e.response.status === 404) {
        console.log(e.response);
        this.setState({
          ...this.state,
          stage: "SELECT_CHARACTER",
          loading: false,
        });
        return;
      } else {
        console.log(e);
      }
    }

    this.setState({ ...this.state, practice });
  }
  handleCharacterSelect(characterIdx) {}
  render() {
    console.log(this.props);
    console.log(this.state);
    console.log(this.state.stage === "SELECT_CHARACTER");
    return this.state.loading ? (
      "loading..."
    ) : this.state.stage === "SELECT_CHARACTER" ? (
      <>
        hello
        <ChooseCharacter
          characters={this.props.practice.dialog.characters}
          handleCharacterSelect={this.handleCharacterSelect}
        />
      </>
    ) : (
      <Card className="dialog-display"></Card>
    );
  }
}

const ChooseCharacter = (props) => {
  console.log("choose");
  return (
    <Card>
      <p> Choose your role. </p>
      <Card.Body>
        <Button>Choose {props.characters[0]}</Button>
        {props.characters.length > 1 && (
          <Button>Choose {props.characters[1]}</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default withParams(withAuth(EchoDialog));
