import React from 'react';
import autobind from 'react-autobind';
import ReCAPTCHA from 'react-google-recaptcha';

export default class ContactForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      message: '',
      response: '',
      captchaResponse: '',
      dialog: false,
    };

    autobind(this);
  }

  storeCaptcha(captchaValue) {
    console.log(captchaValue);
    this.setState({ captchaResponse: captchaValue });
  }

  storeName(e) {
    this.setState({ name: e.target.value });
  }

  storeEmail(e) {
    this.setState({ email: e.target.value });
  }

  storeMessage(e) {
    this.setState({ message: e.target.value });
  }

  handleClose() {
    console.log('dialog close invoked');
    this.setState({ dialog: false });
  }

  sendSupportRequest(e) {
    e.preventDefault();
    console.log('submit pressed');
    console.log(this.state);

    fetch('https://92kcwq3cr3.execute-api.us-west-2.amazonaws.com/prod/umarc-email', {
      credentials: 'omit',
      mode: 'cors',
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        captchaResponse: this.state.captchaResponse,
        toEmailAddresses: ['test@hovalabs.com'],
        bodyData: this.state.message,
        bodyCharset: 'UTF-8',
        subjectdata: `UMarc Contact: ${this.state.name}`,
        subjectCharset: 'UTF-8',
        sourceEmail: 'test@hovalabs.com',
        replyToAddresses: [this.state.email],
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          console.log('not fetch');
          this.setState({ response: 'Error in sending the support request!!', dialog: true });
        }
        return res.json();
      })
      .then((json) => {
        console.log('success', json);
        this.setState({
          response: 'Message Sent :)',
          dialog: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div id="contact">
        <form onSubmit={this.sendSupportRequest}>
          <div className="container">
            <h1>Contact Us</h1>
            <div className="row">
              <div className="col-12 col-md-6">
                <label>Name</label>
                <input onChange={this.storeName} type="text" placeholder="Name here" />
              </div>
              <div className="col-12 col-md-6">
                <label>Email</label>
                <input onChange={this.storeEmail} type="text" placeholder="Email here" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label>Message</label>
                <textarea onChange={this.storeMessage} placeholder="Type here" />
              </div>
            </div>
            <ReCAPTCHA
              sitekey="6LfTnD4UAAAAAKvNYLH2BLriDRk0t29YFqQVGBdp"
              onChange={this.storeCaptcha}
            />
            <div className="row">
              <div className="col">
                <input type="submit" value="Submit" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}