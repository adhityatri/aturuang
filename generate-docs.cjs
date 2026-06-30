const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'app', 'components');
const outputFile = path.join(__dirname, 'docs', 'components.md');

let markdown = '# Components Documentation\n\n';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.vue')) {
      results.push(file);
    }
  });
  return results;
}

const vueFiles = walk(componentsDir);

vueFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const relativePath = path.relative(componentsDir, file).replace(/\\/g, '/');
  
  // Extract script setup to find props
  const scriptMatch = content.match(/<script.*?setup.*?>([\s\S]*?)<\/script>/);
  let props = 'No props defined.';
  if (scriptMatch) {
    const scriptContent = scriptMatch[1];
    const propsMatch = scriptContent.match(/defineProps\(\{(.*?)\}\)/s) || scriptContent.match(/defineProps<\{(.*?)\}>/s);
    if (propsMatch) {
      props = '```typescript\n' + propsMatch[0].trim() + '\n```';
    } else {
        const propsArrMatch = scriptContent.match(/defineProps\(\[(.*?)\]\)/s);
        if (propsArrMatch) {
            props = '```typescript\n' + propsArrMatch[0].trim() + '\n```';
        }
    }
  }

  markdown += `## ${relativePath}\n\n`;
  markdown += `**Path:** \`app/components/${relativePath}\`\n\n`;
  markdown += `### Props\n${props}\n\n`;
  markdown += `---\n\n`;
});

fs.writeFileSync(outputFile, markdown);
console.log('Documentation generated at docs/components.md');
