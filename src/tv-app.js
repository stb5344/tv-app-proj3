// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./tv-channel.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 16px;
        padding: 16px;
      }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <h2>${this.name}</h2>
      ${
        this.listings.map(
          (item) => html`
            <tv-channel 
              title="${item.title}"
              presenter="${item.metadata.author}"
              @click="${this.itemClick}"
            >
            </tv-channel>
          `
        )
      }
      ${this.discordUrl
      ? html`
          <div>
            <!-- Discord Widget (embed URL) -->
          </div>
        `
      : ''}
      <div>
        <!-- video -->
        <!-- discord / chat - optional -->
      </div>
      <!-- dialog -->
      <sl-dialog label="information goes here?" class="dialog">
      <h3>${this.activeChannel ? this.activeChannel.title : ''}</h3>
      <p>${this.activeChannel ? this.activeChannel.presenter : ''}</p>
      <!-- Add YouTube video player here -->
      <button @click="${this.watchVideo}">Watch</button>
      </sl-dialog>
      <tv-channel-list @watch-channel="${this.watchChannel}"></tv-channel-list>
    `;
  }


  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    console.log(e.target);
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

// adding the watch button
  watchChannel(e) {
    const { title, description, videoLink } = e.detail;
    this.activeChannel = { title, description, videoLink };
    this.closeDialog();
    }
  
    watchVideo() {
      // Assuming you have a video player component
      const videoPlayer = this.shadowRoot.querySelector('#video-player'); // Adjust the selector as needed
      videoPlayer.play(this.activeChannel.videoLink);
    
      // Update description below the video
      const descriptionElement = this.shadowRoot.querySelector('#video-description'); // Adjust the selector as needed
      descriptionElement.textContent = this.activeChannel.description;
    
      // Close the modal
      this.closeDialog();
    }
    
    // Add a method to open the dialog
  openDialog() {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
