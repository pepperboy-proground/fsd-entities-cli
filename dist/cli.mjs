#!/usr/bin/env node
import{Command as f}from"commander";import u from"figlet";import r from"chalk";import y from"inquirer";import n from"fs";import p from"path";var a=new f;console.log(r.rgb(253,61,0)(u.textSync("CREATE ENTITIES")));var c=e=>e.split(/[-_]/).map(s=>s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()).join(""),d=e=>e.toUpperCase().replace(/[-]/g,"_"),o=e=>({api:`import { EndPoint, HttpClient } from '@shared/http';
import type {} from './${e}.types.ts';

class ${c(e)}Api extends HttpClient {
  constructor() {
    super(EndPoint.${d(e).toUpperCase()});
  }
}

export const api = new ${c(e)}Api();
`,queries:`import { api } from './${e}.api';`,schemas:"import { z } from 'zod';",types:`import type { z } from 'zod';
import type {} from './${e}.schemas'
`,index:`export * from './${e}.queries';`});a.version("1.0.0").action(async()=>{let e=await y.prompt([{type:"input",name:"directory",message:"\u{1F4C1} \uC124\uCE58\uD560 \uD3F4\uB354 \uACBD\uB85C\uB97C \uC785\uB825\uD558\uC138\uC694:",default:"./src/entities"},{type:"input",name:"fileName",message:"\u{1F4C4} \uC0DD\uC131\uD560 \uD30C\uC77C \uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694:"}]),s=p.resolve(process.cwd(),e.directory),t=e.fileName;if(!t){console.log(r.redBright("\u26A0\uFE0F \uC544\uD558\uB77C\uC774~ \uC774\uB984 \uC785\uB825 \uC548\uD568 \u26A0\uFE0F"));return}n.existsSync(s)||(n.mkdirSync(s,{recursive:!0}),console.log(r.green(`\u{1F4C1} \uD3F4\uB354 \uC0DD\uC131: ${s}`)));let m={[`${t}.api.ts`]:o(t).api,[`${t}.queries.ts`]:o(t).queries,[`${t}.schemas.ts`]:o(t).schemas,[`${t}.types.ts`]:o(t).types,"index.ts":o(t).index};Object.entries(m).forEach(([l,g])=>{let i=p.join(s,l);n.existsSync(i)?console.log(r.yellow(`\u26A0\uFE0F \uC544\uD558\uB77C\uC774~ \uD30C\uC77C\uC774 \uC874\uC7AC\uD568: ${i}`)):(n.writeFileSync(i,g,"utf-8"),console.log(r.blue(`\u{1F4C4} \uD30C\uC77C \uC0DD\uC131: ${i}`)))}),console.log(r.green("\u2705 \uC131\uACF5! \uC790 \uC774\uC81C \uC2DC\uC791\uC774\uC57C~"))});a.parse(process.argv);
