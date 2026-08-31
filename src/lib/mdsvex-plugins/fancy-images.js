// src/lib/mdsvex-plugins/fancy-images.js

import { visit } from 'unist-util-visit';
import camelCase from 'just-camel-case';

const RE_SCRIPT_START = /<script(?:\s+?[a-zA-z]+(?:=(?:["']){0,1}[a-zA-Z0-9]+(?:["']){0,1})?)?>/i;

export default function fancyImages() {
  return function transformer(/** @type {any} */ tree) {
    const images = new Map();

    const image_count = new Map();

    // First, find all local images and prepare them for import
    visit(tree, 'image', (node) => {
      if (node.url.startsWith('http')) {
        return; // Skip external images
      }

      // Convert relative paths to $content alias paths for Vite resolution
      let imagePath = node.url;
      if (imagePath.startsWith('./images/')) {
        // Convert ./images/... to $content/blog/images/...
        imagePath = imagePath.replace('./images/', '$content/blog/images/');
      }

      let camel = camelCase(imagePath);
      const count = image_count.get(camel);
      const dupe = images.get(imagePath);

      if (count && !dupe) {
        image_count.set(camel, count + 1);
        camel = `${camel}_${count}`;
      } else if (!dupe) {
        image_count.set(camel, 1);
      }

      images.set(imagePath, {
        path: imagePath,
        id: camel
      });

      // ✅ **Change the node type to 'html' and its value to the <Image> component**
      // We escape the alt text to handle quotes safely
      node.type = 'html';
      const altText = node.alt?.replace(/"/g, '\\"') || '';

      // Include data-width, data-height, data-img for BiggerPicture lightbox proper sizing
      // Enhanced images have structure: { img: { src, w, h }, sources: {...} }
      node.value = `<a href={${camel}?.img?.src} data-img={${camel}?.img?.src} data-width={${camel}?.img?.w} data-height={${camel}?.img?.h} class="gallery-link" data-alt="${altText}"><Image src={${camel}} alt={"${altText}"} /></a>`;
    });

    if (images.size === 0) {
      return; // No local images to process
    }

    // Prepare the script block with imports
    let scriptContent = `import Image from '$lib/components/ui/Image.svelte';\n`;
    images.forEach((x) => {
      // Skip ?enhanced for GIFs and other animated formats that don't work well with optimization
      const isAnimated = x.path.toLowerCase().match(/\.(gif|apng)$/);
      const enhancedParam = isAnimated ? '' : '?enhanced';
      scriptContent += `import ${x.id} from "${x.path}${enhancedParam}";\n`;
    });

    let scriptExists = false;
    visit(tree, 'html', (node) => {
      if (RE_SCRIPT_START.test(node.value)) {
        scriptExists = true;
        // Inject imports into the existing script tag
        node.value = node.value.replace(
          RE_SCRIPT_START,
          (/** @type {string} */ script) => `${script}\n${scriptContent}`
        );
      }
    });

    // If no script tag exists, create one
    if (!scriptExists) {
      tree.children.unshift({
        type: 'html',
        value: `<script>\n${scriptContent}</script>`
      });
    }
  };
}