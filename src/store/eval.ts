export function evalInContext(code: string, scopes: Record<string, any>[], store?: any) {
    const scopeProxy = new Proxy({
        __visualStoreFind: (obj: string, val: any) => {
            const set = store.getState().unorderedSetValues[obj]
            if(!set) return undefined
            return set.includes(val) ? val : undefined
        }
    }, {
      get(target, name) {

        if(name === '__visualStoreFind') return target[name]

        for (let i = scopes.length - 1; i >= 0; i--) {
          if (typeof name === 'string' && name in scopes[i]) {
            return scopes[i][name].value;
          }
        }
        return undefined;
      },
      set(_, name, value) {
        for (let i = scopes.length - 1; i >= 0; i--) {
          if (typeof name === 'string' && name in scopes[i]) {
            scopes[i][name].value = value;
            return true;
          }
        }
        return false;
      }
    });

    code = code.replace(/(\w+)\.find\((.*?)\)\s*==\s*(\w+)\.end\(\)/g, `!__visualStoreFind('$1', $2)`)
    code = code.replace(/(\w+)\.find\((.*?)\)\s*!=\s*(\w+)\.end\(\)/g, `__visualStoreFind('$1', $2)`)
  
    const func = new Function('scope', `with(scope) { return ${code} }`);
    return func(scopeProxy);
  }
