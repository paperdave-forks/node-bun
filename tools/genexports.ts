import fs from 'fs';
import jsc from '../src/jsc.js';
import ffi from '../src/ffi.js';
//import sqlite from '../src/sqlite.js';

function genExports(module: string, obj: any, objName: string, tsIgnoreKeys: string[], importFrom?: string) {
    const keys = Object.getOwnPropertyNames(obj);
    let exportlist = (importFrom ? `import ${objName} from '${importFrom}';\n\n` : '') + `export default ${objName};\n\n`;

    for (const key of keys) {
        if (key === 'default') continue;
        if (tsIgnoreKeys.includes(key)) exportlist += `// @ts-expect-error undocumented key\n`;
        exportlist += `export const { ${key} } = ${objName};\n`;
    }
    fs.writeFileSync(`src/modules/${module}.ts`, exportlist);
}

genExports('bun', Bun, 'Bun', ['cwd', 'DO_NOT_USE_OR_YOU_WILL_BE_FIRED_mimalloc_dump']);
genExports('jsc', jsc, 'jsc', [], '../jsc.js');
genExports('ffi', ffi, 'ffi', [], '../ffi.js');
//genExports('sqlite', sqlite, 'sqlite', [], '../sqlite.js');

console.log('Export lists generated at src/modules/*.ts');
