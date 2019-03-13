// import { expand } from "@emmetio/expand-abbreviation";
import postCss from "./post.css";
import placeholderSvgRaw from "!!raw-loader!./Image placeholder 2D.svg";
import placeholderSvgLink from "./Image placeholder 2D.svg";


export { postCss as css, placeholderSvgRaw as img2 };


/**
 * Simple post view example
 * Usage: new DataView
 */
interface PostData {
  img: string
  title: string
  content: string;
}
export class PostView {
  "constructor": typeof PostView

  elements: any;
  image: string;
  imagePlaceholder: string;

  constructor(public data: PostData) {
    this.data = { ...data };
    this.data.img = this.data.img;
    const container = document.createElement(`section`);
    container.className = `post-view`
    this.elements = {
      container
    };

    this.imagePlaceholder = placeholderSvgRaw // `<img src="${placeholderSvgLink}">`;
    this.image            = `<img src="${this.data.img}">`;
  }
  render():	HTMLElement {
    const { container } = this.elements;

    if (container.parentElement) { container.innerHTML = ``; }
    const image = this.data.img
    const imageHtml = image
      ? this.image
      : this.imagePlaceholder;

    container.insertAdjacentHTML(`afterBegin`, `
      <figure class="picture${image ? `` : ` placeholder`}">
        ${imageHtml}
      </figure>
      <h1 class="title">${this.data.title}</h1>
      <p class="content">${this.data.content}</p>
    `)

    return container;
  }
}
