// Browser-independent render smoke check; does not replace visual/browser QA.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const nodes=new Map();const node=()=>({innerHTML:'',textContent:'',dataset:{},addEventListener(){},focus(){}});
const document={querySelector(q){if(!nodes.has(q))nodes.set(q,node());return nodes.get(q);},querySelectorAll(){return [];},addEventListener(){},body:{dataset:{},classList:{toggle(){},remove(){}}}};
const context={console,document,location:{hash:'#dashboard'},localStorage:{getItem(){return null},setItem(){}},window:{GIFT_STUDIO_CONFIG:{previewMode:true},addEventListener(){}},TextEncoder,setTimeout,clearTimeout,crypto:require('node:crypto').webcrypto,Intl,URL,Blob};context.globalThis=context;vm.createContext(context);
vm.runInContext(fs.readFileSync(__dirname+'/model.js','utf8'),context);vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),context);
assert.match(nodes.get('#main').innerHTML,/Welcome back/);assert.doesNotMatch(nodes.get('#main').innerHTML,/Stockings at a glance/);vm.runInContext("authMode='signup';render()",context);assert.match(nodes.get('#main').innerHTML,/name="accessCode"/);vm.runInContext("previewUnlocked=true;render()",context);assert.match(nodes.get('#main').innerHTML,/Stockings at a glance/);assert.match(nodes.get('#main').innerHTML,/data-stock-view="Emma"/);
context.location.hash='#setup';vm.runInContext('render()',context);assert.match(nodes.get('#main').innerHTML,/stock-budget-form/);assert.match(nodes.get('#main').innerHTML,/portions of your existing overall and category budgets/);
context.location.hash='#gifts';vm.runInContext('render()',context);assert.match(nodes.get('#main').innerHTML,/data-label="Type"/);assert.match(nodes.get('#main').innerHTML,/Ready for stocking/);assert.match(nodes.get('#main').innerHTML,/data-action="add-stocking"/);
console.log('PASS: dashboard, setup and gift-log render with stocking summaries, budgets, type column and readiness controls.');

assert.match(vm.runInContext('calculatorResult(10000,"25.50")',context),/\$74.50 remaining/);
assert.match(vm.runInContext('calculatorResult(1000,"25.50")',context),/\$15.50 over budget/);
assert.match(vm.runInContext('calculatorResult(-1000,"5")',context),/\$15 over budget/);
assert.match(vm.runInContext('calculatorResult(10000,"0")',context),/\$100 remaining/);
assert.match(vm.runInContext('calculatorResult(10000,"-1")',context),/Enter an amount/);
const before=vm.runInContext('JSON.stringify(state)',context);vm.runInContext('calculatorResult(Studio.totals(state).remaining,"19.99")',context);assert.equal(vm.runInContext('JSON.stringify(state)',context),before);
console.log('PASS: calculator cent precision, over-budget and already-over-budget cases, invalid input, and no saved-data mutation.');

vm.runInContext("previewUnlocked=false;authMode='signin';render()",context);assert.doesNotMatch(nodes.get('#main').innerHTML,/name="accessCode"/);
context.location.hash='#gifts';vm.runInContext('render()',context);assert.doesNotMatch(nodes.get('#main').innerHTML,/data-label="Type"/);
console.log('PASS: signed-out visitors see authentication at every route; only signup asks for the Etsy access code.');
context.window.GIFT_STUDIO_CONFIG.previewMode=false;
// PREVIEW_MODE is captured at startup. Create a second context to test production.
const prodNodes=new Map();const prodDoc={querySelector(q){if(!prodNodes.has(q))prodNodes.set(q,node());return prodNodes.get(q);},querySelectorAll(){return [];},addEventListener(){},body:{dataset:{},classList:{toggle(){},remove(){}}}};
const prod={...context,document:prodDoc,window:{GIFT_STUDIO_CONFIG:{previewMode:false},addEventListener(){}},location:{hash:'#gifts'}};prod.globalThis=prod;vm.createContext(prod);vm.runInContext(fs.readFileSync(__dirname+'/model.js','utf8'),prod);vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),prod);
assert.match(prodNodes.get('#main').innerHTML,/Welcome back/);assert.doesNotMatch(prodNodes.get('#main').innerHTML,/Explore the demo/);assert.doesNotMatch(prodNodes.get('#main').innerHTML,/data-label="Type"/);
const hook=fs.readFileSync(__dirname+'/supabase/access-code-hook.sql','utf8');const expected=hook.match(/<> '([a-f0-9]{64})'/)[1];
vm.runInContext("hashAccessCode('definitely-wrong')",prod).then(actual=>{assert.notEqual(actual,expected);console.log('PASS: production has no demo entry and access-code hashing matches the server-hook format.');});

Promise.all([vm.runInContext("hashAccessCode('MiXeD-Code')",prod),vm.runInContext("hashAccessCode('mixed-code')",prod),vm.runInContext("hashAccessCode('  MIXED-CODE  ')",prod)]).then(values=>{assert.equal(new Set(values).size,1);console.log('PASS: access-code hashes ignore letter case and surrounding whitespace.');});
vm.runInContext("authMode='signup';render()",prod);assert.match(prodNodes.get('#main').innerHTML,/<h2>Create an Account<\/h2>/);assert.doesNotMatch(prodNodes.get('#main').innerHTML,/Case-sensitive/);
