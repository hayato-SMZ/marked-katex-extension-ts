import katex from "katex";
import type { marked } from "marked";
import { join } from "path";

export interface markedExtension {
  extensions: (marked.TokenizerExtension | marked.RendererExtension)[];
}

function inlineKatex(
  options: any
): marked.TokenizerExtension | marked.RendererExtension {
  return {
    name: "inlineKatex",
    level: "inline",
    start(src: string) {
      return src.indexOf("$");
    },
    tokenizer(src: string, tokens) {
      const match = src.match(/^\$+([^$\n]+?)\$+/);
      if (match) {
        return {
          type: "inlineKatex",
          raw: match[0],
          text: match[1].trim(),
        };
      }
    },
    renderer(token) {
      return katex.renderToString(token.text, options);
    },
  };
}

function blockKatex(
  options: any
): marked.TokenizerExtension | marked.RendererExtension {
  return {
    name: "blockKatex",
    level: "block",
    start(src: string) {
      return src.indexOf("\n$$");
    },
    tokenizer(src: string, _tokens) {
      const match = src.match(/^\$\$+\n([^$]+?)\n\$\$+\n/);
      if (match) {
        return {
          type: "blockKatex",
          raw: match[0],
          text: match[1].trim(),
        };
      }
    },
    renderer(token) {
      return `<p>${katex.renderToString(token.text, options)}</p>`;
    },
  };
}

export default function (options = {}): markedExtension {
  return { extensions: [inlineKatex(options), blockKatex(options)] };
}
