customElements.define('my-paragraph',
  class extends HTMLElement {
    constructor() {
      super();

    //   const template = document.getElementById('my-paragraph');
        let view_type="my-text";

        const templateHtml = `
        <style>
        p {
            color: white;
            background-color: #666;
            padding: 5px;
            }
        </style>
        <p><slot name=${view_type}>My default text </slot></p>
        `;
        let template = document.createElement("template");
        template.innerHTML = templateHtml;

        const templateContent = template.content;

        this.attachShadow({mode: 'open'}).appendChild(
            templateContent.cloneNode(true)
      );
    }
  }
);
