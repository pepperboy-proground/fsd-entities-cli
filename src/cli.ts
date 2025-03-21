#!/usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

const program = new Command();

console.log(chalk.rgb(253, 61, 0)(figlet.textSync("CREATE ENTITIES")));

const toPascalCase = (str: string): string => {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

const toScreamingSnakeCase = (str: string): string => {
  return str.toUpperCase().replace(/[-]/g, "_");
};

const templates = (fileName: string) => ({
  api: `import { EndPoint, HttpClient } from '@shared/http';
import type {} from './${fileName}.types.ts';

class ${toPascalCase(fileName)}Api extends HttpClient {
  constructor() {
    super(EndPoint.${toScreamingSnakeCase(fileName).toUpperCase()});
  }
}

export const api = new ${toPascalCase(fileName)}Api();
`,
  queries: `import { api } from './${fileName}.api';`,
  schemas: `import { z } from 'zod';
import { createMutationKeys, createQueryKeys } from '@shared/lib/react-query';

const queries = createQueryKeys(api.endPoint, {
});

const mutations = createMutationKeys(api.endPoint, {
});
  `,
  types: `import type { z } from 'zod';
import type {} from './${fileName}.schemas'
`,
  index: `export * from './${fileName}.queries';`,
});

program.version("1.0.0").action(async () => {
  // 사용자 입력 받기
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "directory",
      message: "📁 설치할 폴더 경로를 입력하세요:",
      default: "./src/entities", // 기본값: 현재 디렉토리
    },
    {
      type: "input",
      name: "fileName",
      message: "📄 생성할 파일 이름을 입력하세요:",
    },
  ]);

  const targetDir = path.resolve(process.cwd(), answers.directory);
  const fileName = answers.fileName;

  if (!fileName) {
    console.log(chalk.redBright(`⚠️ 아하라이~ 이름 입력 안함 ⚠️`));
    return;
  }

  // 폴더 생성
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(chalk.green(`📁 폴더 생성: ${targetDir}`));
  }

  // 파일 생성
  const files = {
    [`${fileName}.api.ts`]: templates(fileName).api,
    [`${fileName}.queries.ts`]: templates(fileName).queries,
    [`${fileName}.schemas.ts`]: templates(fileName).schemas,
    [`${fileName}.types.ts`]: templates(fileName).types,
    [`index.ts`]: templates(fileName).index,
  };
  // 파일 생성
  Object.entries(files).forEach(([file, content]) => {
    const filePath = path.join(targetDir, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(chalk.blue(`📄 파일 생성: ${filePath}`));
    } else {
      console.log(chalk.yellow(`⚠️ 아하라이~ 파일이 존재함: ${filePath}`));
    }
  });

  console.log(chalk.green("✅ 성공! 자 이제 시작이야~"));
});

program.parse(process.argv);
