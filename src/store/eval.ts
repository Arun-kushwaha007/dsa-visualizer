export function evalInContext(code: string, scopes: Record<string, any>[]) {
    const scopeProxy = new Proxy({}, {
      get(_, name) {
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
  
    const func = new Function('scope', `with(scope) { return ${code} }`);
    return func(scopeProxy);
  }
