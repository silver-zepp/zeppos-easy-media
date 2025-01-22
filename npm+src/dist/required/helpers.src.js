const VERSION = "1.1.0";
const PREFIX = `[EasyMedia v${VERSION}]:`;
let DEBUG_LEVEL = 1;

export const QuickJS = (function() {
  return { 
    now: Date.now, 
    noop: ()=> {},
  }
})();

function slack(depth = 2){
  let c = "";
  const s = new Error().stack;
  
  if (typeof s === 'string' && s.includes('\n')) {
    const f = s.split('\n')[depth];
    if (f?.startsWith('    at ')) {
      c = f.slice(7).split(' ')[0];
    }
  }

  return c;
}

export function setDebugLevel(level) {
  DEBUG_LEVEL = level;
}

export function debugLog(level, msg = '', ...msgs) {
  if (level > DEBUG_LEVEL) return;

  const what = slack();
  const out = `${what}()${msg ? ', ' + msg : ''}`;
  
  if (msgs.length === 0) {
    console.log(PREFIX, ">>>", out);
  } else {
    console.log(PREFIX, ">>>", out, ...msgs);
  }
}

export function TimeIt(level, msg_or_func, func_or_null) {
  let msg, f;

  if (typeof msg_or_func === 'function') {
    msg = undefined;
    f = msg_or_func;
  } else {
    msg = msg_or_func;
    f = func_or_null;
  }

  if (typeof f !== 'function') {
    throw new Error('TimeIt: Last arg must be a function');
  }

  // premature exit bugs out short ( ~0.5s ) playbacks 
  //if (level > DEBUG_LEVEL) return f(); 

  const what = slack();
  const start = QuickJS.now();

  if (level <= DEBUG_LEVEL)
    console.log(PREFIX, `>>> ${what}()${msg ? ', ' + msg : ''}`);
  
  const result = f();

  if (level <= DEBUG_LEVEL)
    console.log(PREFIX, `<<< ${what}(), Time: ${QuickJS.now() - start}ms`);
  
  return result;
}