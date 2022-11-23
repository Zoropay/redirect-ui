class Zoropay {
  constructor() {
    this.TYPES = {
      SCHOOL_LEVEL: {
        PRIMARY: "primary",
        SECONDARY: "secondary",
        TERTIARY: "tertiary"
      }
    };

    this.isSetup = true;
    this.errorMessages = [];

    this.style_button();
  }

  style_button() {
    const target_element = "zoropay-portal";
    document.getElementById(target_element).style = `
      color: white;
      background-color: rgb(25, 73, 219);
      width: 150px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      border: 2px solid rgba(150,150,255,0.5);
      font-family: "Roboto";
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 3px 3px rgba(150,150,255,0.3)
    `;
    document.getElementById(target_element).onmouseover = function (e) {
      this.style.backgroundColor = `rgba(30,30,255,1)`;
    };
    document.getElementById(target_element).onmouseleave = function (e) {
      this.style.backgroundColor = `rgb(25, 73, 219)`;
    };

    const redirect_cta = `Pay with // Zoropay`;
    document.getElementById(target_element).innerHTML = `
      <b>
        ${redirect_cta}
      </b>
    `;
  }

  setup(config, redirectDelay = 2000) {
    const { publicKey } = config;
    if (!publicKey) {
      let errMsg = `Zoropay: Public key (${publicKey}) is not defined. Failed to initialize Zoropay object.`;
      console.error(errMsg, { publicKey });
      this.errorMessages.push(errMsg);
    }
    else if(typeof config.publicKey !== 'string') {
      let errMsg = `Zoropay: Public key should be of type - string (public key = ${publicKey}). Failed to initialize Zoropay object.`;
      console.error(errMsg, { publicKey });
      this.errorMessages.push(errMsg);
    }

    this.config = config;
    this.initialize_redirect(config, redirectDelay);
  }

  errors() {
    if (this.isSetup !== true)
      return ["Zoropay: redirect has not yet been setup"];
    return this.errorMessages.length > 0 ? this.errorMessages : false;
  }

  redirect(query, redirectDelay, config) {
    return {
      delay: redirectDelay,
      // Start the countdown immediately
      timeout: setTimeout(() => {
        window.location = `https://${config.publicKey.indexOf('live') === 3 ? '' : 'staging.'}app.zoropay.com?${query}`;
      }, redirectDelay)
    };
  }

  serialize_config(config, redirectDelay) {
    const queryString = `payload=${btoa(JSON.stringify(config))}`;
    return this.redirect(queryString, redirectDelay, config);
  }

  initialize_redirect(config, redirectDelay) {
    const { onSuccess, onError } = config;
    delete config?.onSuccess;
    delete config?.onError;
    const errors = this.errors();
    if (!errors) return onSuccess(this.serialize_config(config, redirectDelay));
    else return onError(errors);
  }

  toString() {
    return "Zoropay redirection handler";
  }
}

const ZoropayBouncer = new Zoropay({});
