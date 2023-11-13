// import stuff
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = '';
    this.presenter = '';
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      presenter: { type: String },
      description: { type: String}
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: inline-flex;
      }
      .wrapper {
        padding: 16px;
        background-color: #eeeeee;
      }
    `;
  }
  // LitElement rendering template of your element
  render() {
    //if(this.discordurl="")
    return html`
      <div class="wrapper">
        <h3>${this.title}</h3>
        <h4>${this.presenter}</h4>
        <p>${this.description}</p> <!-- Display description -->
        <button @click="${this.watchChannel}">Watch</button> <!-- Add Watch button -->
        <slot></slot>
      </div>  
      `;
  }
  watchChannel() {
    const watchEvent = new CustomEvent('watch-channel', {
      detail: { title: this.title, presenter: this.presenter },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(watchEvent);
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);