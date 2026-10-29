'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const content=vm.runInNewContext(fs.readFileSync('dist/content.js','utf8')+'; NOTEBOOK_CONTENT');
assert.equal(content.references.length,7);
assert.deepEqual(Object.keys(content.zh.ui).sort(),Object.keys(content.en.ui).sort());
for(const language of ['zh','en']){
 assert.equal(content[language].chapters.length,6);
 assert.equal(content[language].ui.tabs.length,6);
 for(const chapter of content[language].chapters){
  assert.ok(chapter.steps.length>=2);
  assert.ok(chapter.formulas.length>=1);
  assert.ok(chapter.refs.every(n=>n>=1&&n<=content.references.length));
 }
}
assert.ok(!/[\u4e00-\u9fff]/.test(JSON.stringify(content.en)),'English content contains untranslated Chinese');
for(const r of content.references)assert.match(r.doi,/^10\.\d{4,9}\/\S+$/);
assert.ok(!/DePSI/i.test(JSON.stringify(content)),'Excluded guide remains in content');
console.log('PASS: bilingual key coverage, six complete derivations, reference identifiers, English text, excluded guide.');
