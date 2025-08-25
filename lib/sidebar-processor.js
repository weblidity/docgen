const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const matter = require('gray-matter');

function findLongestCommonPath(paths) {
    if (!paths || paths.length === 0) {
        return '';
    }

    const sortedPaths = paths.slice().sort();
    const firstPath = sortedPaths[0];
    const lastPath = sortedPaths[sortedPaths.length - 1];
    let i = 0;

    while (i < firstPath.length && firstPath.charAt(i) === lastPath.charAt(i)) {
        i++;
    }

    let commonPath = firstPath.substring(0, i);
    // Ensure the common path ends at a directory level
    if (commonPath.includes('/')) {
        commonPath = commonPath.substring(0, commonPath.lastIndexOf('/') + 1);
    }

    return commonPath;
}

function extractPaths(items) {
    let paths = [];
    for (const item of items) {
        if (typeof item === 'string') {
            paths.push(item);
        } else if (item.type === 'category' && item.items) {
            paths = paths.concat(extractPaths(item.items));
        }
    }
    return paths;
}

/**
 * Generates an .outline.yaml file from a Docusaurus sidebars file.
 *
 * @param {string} sidebarsFilename - The absolute path to the sidebars.js file.
 */
function generateOutlineFromSidebars(sidebarsFilename) {
  const sidebars = require(sidebarsFilename);

  const outline = {
    sidebars: [],
  };

  const docsRoot = path.join(path.dirname(sidebarsFilename), 'docs');

  for (const sidebarKey in sidebars) {
    const sidebarItems = sidebars[sidebarKey];
    const allPaths = extractPaths(sidebarItems);
    const commonPath = findLongestCommonPath(allPaths);

    const sidebarObject = {
      label: sidebarKey,
      items: processSidebarItems(sidebarItems, docsRoot, commonPath),
    };

    if (commonPath) {
        sidebarObject.path = commonPath.endsWith('/') ? commonPath.slice(0, -1) : commonPath;
    }

    outline.sidebars.push(sidebarObject);
  }

  // If there is only one sidebar with a common path, move it to the top level
  if (outline.sidebars.length === 1 && outline.sidebars[0].path) {
    outline.path = outline.sidebars[0].path;
    delete outline.sidebars[0].path;
  }

  const outlineYaml = yaml.dump(outline);

  const outputFilename = sidebarsFilename.replace(/\.js$/, '.outline.yaml');

  fs.writeFileSync(outputFilename, outlineYaml, 'utf8');

  console.log(`Successfully generated ${outputFilename}`);
}

function parseHeadings(content) {
    const headingRegex = /^(##+)\s+(.*?)(?:\s*\$\{(.*?)\})?$/gm;
    const headings = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
        const heading = {
            label: match[2].trim(),
            level: match[1].length,
        };
        if (match[3]) {
            heading.slug = match[3].trim();
        }
        headings.push(heading);
    }

    const nestedHeadings = [];
    const stack = [];

    headings.forEach(heading => {
        while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
            stack.pop();
        }

        if (stack.length === 0) {
            nestedHeadings.push(heading);
        } else {
            if (!stack[stack.length - 1].items) {
                stack[stack.length - 1].items = [];
            }
            stack[stack.length - 1].items.push(heading);
        }

        stack.push(heading); // heading already has the level property
    });

    return nestedHeadings;
}

function removeLevelProperty(headings) {
    headings.forEach(heading => {
        delete heading.level;
        if (heading.items) {
            removeLevelProperty(heading.items);
        }
    });
}

function processSidebarItems(items, docsRoot, commonPath) {
  return items.map(item => {
    if (typeof item === 'string' || (item.type === 'doc' || !item.type)) {
      const originalDocId = (typeof item === 'string') ? item : item.id;
      let docId = originalDocId;
      if (commonPath && docId.startsWith(commonPath)) {
        docId = docId.substring(commonPath.length);
      }

      const filePath = path.join(docsRoot, `${originalDocId}.md`);

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        const h1Match = content.match(/^#\s+(.*)/m);
        const title = h1Match ? h1Match[1] : null;

        const topic = { ...data }; // Copy all front-matter properties

        if (topic.sidebar_label) {
          topic.label = topic.sidebar_label;
          delete topic.sidebar_label;
          if (title) {
            topic.title = title;
          }
        } else {
          topic.label = title;
        }

        let summary = null;
        if (h1Match) {
            const h1EndIndex = h1Match.index + h1Match[0].length;
            const contentAfterH1 = content.substring(h1EndIndex);

            const nextHeadingMatch = contentAfterH1.match(/^(#+)\s+.*$/m);
            let endOfIntroBlockIndex = contentAfterH1.length;
            if (nextHeadingMatch) {
                endOfIntroBlockIndex = nextHeadingMatch.index;
            }

            const introBlock = contentAfterH1.substring(0, endOfIntroBlockIndex).trim();

            const firstParagraphMatch = introBlock.match(/^(.*?)(?:\n\n|$)/s);
            if (firstParagraphMatch && firstParagraphMatch[1]) {
                summary = firstParagraphMatch[1].trim();
                const lines = summary.split('\n').filter(line => line.trim() !== '' && !line.trim().startsWith('```') && !line.trim().startsWith(':::'));
                summary = lines.join(' ').trim();
            }
        }
        if (summary) {
            topic.summary = summary;
        }

        const headings = parseHeadings(content);
        if (headings.length > 0) {
            removeLevelProperty(headings);
            topic.headings = headings;
        }

        return topic;
      } else {
        return { label: docId };
      }
    }

    if (item.type === 'category') {
      return {
        label: item.label,
        items: processSidebarItems(item.items, docsRoot, commonPath),
      };
    }

    if (item.type === 'link') {
      return {
        label: item.label,
        href: item.href,
      };
    }

    return item; // Return original item if it doesn't match any known type
  });
}

module.exports = { generateOutlineFromSidebars };
