// This code implements the `-sMODULARIZE` settings by taking the generated
// JS program code (INNER_JS_CODE) and wrapping it in a factory function.

// When targeting node and ES6 we use `await import ..` in the generated code
// so the outer function needs to be marked as async.
async function Module(moduleArg = {}) {
  var moduleRtn;

// include: shell.js
// include: minimum_runtime_check.js
(function() {
  // "30.0.0" -> 300000
  function humanReadableVersionToPacked(str) {
    str = str.split('-')[0]; // Remove any trailing part from e.g. "12.53.3-alpha"
    var vers = str.split('.').slice(0, 3);
    while(vers.length < 3) vers.push('00');
    vers = vers.map((n, i, arr) => n.padStart(2, '0'));
    return vers.join('');
  }
  // 300000 -> "30.0.0"
  var packedVersionToHumanReadable = n => [n / 10000 | 0, (n / 100 | 0) % 100, n % 100].join('.');

  var TARGET_NOT_SUPPORTED = 2147483647;

  // Note: We use a typeof check here instead of optional chaining using
  // globalThis because older browsers might not have globalThis defined.
  var currentNodeVersion = typeof process !== 'undefined' && process.versions?.node ? humanReadableVersionToPacked(process.versions.node) : TARGET_NOT_SUPPORTED;
  if (currentNodeVersion < TARGET_NOT_SUPPORTED) {
    throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');
  }
  if (currentNodeVersion < 2147483647) {
    throw new Error(`This emscripten-generated code requires node v${ packedVersionToHumanReadable(2147483647) } (detected v${packedVersionToHumanReadable(currentNodeVersion)})`);
  }

  var userAgent = typeof navigator !== 'undefined' && navigator.userAgent;
  if (!userAgent) {
    return;
  }

  var currentSafariVersion = userAgent.includes("Safari/") && !userAgent.includes("Chrome/") && userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/) ? humanReadableVersionToPacked(userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentSafariVersion < 150000) {
    throw new Error(`This emscripten-generated code requires Safari v${ packedVersionToHumanReadable(150000) } (detected v${currentSafariVersion})`);
  }

  var currentFirefoxVersion = userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/) ? parseFloat(userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentFirefoxVersion < 79) {
    throw new Error(`This emscripten-generated code requires Firefox v79 (detected v${currentFirefoxVersion})`);
  }

  var currentChromeVersion = userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/) ? parseFloat(userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentChromeVersion < 85) {
    throw new Error(`This emscripten-generated code requires Chrome v85 (detected v${currentChromeVersion})`);
  }
})();

// end include: minimum_runtime_check.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = moduleArg;

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = !!globalThis.window;
var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != 'renderer';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

var _scriptName = import.meta.url;

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_SHELL) {

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL('.', _scriptName).href; // includes trailing slash
  } catch {
    // Must be a `blob:` or `data:` URL (e.g. `blob:http://site.com/etc/etc`), we cannot
    // infer anything from them.
  }

  if (!(globalThis.window || globalThis.WorkerGlobalScope)) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  {
// include: web_or_worker_shell_read.js
readAsync = async (url) => {
    assert(!isFileURI(url), "readAsync does not work with file:// URLs");
    var response = await fetch(url, { credentials: 'same-origin' });
    if (response.ok) {
      return response.arrayBuffer();
    }
    throw new Error(response.status + ' : ' + response.url);
  };
// end include: web_or_worker_shell_read.js
  }
} else
{
  throw new Error('environment detection error');
}

var out = console.log.bind(console);
var err = console.error.bind(console);

var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var FETCHFS = 'FETCHFS is no longer included by default; build with -lfetchfs.js';
var ICASEFS = 'ICASEFS is no longer included by default; build with -licasefs.js';
var JSFILEFS = 'JSFILEFS is no longer included by default; build with -ljsfilefs.js';
var OPFS = 'OPFS is no longer included by default; build with -lopfs.js';

var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

// perform assertions in shell.js after we set up out() and err(), as otherwise
// if an assertion fails it cannot print the message

assert(!ENVIRONMENT_IS_WORKER, 'worker environment detected but not enabled at build time.  Add `worker` to `-sENVIRONMENT` to enable.');

assert(!ENVIRONMENT_IS_NODE, 'node environment detected but not enabled at build time.  Add `node` to `-sENVIRONMENT` to enable.');

assert(!ENVIRONMENT_IS_SHELL, 'shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.');

// end include: shell.js

// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;

if (!globalThis.WebAssembly) {
  err('no native wasm support detected');
}

// Wasm globals

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */
var isFileURI = (filename) => filename.startsWith('file://');

// include: runtime_common.js
// include: runtime_stack_check.js
// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = 0x02135467;
  HEAPU32[(((max)+(4))>>2)] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAPU32[((0)>>2)] = 1668509029;
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = HEAPU32[((max)>>2)];
  var cookie2 = HEAPU32[(((max)+(4))>>2)];
  if (cookie1 != 0x02135467 || cookie2 != 0x89BACDFE) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[((0)>>2)] != 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}
// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// Base Emscripten EH error class
class EmscriptenEH extends Error {}

class EmscriptenSjLj extends EmscriptenEH {}

class CppException extends EmscriptenEH {
  constructor(excPtr) {
    super(excPtr);
    this.excPtr = excPtr;
    const excInfo = getExceptionMessage(this);
    this.name = excInfo[0];
    this.message = excInfo[1];
  }
}

// end include: runtime_exceptions.js
// include: runtime_debug.js
var runtimeDebug = true; // Switch to false at runtime to disable logging at the right times

// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(...args) {
  if (!runtimeDebug && typeof runtimeDebug != 'undefined') return;
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn(...args);
}

// Endianness check
(() => {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) abort('Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)');
})();

function consumedModuleProp(prop) {
  if (!Object.getOwnPropertyDescriptor(Module, prop)) {
    Object.defineProperty(Module, prop, {
      configurable: true,
      set() {
        abort(`Attempt to set \`Module.${prop}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`);

      }
    });
  }
}

function makeInvalidEarlyAccess(name) {
  return () => assert(false, `call to '${name}' via reference taken before Wasm module initialization`);

}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_preloadFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

function missingLibrarySymbol(sym) {

  // Any symbol that is not included from the JS library is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      },
    });
  }
}

// end include: runtime_debug.js
// include: binaryDecode.js
// Prevent Closure from minifying the binaryDecode() function, or otherwise
// Closure may analyze through the WASM_BINARY_DATA placeholder string into this
// function, leading into incorrect results.
/** @noinline */
function binaryDecode(bin) {
  for (var i = 0, l = bin.length, o = new Uint8Array(l), c; i < l; ++i) {
    c = bin.charCodeAt(i);
    o[i] = ~c >> 8 & c; // Recover the null byte in a manner that is compatible with https://crbug.com/453961758
  }
  return o;
}
// end include: binaryDecode.js
var readyPromiseResolve, readyPromiseReject;

// Memory management

var runtimeInitialized = false;



function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module['HEAP8'] = HEAP8 = new Int8Array(b);
  Module['HEAP16'] = HEAP16 = new Int16Array(b);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(b);
  Module['HEAP32'] = HEAP32 = new Int32Array(b);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(b);
  Module['HEAP64'] = HEAP64 = new BigInt64Array(b);
  Module['HEAPU64'] = HEAPU64 = new BigUint64Array(b);
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
assert(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set,
       'JS engine does not provide full typed array support');

function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  consumedModuleProp('preRun');
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
  // End ATPRERUNS hooks
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  // No ATINITS hooks

  wasmExports['__wasm_call_ctors']();

  // No ATPOSTCTORS hooks
}

function postRun() {
  checkStackCookie();
   // PThreads reuse the runtime from the main thread.

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  consumedModuleProp('postRun');

  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
  // End ATPOSTRUNS hooks
}

/**
 * @param {string|number=} what
 */
function abort(what) {
  Module['onAbort']?.(what);

  what = `Aborted(${what})`;
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject?.(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// show errors on likely calls to FS when it was not included
function fsMissing() {
  abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM');
}
var FS = {
  init: fsMissing,
  createDataFile: fsMissing,
  createPreloadedFile: fsMissing,
  createLazyFile: fsMissing,
  open: fsMissing,
  mkdev: fsMissing,
  registerDevice:  fsMissing,
  analyzePath: fsMissing,
  ErrnoError: fsMissing,
};


function createExportWrapper(name, nargs) {
  return (...args) => {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    var f = wasmExports[name];
    assert(f, `exported native function \`${name}\` not found`);
    // Only assert for too many arguments. Too few can be valid since the missing arguments will be zero filled.
    assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
    return f(...args);
  };
}

var wasmBinaryFile;

function findWasmBinary() {
  return binaryDecode(' asm   °``~~`|` `  ` ` ` `` ```~` ` ``||``~`~`|~`~~ `~~|` `£env__cxa_begin_catch \nenv__cxa_throw 	wasi_snapshot_preview1fd_write wasi_snapshot_preview1fd_close \nwasi_snapshot_preview1fd_seek env	_abort_js envemscripten_resize_heap \nenv\ninvoke_iii  env\ninvoke_vii 	env__cxa_find_matching_catch_3 \nenv	invoke_ii env__cxa_find_matching_catch_2 \renv__resumeException env	invoke_vi envinvoke_v envinvoke_viiii envinvoke_viii env\r__assert_fail \n\n\n\n\n\n\n\n	\n\n			\n							\n\n \n   \n\n\n	\n\n\n\n\n\n\n\n\n\n\n		 \n\n  \n\n\n			  \n\n\n	\n\r\r\n\r\r\r\n  \n\n  \n \r\r \r\r\r\n\n\n 	\n  \n \n  \r\n\r\r\r\r	\n\n  \n\n\n\n\r\n\n\n   \n\n\n\n\n\n\n\n\n\n\n\r\n	 \n\n\n\n\n\n		\n\n\n	\n\n\n\n \n   \n\n\n\n \n\n\n\n \n \n\n\n\n \n\n  \n\n	\n	p¦¦3AA A A  A¨ AÉ A¨ AåÎ"memory __wasm_call_ctors __indirect_function_table strerror ³load_rom \remulate_cycle should_draw get_display_buffer get_display_width get_display_height key_down key_up reset __em_lib_deps_sdlaudio__em_lib_deps_sdlmousemalloc Êfree Ìfflush emscripten_stack_get_end Ùemscripten_stack_get_base ØsetThrew Û_emscripten_tempret_set Üemscripten_stack_init Öemscripten_stack_get_free ×_emscripten_stack_restore ¹_emscripten_stack_alloc ºemscripten_stack_get_current »"__cxa_decrement_exception_refcount "__cxa_increment_exception_refcount __get_exception_message ¡__cxa_can_catch ©__cxa_get_exception_ptr ª__start_em_lib_deps__stop_em_lib_deps	Ï A¥³¯­®ÂÃÆâP«÷«¨¦¢§¥£­®±²´µ¶·¾ÂÃÓÔØÙÚÝÞ÷ª¬®ÓÇËÌÍÎÏ ¡©«­¯°±²ÄÅÉÊËÌÍÎÏÐÑÒÔÕÖ×ØÙÚÛÜÝÞßâãäåæçèéêëìíðñòóôõö÷øùúûüýþÿ ¡¢£¤¥¦§¨©ª«­®¯°±²³´µ¶¸¹·º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ\nïó Öªs# Ak! $    6 (!   AÀ jÿ  AÀ jæ  AÐ0jõ  A 6ä0   Aj$  e# Ak! $    6 (!   AÀ j  AÀ jç  AÐ0jö  A : â0 Aj$ q# Ak! $    6 (!@@ Ñ AqE\r  Í   AÀ j AÀ j AÐ0j§  Í  Aj$        # Ak!   6 (AÀ j # Ak!   6 (AÐ0j# Ak!   6 (8# Ak!   6 (- Av!A ! Aÿq AÿqGAqC# Ak! $    6 (! A6<   Aj$  À# Ak! $    6 (!  !  ! A 6   Aj  A ;  (<; A :  A :  Aj  ! Aj¡ ! A 6   Aj¢  A : 6 A : 7 Aÿ: 8 Aj$ # Ak!   6 (# Ak!   6 (AjM# Ak! $    6  6  6 ( ( (£  Aj$ # Ak!   6 (# Ak!   6 (A jM# Ak! $    6  6  6 ( ( (¤  Aj$ T# Ak! $    6  6  6  ( ( (k ( Ò  Aj$ W# Ak! $    6  6  6  ( ( (kAu ( Õ  Aj$ «# Ak! $    6  ;\n (!Aÿ@ - 6ANAqE\r A ! A ú  AÐ· A    /\n! Aj! - 6!  Aj: 6  AÿqAtj ;  Aj$ ¡# Ak! $    6 (!Aÿ@ - 6\r A ! A© ú  AÐ· A    Aj! - 6Aj!  : 6  AÿqAtj!Aÿÿ / ! Aj$  ¤# A°k! $    6¬  6¨  6¤  6  (¬!   (¨¨ ;  /Aj; /Aàq!@@@@@@@@@@@@@@@@@@@ E\r  A F\r AÀ F\r Aà F\r AF\r A F\r AÀF\r AàF\r AF\r A F\r	 AÀF\r\n AàF\r AF\r A F\r\r AÀF\r AàF\r - A ~j! AK@@@@    (¤©  ª  AAq: {A ! .!	 Aj 	  AjA   Aj«   Ajù  A Aq: { AÐ· A  Aÿÿ  /¬ Aÿÿ  /­ Aÿÿ  /® \rAÿÿ  /¯ Aÿÿ  /° Aÿÿ  /± \nAÿÿ  /² 	 /Aq!\n \nAK@@@@@@@@@@@ \n 							Aÿÿ  /³ 	Aÿÿ  /´ Aÿÿ  /µ Aÿÿ  /¶ Aÿÿ  /· Aÿÿ  /¸ Aÿÿ  /¹ Aÿÿ  /º Aÿÿ  /»  AAq: _A ! .! Aà j   Aì jA   Aà j«   Aì jù  A Aq: _ AÐ· A  \nAÿÿ  /¼ Aÿÿ  /½ Aÿÿ  /¾ Aÿÿ  /¿  (¨!\r (¤!Aÿÿ  \r  /À  - Aâ~j! AK@@@@   /! ( !  Aÿÿq Á  /! ( !  Aÿÿq Â  AAq: CA ! .! AÄ j   AÐ jA   AÄ j«   AÐ jù  A Aq: C AÐ· A   - !@@@@@@@@@@@ AF\r  A\nF\r AF\r AF\r AF\r A)F\r A3F\r AÕ F\r Aå F\r	Aÿÿ  /Ã 	 /! ( !  Aÿÿq Ä Aÿÿ  /Å Aÿÿ  /Æ Aÿÿ  /Ç Aÿÿ  /È  /! (¨!  Aÿÿq É  /! (¨!  Aÿÿq Ê  /! (¨!  Aÿÿq Ë  AAq: \'A ! .!  A(j    A4jA   A(j«   A4jù  A Aq: \' AÐ· A   AAq: A !! .!" Aj "  AjA   Aj«  ! Ajù  A Aq:  !AÐ· A   A°j$  # Ak! $    6  6 (! (!Aÿÿ  / AÿqAt! (!Aÿÿ   /AjAÿÿq AÿqrAÿÿq! Aj$  <# Ak! $    6  6 (ç  Aj$ z# Ak! $    6 (!Aÿ@ - 6\r A ! Að ú  AÐ· A     ¦ ; Aj$ [# Ak! $    6  6  6 (! (!   A  ü Ì  Aj$ 8# Ak!   6  ;\n (!Aÿÿ  /\nAÿq; # Ak! $    6  ;\n (!Aÿ@ - 6ANAqE\r A ! A± ú  AÐ· A   Aÿÿ  /¥ Aÿÿ  /\nAÿq; Aj$ # Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAÿq: Aÿ  - 	j!Aÿ -  !Aÿ@  - FAqE\r Aÿÿ  /Aj;# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAÿq: Aÿ  - 	j!Aÿ -  !Aÿ@  - GAqE\r Aÿÿ  /Aj;# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAðqAu: Aÿ  - 	j!Aÿ -  !Aÿ  - j!Aÿ@  -  FAqE\r Aÿÿ  /Aj;f# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAÿq:  - !Aÿ  - 	j :  x# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAÿq: Aÿ - !Aÿ  - 	j!Aÿ   -  j:  s# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAðqAu: Aÿ  - j-  !Aÿ  - 	j :  # Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAðqAu: Aÿ  - 	j!Aÿ -  !Aÿ  - j!Aÿ  -  r!Aÿ  - 	j :   A : # Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAðqAu: Aÿ  - 	j!Aÿ -  !Aÿ  - j!Aÿ  -  q!Aÿ  - 	j :   A : # Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAðqAu: Aÿ  - 	j!Aÿ -  !Aÿ  - j!Aÿ  -  s!Aÿ  - 	j :   A : Õ# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAðqAu: Aÿ   - 	j-  : Aÿ   - j-  : Aÿ - !Aÿ   - j;Aÿÿ /Aÿq!Aÿ  - 	j :  Aÿÿ /AÿJ! AA  Aq: Ë# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAðqAu: Aÿ   - 	j-  : Aÿ   - j-  : Aÿ - !Aÿ  - k!Aÿ  - 	j :  Aÿ - !Aÿ  - N! AA  Aq: §# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAðqAu: Aÿ  - j!Aÿ  -  Aq: Aÿ  - j!Aÿ -  Au!Aÿ  - 	j :    - : Ë# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAðqAu: Aÿ   - 	j-  : Aÿ   - j-  : Aÿ - !Aÿ  - k!Aÿ  - 	j :  Aÿ - !Aÿ  - N! AA  Aq: «# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAðqAu: Aÿ  - j!Aÿ  -  AqAu: Aÿ  - j!Aÿ -  At!Aÿ  - 	j :    - : # Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAðqAu: Aÿ  - 	j!Aÿ -  !Aÿ  - j!Aÿ@  -  GAqE\r Aÿÿ  /Aj;8# Ak!   6  ;\n (!Aÿÿ  /\nAÿq;U# Ak!   6  ;\n (!Aÿÿ  /\nAÿq;Aÿ -  !Aÿÿ   /j;# Ak! $    6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ  /\nAÿq: ¬ Ao!Aÿ  - q!Aÿ  - 	j :   Aj$ \n# AÀ k! $    6<  68  64  ;2 (<!@@ (4ò Aq\r Aÿÿ  /Ak;Aÿÿ  /2AqAu: 1Aÿÿ  /2AðqAu: 0Aÿÿ  /2Aq: /Aÿ   - 1j-  : .Aÿ   - 0j-  : - A 6@@ (!Aÿ  - /HAqE\r (8!Aÿÿ  / (jAÿÿq ! ( Ajj :    (Aj6  (4!	 - .!\n - -! - /!  	 \n  Aj í :  - !\r AA  \rAq:  AÀ j$ ¶# Ak! $    6  ;\n  6 (!Aÿÿ  /\nAqAu: Aÿ  - j!Aÿ@ -  AHAqE\r  (!Aÿ  - j!Aÿ  -  ü AqE\r Aÿÿ  /Aj; Aj$ µ# Ak! $    6  ;\n  6 (!Aÿÿ  /\nAqAu: Aÿ  - j!Aÿ@ -  AHAqE\r  (!Aÿ  - j!Aÿ  -  ü Aq\r Aÿÿ  /Aj; Aj$ S# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	 - !Aÿ  - 	j :  ù# A k! $    6  ;  6 (!Aÿÿ  /AqAu:  A6 A 6@@ (AHAqE\r@ ( (ü AqE\r   (6  (Aj6 @@ (AGAqE\r  (!Aÿ  - j :   A : 7 A: 7Aÿÿ  /Ak; A j$ O# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿ   - 	j-  : O# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿ   - 	j-  : j# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿÿ /!Aÿ  - 	j!Aÿ   -  jAÿq;o# Ak!   6  ;\n (!Aÿÿ  /\nAqAu: 	Aÿ  - 	j!Aÿ  -  Aq: Aÿ  - AlAÐ j;¦# Ak! $    6  ;\n  6 (!Aÿÿ  /\nAqAu:  (! /!Aÿ  - j!Aÿ -  Aä m!  Aÿÿq Aÿq  (!	Aÿÿ /Aj!\nAÿ  - j!Aÿ -  A\nmA\no! 	 \nAÿÿq Aÿq  (!\rAÿÿ /Aj!Aÿ  - j!Aÿ -  A\no! \r Aÿÿq Aÿq  Aj$ ù	# Ak! $    6  ;\n  6 (!Aÿÿ  /\nAqAu:  A : @@Aÿ - !Aÿ  - LAqE\r (!Aÿÿ /!Aÿ  - j!Aÿ  - j!	 Aÿÿq!\nAÿ  \n 	-     - Aj:  Aÿ - Aj!Aÿÿ   /j; Aj$ í# Ak! $    6  ;\n  6 (!Aÿÿ  /\nAqAu:  A : @@Aÿ - !Aÿ  - LAqE\r (!Aÿÿ /!Aÿ   - jAÿÿq !Aÿ  - j :    - Aj:  Aÿ - Aj!	Aÿÿ  	 /j; Aj$ È# A k! $    6  6 (!  6 (! Aj × !  (6  ) 7  A 6 B 7  (!  (6  ) 7  (A Ø @  Aq\r   Ù Ø  (! A j$  b# Ak!   6 (!Aÿ@ - A JAqE\r   - Aj: Aÿ@ - A JAqE\r   - Aj: (# Ak!   6 (!Aÿÿ /+# Ak!   6  ;\n ( /\n;V# Ak! $    6  6 (!  (ø  A· Aj6  Aj$  "# Ak!   6 (- 7AqW# Ak! $    6  6  6 ( (Ó  (Ô ! Aj$  # Ak!   6 (n# Ak!   6  6  6@@ (A JAqE\r (( ! ( :    (Aj6  (Aj6  (W# Ak! $    6  6  6 ( (Ó  (Ö ! Aj$  n# Ak!   6  6  6@@ (A JAqE\r (( ! ( ;   (Aj6  (Aj6  (X# Ak! $    6  6@ ( Aq\r  (Ú  (! Aj$  e# Ak! $    6  6 (!  Û  Ü jAj Û  (jAjÝ  Aj$ a# Ak! $    6 (!@@  AqE\r  Þ ! ß ! ! Aj$  a# Ak! $    6 (!  Û  Ù jAj Û  Ü jAjÝ  Aj$ ?# Ak! $    6 (à á ! Aj$  ^# Ak! $    6 (!@@  AqE\r  â !A! Ak! Aj$  %# Ak!   6  6  6# Ak!   6 ((\'# Ak!   6 (- Aÿ qAÿqa# Ak! $    6 (!@@  AqE\r  ã ! ä ! ! Aj$  # Ak!   6 ()# Ak!   6 ((AÿÿÿÿqA t# Ak!   6 (( 9# Ak! $    6 (å ! Aj$  # Ak!   6 ([# Ak! $    6 (! A 6 A 6 A :  A :  ç  Aj$  c# Ak! $    6 (! è ! é ! A :    Ajê  A:  Aj$ # Ak!   6 ( # Ak!   6 (AjM# Ak! $    6  6  6 ( ( (ë  Aj$ T# Ak! $    6  6  6  ( ( (k ( ó  Aj$ "# Ak!   6 (A: Ã# A0k! $    6,  : +  : *  6$  : # (,! A : "Aÿ  - +AÀ o6Aÿ  - *A o6 A 6@@ (!Aÿ  - #HAqE\r  ($ (j-  :   ( (j6@ (A NAqE\r @@ (A HAqE\r  A 6@@ (AHAqE\rAÿ - ! (!	@@ A 	uqE\r   ( (j6@ (AÀ NAqE\r @ (A HAqE\r  (!\n (!@  \nAÿq Aÿqî AqE\r  A: "  (Aj6   (Aj6  A:  - "Aq! A0j$  Î# A k!   6  :   :  (!Aÿ@@@ - AÀ NAq\r Aÿ - A NAqE\r A Aq:   -  - Atj6   (j-  A G: @@ - AqE\r   (jA :    (jAÿ:    - Aq:  - Aq## Ak!   6 (- Aq"# Ak!   6 (A : .# Ak!   6 (! A:  A : ^# Ak!   6 (!@@ - AqE\r  A :  AAq:  A:  A Aq:  - AqW# Ak! $    6  6  6 ( (Ó  (ô ! Aj$  q# Ak!   6  6  6@@ (A JAqE\r (-  Aq! ( :    (Aj6  (Aj6  (;# Ak! $    6 (! ö  Aj$  j# Ak! $    6 (! ÷ ! ø ! A :    Ajù  A :  Aÿ:  Aj$ # Ak!   6 (# Ak!   6 (AjM# Ak! $    6  6  6 ( ( (ú  Aj$ T# Ak! $    6  6  6  ( ( (k ( ý  Aj$ \\# Ak!   6  :   : \n (!Aÿ@ - AHAqE\r  - \n!Aÿ  - j Aq:  p# Ak!   6  6 (!@@@ (A HAq\r  (ANAqE\r A Aq:    (j-  Aq:  - AqW# Ak! $    6  6  6 ( (Ó  (þ ! Aj$  q# Ak!   6  6  6@@ (A JAqE\r (-  ! ( Aq:    (Aj6  (Aj6  (;# Ak! $    6 (!   Aj$  c# Ak! $    6 (!  !  ! A 6   Aj    Aj$ # Ak!   6 ( # Ak!   6 (A j# Að k!   6l (l!AÀ !AÐ ! Aj  ü\n   A 6@@ (AÐ IAqE\r ( Ajj-  !  (AÐ jj :    (Aj6 # Ak! $    6  ;\n (!Aÿÿ@ /\nA NAqE\r A ! A¼ Ð  A°· A   Aÿÿ  /\nj!Aÿ -  ! Aj$  # Ak! $    6  ;\n  : 	 (!Aÿÿ@ /\nA NAqE\r A ! A¡ Ð  A°· A    - 	!Aÿÿ  /\nj :   Aj$  Að  # AÀ k! $    6<  68  (86 AÕ  A j¨ @@ (<A GAq\r Aú A ¨  (<!Aÿ -  ! (<!Aÿ - ! (<!Aÿ - ! (<!	Aÿ  	- 6  6  6  6A  Aj¨ Að   Að  64 Að  60 A 6,@ (, (8H!\nA ! \nAq! !\r@ E\r  (,! (0(<! A  kI!\r@ \rAqE\r  (4! (0(< (,j! (< (,j! Aÿÿq!Aÿ   -     (,Aj6, (0 (0(<AÿÿqÏ Að  ì A!A  : Ø¿   (0(<6 A·  ¨  AÀ j$  # Ak!   6 (AÀ j# A k!   $ @A (Ü¿ A\no\r Að  ñ @A (Ü¿ Aèo\r A (Ü¿ !  Að  Î Aÿÿq6   6Aå   Aj¨ Að  A (Ü¿ Aj!A  6Ü¿ @Að  ï AqE\r A!A  : Ø¿ Að  ð   A (Ü¿ 6 Aø   ¨   A j$ A - Ø¿ ! AA   Aq# Ak!   $   Að  6    ( 6@@  (A GAq\r A A ¨   A 6A !A  : Ø¿     (6  (!  Aj$  # Ak!   6 ( AÀ  A V# Ak! $    6Að  ! (!A!  Aÿq Aqû  Aj$ V# Ak! $    6Að  ! (!A !  Aÿq Aqû  Aj$  Að  A ! A   : Ø¿ 	   Aà¿ @  \r A !@A ( E\r A (  !@A ( E\r A (   r!@¦ ( " E\r @@  (  (F\r     r!  (8" \r §  @  (  (F\r   A A   ($    (\r A@  ("  ("F\r     k¬A  ((    A 6  B 7  B 7A ò~@ E\r    :     j"Aj :   AI\r    :    :  A}j :   A~j :   AI\r    :  A|j :   A	I\r   A   kAq"j" AÿqAl"6    kA|q"j"A|j 6  A	I\r   6  6 Axj 6  Atj 6  AI\r   6  6  6  6 Apj 6  Alj 6  Ahj 6  Adj 6   AqAr"k"A I\r  ­B~!  j!@  7  7  7  7  A j! A`j"AK\r      (<  ¤ # A k"$    ("6  (!  6  6   k"6  j! Aj!A!@@@@@  (< AjA Aj Ç E\r  !@  ("F\r@ AJ\r  ! AA   ("K"	j" (   A  	k"j6  AA 	j" (  k6   k! !  (<   	k" Aj Ç E\r  AG\r    (,"6   6     (0j6 !A !  A 6  B 7    ( A r6  AF\r   (k! A j$        (<  Ç   @    ü\n    @ AI\r         j!@@   sAq\r @@  Aq\r   !@ \r   !  !@  -  :   Aj! Aj"AqE\r  I\r  A|q!@ AÀ I\r   A@j"K\r @  ( 6   (6  (6  (6  (6  (6  (6  (6  ( 6   ($6$  ((6(  (,6,  (060  (464  (868  (<6< AÀ j! AÀ j" M\r   O\r@  ( 6  Aj! Aj" I\r @ AO\r   !@ AO\r   ! A|j!  !@  -  :    - :   - :   - :  Aj! Aj" M\r @  O\r @  -  :   Aj! Aj" G\r   \\    (H"Aj r6H@  ( "AqE\r    A r6 A  B 7    (,"6   6     (0j6A æ@@ ("\r A !  \r (!@   ("kM\r      ($  @@ (PA H\r  E\r  !@@   j"Aj-  A\nF\r Aj"E\r      ($  " I\r  k! (!  !A !      ( j6  j! ,@    l"  " G\r  A    n A*   A   K# Ak"$     Aÿq Aj Ç ! )! Aj$ B  @@@ AI\r    rAq\r@  (  ( G\r Aj!  Aj!  A|j"AK\r  E\r@@  -  " -  "G\r Aj!  Aj!  Aj"E\r   kA  AÀ ¢ A À  AÀ £ ;# Ak"$   6A    Á ! Aj$   A¤À N  ! A A 6ÔÀ A   6¼À A A A k6ØÀ A A (è 6ÜÀ 	   -~A A ) Á B­þÕäÔý¨Ø ~B|" 7 Á   B!§ A  B Y -  !@  -  "E\r   AÿqG\r @ - !  - "E\r Aj!  Aj!   AÿqF\r   Aÿqkà@@@   sAqE\r  -  !@ AqE\r @   -  ":   E\r  Aj!  Aj"Aq\r A ( "k rAxqAxG\r @   6   Aj!  "Aj!A ("k rAxqAxF\r    :   AÿqE\r @   - ":   Aj!  Aj! \r       °   EA !@  AK\r @@  \r A !   At/  " E\r  AÔ j!      ²   !@@  AqE\r @  -  \r     k  !@ Aj"AqE\r -  \r @ "Aj!A ( "k rAxqAxF\r @ "Aj! -  \r    ké A G!@@@  AqE\r  E\r  Aÿq!@  -   F\r Aj"A G!  Aj" AqE\r \r  E\r@  -   AÿqF\r  AI\r  AÿqAl!@A  (  s"k rAxqAxG\r  Aj!  A|j"AK\r  E\r Aÿq!@@  -   G\r     Aj!  Aj"\r A   A  µ "  k  ~@  ½"B4§Aÿq"AÿF\r @ \r @@  D        b\r A !  D      ðC¢ · !  ( A@j!  6     Axj6  BÿÿÿÿÿÿÿBð?¿!   æ# AÐk"$   6Ì A jA A(ü   (Ì6È@@A   AÈj AÐ j A j  ¹ A N\r A!     ( "A_q6 @@@@  (0\r   AÐ 60  A 6  B 7  (,!   6,A !  (\rA!   \r    AÈj AÐ j A j  ¹ ! A q!@ E\r   A A   ($    A 60   6,  A 6  (!  B 7 A !    ( " r6 A  A q!  AÐj$   ~# AÀ k"$   6< A)j! A\'j!	 A(j!\nA !A !@@@@@A !\r@ ! \r AÿÿÿÿsJ\r \r j! !\r@@@@@@ -  "E\r @@@@ Aÿq"\r  \r! A%G\r \r!@@ - A%F\r  ! \rAj!\r - ! Aj"! A%F\r  \r k"\r Aÿÿÿÿs"J\r\n@  E\r     \rº  \r\r  6< Aj!\rA!@ , APj"A	K\r  - A$G\r  Aj!\rA! !  \r6<A !@@ \r,  "A`j"AM\r  \r!A ! \r!A t"AÑqE\r @  \rAj"6<  r! \r, "A`j"A O\r !\rA t"AÑq\r @@ A*G\r @@ , APj"\rA	K\r  - A$G\r @@  \r   \rAtjA\n6 A !  \rAtj( ! Aj!A! \r Aj!@  \r   6<A !A !  ( "\rAj6  \r( !A !  6< AJ\rA  k! AÀ r! A<j» "A H\r (<!A !\rA!@@ -  A.F\r A !@ - A*G\r @@ , APj"A	K\r  - A$G\r @@  \r   AtjA\n6 A !  Atj( ! Aj! \r Aj!@  \r A !  ( "Aj6  ( !  6< AJ!  Aj6<A! A<j» ! (<!@ \r!A! ",  "\rAjAFI\r Aj! A:l \rjAÿ¬ j-  "\rAjAÿqAI\r   6<@@ \rAF\r  \rE\r\r@ A H\r @  \r   Atj \r6 \r   Atj) 70  E\r	 A0j \r  ¼  AJ\rA !\r  E\r	  -  A q\r Aÿÿ{q"  AÀ q!A !AÂ ! \n!@@@@@@@@@@@@@@@@@ -  "À"\rASq \r AqAF \r "\rA¨j!	\n  \n!@ \rA¿j  \rAÓ F\rA !AÂ ! )0!A !\r@@@@@@@   (0 6  (0 6  (0 ¬7  (0 ;  (0 :   (0 6  (0 ¬7  A AK! Ar!Aø !\rA !AÂ ! )0" \n \rA q½ ! P\r AqE\r \rAvAÂ j!A!A !AÂ ! )0" \n¾ ! AqE\r   k"\r  \rJ!@ )0"BU\r  B  }"70A!AÂ !@ AqE\r A!AÃ !AÄ AÂ  Aq"!  \n¿ !  A Hq\r Aÿÿ{q  !@ B R\r  \r  \n! \n!A !  \n k Pj"\r  \rJ!\r - 0!\r (0"\rAÏ  \r!   Aÿÿÿÿ AÿÿÿÿI¶ "\rj!@ AL\r  ! \r!\r ! \r! -  \r )0"PE\rA !\r	@ E\r  (0!A !\r  A  A  À  A 6  >  Aj60 Aj!A!A !\r@@ ( "E\r Aj É "A H\r   \rkK\r Aj!  \rj"\r I\r A=! \rA H\r\r  A   \r À @ \r\r A !\rA ! (0!@ ( "E\r Aj É " j" \rK\r   Aj º  Aj!  \rI\r   A   \r AÀ sÀ   \r  \rJ!\r	  A Hq\r\nA=!   +0    \r   "\rA N\r \r- ! \rAj!\r   \r\n E\rA!\r@@  \rAtj( "E\r  \rAtj   ¼ A! \rAj"\rA\nG\r @ \rA\nI\r A!@  \rAtj( \rA! \rAj"\rA\nF\r A!  \r: \'A! 	! \n! ! \n!   k"  J" AÿÿÿÿsJ\rA=!   j"  J"\r K\r  A  \r  À     º   A0 \r  AsÀ   A0  A À     º   A  \r  AÀ sÀ  (<!A !A=!  6 A! AÀ j$   @  -  A q\r      {A !@  ( ",  APj"A	M\r A @A!@ AÌ³æ K\r A  A\nl"j  AÿÿÿÿsK!   Aj"6  , ! ! ! APj"A\nI\r  ¾ @@@@@@@@@@@@@@@@@@@ Awj 	\n\r  ( "Aj6    ( 6   ( "Aj6    4 7   ( "Aj6    5 7   ( "Aj6    4 7   ( "Aj6    5 7   ( AjAxq"Aj6    ) 7   ( "Aj6    2 7   ( "Aj6    3 7   ( "Aj6    0  7   ( "Aj6    1  7   ( AjAxq"Aj6    ) 7   ( "Aj6    5 7   ( AjAxq"Aj6    ) 7   ( AjAxq"Aj6    ) 7   ( "Aj6    4 7   ( "Aj6    5 7   ( AjAxq"Aj6    + 9       5 @  P\r @ Aj"  §Aq- ±  r:    B" B R\r  . @  P\r @ Aj"  §AqA0r:    B" B R\r  {~@  BT\r @ Aj"  " B\n" B\n~}§A0r:   BÿÿÿÿV\r @  P\r   §!@ Aj"  A\nn"A\nlkA0r:   A	K! ! \r  # Ak"$ @  L\r  AÀq\r     k"A AI" @ \r @   Aº  A~j"AÿK\r     º  Aj$      A A ¸ Ä~~|# A°k"$ A ! A 6,@@ Ä "BU\r A!	AÌ !\n "Ä !@ AqE\r A!	AÏ !\nAÒ AÍ  Aq"	!\n 	E!@@ Bøÿ Bøÿ R\r   A   	Aj" Aÿÿ{qÀ    \n 	º   A A¢  A q"AÒ AÖ    bAº   A    AÀ sÀ     J!\r Aj!@@@@  A,j· "  "D        a\r   (,"Aj6, A r"Aá G\r A r"Aá F\rA  A H! (,!  Acj"6,A  A H! D      °A¢! A0jA A  A Hj"!@  ü"6  Aj!  ¸¡D    eÍÍA¢"D        b\r @@ AN\r  ! ! ! ! !@ A AI!@ A|j" I\r  ­!B !@  5   |" BëÜ"BëÜ~}>  A|j" O\r  BëÜT\r  A|j" > @@ " M\r A|j"( E\r   (, k"6, ! A J\r @ AJ\r  AjA	nAj! Aæ F!@A  k"A	 A	I!\r@@  I\r A A ( !AëÜ \rv!A \rtAs!A ! !@  ( " \rv j6   q l! Aj" I\r A A ( ! E\r   6  Aj!  (, \rj"6,   j" " Atj   kAu J! A H\r A !@  O\r   kAuA	l!A\n! ( "A\nI\r @ Aj!  A\nl"O\r @ A   Aæ Fk A G Aç Fqk"  kAuA	lAwjN\r  A0jA`A¤b A Hj AÈ j"A	m"Atj!\rA\n!@  A	lk"AJ\r @ A\nl! Aj"AG\r  \rAj!@@ \r( "  n" lk"\r   F\r@@ Aq\r D      @C! AëÜG\r \r M\r \rA|j-  AqE\rD     @C!D      à?D      ð?D      ø?  FD      ø?  Av"F  I!@ \r  \n-  A-G\r  ! ! \r  k"6     a\r  \r  j"6 @ AëÜI\r @ \rA 6 @ \rA|j"\r O\r  A|j"A 6  \r \r( Aj"6  AÿëÜK\r   kAuA	l!A\n! ( "A\nI\r @ Aj!  A\nl"O\r  \rAj"   K!@@ " M"\r A|j"( E\r @@ Aç F\r  Aq! AsA A " J A{Jq"\r j!AA~ \r j! Aq"\r Aw!@ \r  A|j( "\rE\r A\n!A ! \rA\np\r @ "Aj! \r A\nl"pE\r  As!  kAuA	l!@ A_qAÆ G\r A !   jAwj"A  A J"  H!A !   j jAwj"A  A J"  H!A!\r AýÿÿÿAþÿÿÿ  r"J\r  A GjAj!@@ A_q"AÆ G\r   AÿÿÿÿsJ\r A  A J!@   Au"s k­ ¿ "kAJ\r @ Aj"A0:    kAH\r  A~j" :  A!\r AjA-A+ A H:    k" AÿÿÿÿsJ\rA!\r  j" 	AÿÿÿÿsJ\r  A    	j" À    \n 	º   A0   AsÀ @@@@ AÆ G\r  AjA	r!    K"!@ 5  ¿ !@@  F\r   AjM\r@ Aj"A0:    AjK\r   G\r  Aj"A0:       kº  Aj" M\r @ E\r   Aß Aº   O\r AH\r@@ 5  ¿ " AjM\r @ Aj"A0:    AjK\r     A	 A	Hº  Awj! Aj" O\r A	J! ! \r @ A H\r   Aj  K!\r AjA	r! !@@ 5  ¿ " G\r  Aj"A0:  @@  F\r   AjM\r@ Aj"A0:    AjK\r    Aº  Aj!  rE\r   Aß Aº      k"   Jº   k! Aj" \rO\r AJ\r   A0 AjAA À      kº  !  A0 A	jA	A À   A    AÀ sÀ     J!\r \n AtAuA	qj!@ AK\r A k!D      0@!@ D      0@¢! Aj"\r @ -  A-G\r    ¡ !    ¡!@ (," Au"s k­ ¿ " G\r  Aj"A0:   (,! 	Ar! A q! A~j" Aj:   AjA-A+ A H:   AH AqEq! Aj!@ " ü"A± j-   r:    ·¡D      0@¢!@ Aj" AjkAG\r  D        a q\r  A.:  Aj! D        b\r A!\r Aûÿÿÿ 	  k"jkJ\r   A    j Aj  Ajk" A~j H  "j" À     º   A0   AsÀ    Aj º   A0  kA A À     º   A    AÀ sÀ     J!\r A°j$  \r.  ( AjAxq"Aj6    )  )Ú 9    ½# A k"$     Aj " 6   A Gk6 A Aü  A6L A 6$ A6P  Aj6,  Aj6T  A :     Á ! A j$  ¶  (T"( !@ ("  (  ("k"  I"E\r       (  j"6   ( k"6@    I"E\r       (  j"6   ( k6 A :      (,"6   6  @  \r A    6 A¬A!@@  E\r  Aÿ M\r@@A ( ( \r  AqA¿F\r A6 @ AÿK\r    A?qAr:    AvAÀr:  A@@ A°I\r  A@qAÀG\r   A?qAr:    AvAàr:     AvA?qAr: A@ A|jAÿÿ?K\r    A?qAr:    AvAðr:     AvA?qAr:    AvA?qAr: A A6 A!    :  A @  \r A    A È ø&# Ak"$ @@@@@  AôK\r @A (¸É "A  AjAøq  AI"Av"v" AqE\r @@  AsAq j"At"AàÉ j" (èÉ "(" G\r A  A~ wq6¸É   A (ÈÉ I\r  ( G\r   6   6 Aj!   Ar6  j" (Ar6 A (ÀÉ "M\r@  E\r @@   tA t" A   krqh"At"AàÉ j" (èÉ " ("G\r A  A~ wq"6¸É  A (ÈÉ I\r (  G\r  6  6   Ar6   j"  k"Ar6   j 6 @ E\r  AxqAàÉ j!A (ÌÉ !@@ A Avt"q\r A   r6¸É  ! ("A (ÈÉ I\r  6  6  6  6  Aj! A  6ÌÉ A  6ÀÉ A (¼É "	E\r 	hAt(èË "(Axq k! !@@@ (" \r  (" E\r  (Axq k"   I"!    !  !  A (ÈÉ "\nI\r (!@@ ("  F\r  (" \nI\r ( G\r  ( G\r   6   6@@@ ("E\r  Aj! ("E\r Aj!@ ! " Aj!  ("\r   Aj!  ("\r   \nI\r A 6 A ! @ E\r @@  ("At"(èË G\r  AèË j  6   \rA  	A~ wq6¼É   \nI\r@@ ( G\r    6   6  E\r   \nI\r   6@ ("E\r   \nI\r   6   6 ("E\r   \nI\r   6   6@@ AK\r    j" Ar6   j"   (Ar6  Ar6  j" Ar6  j 6 @ E\r  AxqAàÉ j!A (ÌÉ ! @@A Avt" q\r A   r6¸É  ! (" \nI\r   6   6   6   6A  6ÌÉ A  6ÀÉ  Aj! A!  A¿K\r   Aj"Axq!A (¼É "E\r A!@  AôÿÿK\r  A& Avg" kvAq  AtkA>j!A  k!@@@@ At(èË "\r A ! A !A !  A A Avk AFt!A !@@ (Axq k" O\r  ! ! \r A ! ! !    ("   AvAqj("F   !  At! ! \r @   r\r A !A t" A   kr q" E\r  hAt(èË !   E\r@  (Axq k" I!@  ("\r   (!   !    ! !  \r  E\r  A (ÀÉ  kO\r  A (ÈÉ "I\r (!@@ ("  F\r  (" I\r ( G\r  ( G\r   6   6@@@ ("E\r  Aj! ("E\r Aj!@ ! " Aj!  ("\r   Aj!  ("\r   I\r A 6 A ! @ E\r @@  ("At"(èË G\r  AèË j  6   \rA  A~ wq"6¼É   I\r@@ ( G\r    6   6  E\r   I\r   6@ ("E\r   I\r   6   6 ("E\r   I\r   6   6@@ AK\r    j" Ar6   j"   (Ar6  Ar6  j" Ar6  j 6 @ AÿK\r  AøqAàÉ j! @@A (¸É "A Avt"q\r A   r6¸É   !  (" I\r   6  6   6  6A! @ AÿÿÿK\r  A& Avg" kvAq  AtrA>s!    6 B 7  AtAèË j!@@@ A  t"q\r A   r6¼É   6   6 A A  Avk  AFt!  ( !@ "(Axq F\r  Av!  At!   Aqj"("\r  Aj"  I\r   6   6  6  6  I\r ("  I\r   6  6 A 6  6   6 Aj! @A (ÀÉ "  I\r A (ÌÉ !@@   k"AI\r   j" Ar6   j 6   Ar6   Ar6   j"   (Ar6A !A !A  6ÀÉ A  6ÌÉ  Aj! @A (ÄÉ " M\r A   k"6ÄÉ A A (ÐÉ "  j"6ÐÉ   Ar6   Ar6  Aj! @@A (Í E\r A (Í !A B7Í A B 7Í A  AjApqAØªÕªs6Í A A 6¤Í A A 6ôÌ A !A !   A/j"j"A  k"q" M\rA ! @A (ðÌ "E\r A (èÌ " j" M\r  K\r@@@A - ôÌ Aq\r @@@@@A (ÐÉ "E\r AøÌ ! @@   ( "I\r     (jI\r  (" \r A Ó "AF\r !@A (Í " Aj" qE\r   k  jA   kqj!  M\r@A (ðÌ " E\r A (èÌ " j" M\r   K\r Ó "  G\r  k q"Ó "  (   (jF\r !   AF\r@  A0jI\r   !  kA (Í "jA  kq"Ó AF\r  j!  ! AG\rA A (ôÌ Ar6ôÌ  Ó !A Ó !  AF\r  AF\r   O\r   k" A(jM\rA A (èÌ  j" 6èÌ @  A (ìÌ M\r A   6ìÌ @@@@A (ÐÉ "E\r AøÌ ! @   ( "  ("jF\r  (" \r @@A (ÈÉ " E\r    O\rA  6ÈÉ A ! A  6üÌ A  6øÌ A A6ØÉ A A (Í 6ÜÉ A A 6Í @  At" AàÉ j"6èÉ   6ìÉ   Aj" A G\r A  AXj" Ax kAq"k"6ÄÉ A   j"6ÐÉ   Ar6   jA(6A A ( Í 6ÔÉ   O\r   I\r   (Aq\r     j6A  Ax kAq" j"6ÐÉ A A (ÄÉ  j"  k" 6ÄÉ    Ar6  jA(6A A ( Í 6ÔÉ @ A (ÈÉ O\r A  6ÈÉ   j!AøÌ ! @@@  ( " F\r  (" \r   - AqE\rAøÌ ! @@@   ( "I\r     (j"I\r  (!  A  AXj" Ax kAq"k"6ÄÉ A   j"6ÐÉ   Ar6   jA(6A A ( Í 6ÔÉ   A\' kAqjAQj"    AjI"A6 A )Í 7 A )øÌ 7A  Aj6Í A  6üÌ A  6øÌ A A 6Í  Aj! @  A6  Aj!  Aj!   I\r   F\r   (A~q6   k"Ar6  6 @@ AÿK\r  AøqAàÉ j! @@A (¸É "A Avt"q\r A   r6¸É   !  ("A (ÈÉ I\r   6  6A!A!A! @ AÿÿÿK\r  A& Avg" kvAq  AtrA>s!    6 B 7  AtAèË j!@@@A (¼É "A  t"q\r A   r6¼É   6   6 A A  Avk  AFt!  ( !@ "(Axq F\r  Av!  At!   Aqj"("\r  Aj" A (ÈÉ I\r   6   6A!A! ! !  A (ÈÉ "I\r ("  I\r   6  6   6A ! A!A!  j 6   j  6 A (ÄÉ "  M\r A    k"6ÄÉ A A (ÐÉ "  j"6ÐÉ   Ar6   Ar6  Aj!  A06 A ! «     6     ( j6   Ë !  Aj$   \n  Ax  kAqj" Ar6 Ax kAqj"  j"k! @@@ A (ÐÉ G\r A  6ÐÉ A A (ÄÉ   j"6ÄÉ   Ar6@ A (ÌÉ G\r A  6ÌÉ A A (ÀÉ   j"6ÀÉ   Ar6  j 6 @ ("AqAG\r  (!@@ AÿK\r @ (" AøqAàÉ j"F\r  A (ÈÉ I\r ( G\r@  G\r A A (¸É A~ Avwq6¸É @  F\r  A (ÈÉ I\r ( G\r  6  6 (!@@  F\r  ("A (ÈÉ I\r ( G\r ( G\r  6  6@@@ ("E\r  Aj! ("E\r Aj!@ !	 "Aj! ("\r  Aj! ("\r  	A (ÈÉ I\r 	A 6 A ! E\r @@  ("At"(èË G\r  AèË j 6  \rA A (¼É A~ wq6¼É  A (ÈÉ I\r@@ ( G\r   6  6 E\r A (ÈÉ "I\r  6@ ("E\r   I\r  6  6 ("E\r   I\r  6  6 Axq"  j!   j"(!  A~q6   Ar6   j  6 @  AÿK\r   AøqAàÉ j!@@A (¸É "A  Avt" q\r A    r6¸É  !  (" A (ÈÉ I\r  6   6  6   6A!@  AÿÿÿK\r   A&  Avg"kvAq AtrA>s!  6 B 7 AtAèË j!@@@A (¼É "A t"q\r A   r6¼É   6   6  A A Avk AFt! ( !@ "(Axq  F\r Av! At!  Aqj"("\r  Aj"A (ÈÉ I\r  6   6  6  6 A (ÈÉ " I\r ("  I\r  6  6 A 6  6  6 Aj«  Ä\n@@  E\r   Axj"A (ÈÉ "I\r  A|j( "AqAF\r  Axq" j!@ Aq\r  AqE\r  ( "k" I\r   j! @ A (ÌÉ F\r  (!@ AÿK\r @ (" AøqAàÉ j"F\r   I\r ( G\r@  G\r A A (¸É A~ Avwq6¸É @  F\r   I\r ( G\r  6  6 (!@@  F\r  (" I\r ( G\r ( G\r  6  6@@@ ("E\r  Aj! ("E\r Aj!@ ! "Aj! ("\r  Aj! ("\r   I\r A 6 A ! E\r@@  ("At"(èË G\r  AèË j 6  \rA A (¼É A~ wq6¼É   I\r@@ ( G\r   6  6 E\r  I\r  6@ ("E\r   I\r  6  6 ("E\r  I\r  6  6 ("AqAG\r A   6ÀÉ   A~q6   Ar6   6   O\r ("AqE\r@@ Aq\r @ A (ÐÉ G\r A  6ÐÉ A A (ÄÉ   j" 6ÄÉ    Ar6 A (ÌÉ G\rA A 6ÀÉ A A 6ÌÉ @ A (ÌÉ "	G\r A  6ÌÉ A A (ÀÉ   j" 6ÀÉ    Ar6   j  6  (!@@ AÿK\r @ (" AøqAàÉ j"F\r   I\r ( G\r@  G\r A A (¸É A~ Avwq6¸É @  F\r   I\r ( G\r  6  6 (!\n@@  F\r  (" I\r ( G\r ( G\r  6  6@@@ ("E\r  Aj! ("E\r Aj!@ ! "Aj! ("\r  Aj! ("\r   I\r A 6 A ! \nE\r @@  ("At"(èË G\r  AèË j 6  \rA A (¼É A~ wq6¼É  \n I\r@@ \n( G\r  \n 6 \n 6 E\r  I\r  \n6@ ("E\r   I\r  6  6 ("E\r   I\r  6  6  Axq  j" Ar6   j  6   	G\rA   6ÀÉ   A~q6   Ar6   j  6 @  AÿK\r   AøqAàÉ j!@@A (¸É "A  Avt" q\r A    r6¸É  !  ("  I\r  6   6  6   6A!@  AÿÿÿK\r   A&  Avg"kvAq AtrA>s!  6 B 7 AtAèË j!@@@@A (¼É "A t"q\r A   r6¼É   6 A! A!  A A Avk AFt! ( !@ "(Axq  F\r Av! At!  Aqj"("\r  Aj"  I\r   6 A! A! ! ! !  I\r (" I\r  6  6A !A! A!  j 6   6   j 6 A A (ØÉ Aj"A 6ØÉ «  @  \r  Ê @ A@I\r  A06 A @  AxjA AjAxq AIÎ "E\r  Aj@ Ê "\r A    A|Ax  A|j( "Aq Axqj"   I   Ì  		@@  A (ÈÉ "I\r   ("Aq"AF\r  Axq"E\r    j"("AqE\r @ \r A ! AI\r@  AjI\r   !  kA (Í AtM\rA !@  I\r @  k"AI\r     AqrAr6   j" Ar6  (Ar6  Ñ   A !@ A (ÐÉ G\r A (ÄÉ  j" M\r    AqrAr6   j"  k"Ar6A  6ÄÉ A  6ÐÉ   @ A (ÌÉ G\r A !A (ÀÉ  j" I\r@@  k"AI\r     AqrAr6   j" Ar6   j" 6   (A~q6   Aq rAr6   j" (Ar6A !A !A  6ÌÉ A  6ÀÉ   A ! Aq\r Axq j" I\r (!@@ AÿK\r @ (" AøqAàÉ j"	F\r   I\r ( G\r@  G\r A A (¸É A~ Avwq6¸É @  	F\r   I\r ( G\r  6  6 (!\n@@  F\r  (" I\r ( G\r ( G\r  6  6@@@ ("E\r  Aj! ("E\r Aj!@ !	 "Aj! ("\r  Aj! ("\r  	 I\r 	A 6 A ! \nE\r @@  ("At"(èË G\r  AèË j 6  \rA A (¼É A~ wq6¼É  \n I\r@@ \n( G\r  \n 6 \n 6 E\r  I\r  \n6@ ("E\r   I\r  6  6 ("E\r   I\r  6  6@  k"AK\r    Aq rAr6   j" (Ar6      AqrAr6   j" Ar6   j" (Ar6  Ñ   «   ±A!@@  A  AK" Ajq\r  ! @ " At!   I\r @ A@  kI\r  A06 A @A AjAxq AI"  jAjÊ "\r A  Axj!@@  Aj q\r  !  A|j"( "Axq   jAjA   kqAxj"A     kAKj"  k"k!@ Aq\r  ( !   6    j6      (AqrAr6   j" (Ar6   ( AqrAr6   j" (Ar6  Ñ @  ("AqE\r  Axq" AjM\r     AqrAr6   j"  k"Ar6   j" (Ar6  Ñ   Ajx@@@ AG\r  Ê !A! Aq\r Av"E\r iAK\r@ A@ kM\r A0 A AK Ï !@ \r A0   6 A ! ø	   j!@@@@  ("AqE\r A (ÈÉ ! AqE\r    ( "k" A (ÈÉ "I\r  j!@  A (ÌÉ F\r   (!@ AÿK\r @  (" AøqAàÉ j"F\r   I\r (  G\r@  G\r A A (¸É A~ Avwq6¸É @  F\r   I\r (  G\r  6  6  (!@@   F\r   (" I\r (  G\r (  G\r  6  6@@@  ("E\r   Aj!  ("E\r  Aj!@ ! "Aj! ("\r  Aj! ("\r   I\r A 6 A ! E\r@@    ("At"(èË G\r  AèË j 6  \rA A (¼É A~ wq6¼É   I\r@@ (  G\r   6  6 E\r  I\r  6@  ("E\r   I\r  6  6  ("E\r  I\r  6  6 ("AqAG\r A  6ÀÉ   A~q6   Ar6  6   I\r@@ ("Aq\r @ A (ÐÉ G\r A   6ÐÉ A A (ÄÉ  j"6ÄÉ    Ar6  A (ÌÉ G\rA A 6ÀÉ A A 6ÌÉ @ A (ÌÉ "	G\r A   6ÌÉ A A (ÀÉ  j"6ÀÉ    Ar6   j 6  (!@@ AÿK\r @ (" AøqAàÉ j"F\r   I\r ( G\r@  G\r A A (¸É A~ Avwq6¸É @  F\r   I\r ( G\r  6  6 (!\n@@  F\r  (" I\r ( G\r ( G\r  6  6@@@ ("E\r  Aj! ("E\r Aj!@ ! "Aj! ("\r  Aj! ("\r   I\r A 6 A ! \nE\r @@  ("At"(èË G\r  AèË j 6  \rA A (¼É A~ wq6¼É  \n I\r@@ \n( G\r  \n 6 \n 6 E\r  I\r  \n6@ ("E\r   I\r  6  6 ("E\r   I\r  6  6   Axq j"Ar6   j 6    	G\rA  6ÀÉ   A~q6   Ar6   j 6 @ AÿK\r  AøqAàÉ j!@@A (¸É "A Avt"q\r A   r6¸É  ! (" I\r   6   6   6   6A!@ AÿÿÿK\r  A& Avg"kvAq AtrA>s!   6  B 7 AtAèË j!@@@A (¼É "A t"q\r A   r6¼É    6    6 A A Avk AFt! ( !@ "(Axq F\r Av! At!  Aqj"("\r  Aj" I\r   6    6    6    6  I\r (" I\r   6   6  A 6   6   6«   ? Atd~@@  ­B|BøÿÿÿA (  " ­|"BÿÿÿÿV\r Ò  §"O\r  \r A06 AA  6    S~@@ AÀ qE\r   A@j­!B ! E\r  AÀ  k­  ­"!  !   7    7S~@@ AÀ qE\r   A@j­!B ! E\r  AÀ  k­  ­"!  !   7    7  A $ A AjApq$  # # k #  # ©~# A k"$  Bÿÿÿÿÿÿ?!@@ B0Bÿÿ"§"AÿjAýK\r   B< B! Aj­!@@  Bÿÿÿÿÿÿÿÿ" BT\r  B|!  BR\r  B |!B   BÿÿÿÿÿÿÿV"!  ­ |!@   P\r  BÿÿR\r   B< BB! Bÿ!@ AþM\r Bÿ!B ! @Aø Aø  P"" k"Að L\r B ! B !  BÀ  !A !@  F\r  Aj   A kÔ  ) )B R!     Õ  ) "B< )B! @@ Bÿÿÿÿÿÿÿÿ ­"BT\r   B|!  BR\r   B  |!   B    BÿÿÿÿÿÿÿV"!  ­! A j$  B4 B  ¿& @A (¨Í \r A  6¬Í A   6¨Í \n   $  #        kß @ A÷ÿÿÿO\r @@ A\nK\r    :  Ar"Ajò !   Axj6   6    6 !   k!@  F\r  E\r     ü\n     jA :  à   A¼ á  A !A A 6¨Í A     !A (¨Í ! A A 6¨Í @  AF\r  Aü¶ A    ! Ý           ø "Aè¶ Aj6   A³# Ak"$   : @@  ("\r @   E\r A!  (!@  (" F\r   (P Aÿq"F\r    Aj6  :  @   AjA  ($  AF\r A! - ! Aj$  9# Ak"$   6     Å ! Aj$  >@   F\r @   Aj"O\r  -  !   -  :    :    Aj!   A¼ è  A !A A 6¨Í A     !A (¨Í ! A A 6¨Í @  AF\r  A°· A    ! Ý       @ A¿=K\r @ AÎ K\r @ Aã K\r @ A	K\r    A0r:    Aj   At/Ð± ;    Aj@ AçK\r    AÿÿqAä n"A0r:      Aä lkAÿÿqAt/Ð± ;   Aj   ê @ AK\r    ë    ì @ AÿÁ×/K\r @ Aÿ¬âK\r    í    î @ AÿëÜK\r    ï    ð 8   Aä n"At/Ð± ;      Aä lkAt/Ð± ;   Aj*   AÎ n"A0j:    Aj  AÎ lkê 1   AÎ n"At/Ð± ;    Aj  AÎ lkê *   AÀ=n"A0j:    Aj  AÀ=lkì 1   AÀ=n"At/Ð± ;    Aj  AÀ=lkì ,   AÂ×/n"A0j:    Aj  AÂ×/lkî 3   AÂ×/n"At/Ð± ;    Aj  AÂ×/lkî T# Ak"$ A !@  Aq\r    p\r  Aj   Ð ! A  (  ! Aj$  H  A  AK!@@ Ê " \r@ " E\r     ö    \n   Ì \n   ó $      jAjA   kq"  Kñ # A ¬ A¶ A   S ´ "A\rjò "A 6  6  6  Aj!@ Aj"E\r    ü\n     6   s   A¤¶ Aj6 A A 6¨Í A   Aj  A (¨Í !A A 6¨Í @ AF\r    !Ý   «      A¸¶ Aj6  ( ! , !A A 6¨Í A   Aj   A H A (¨Í !A A 6¨Í @ AF\r    !Ý   «    s   A¸¶ Aj6 A A 6¨Í A   Aj  A (¨Í !A A 6¨Í @ AF\r    !Ý   «    ¦@ Aöÿÿÿ kK\r   , A H!  ( !	A÷ÿÿÿ!\n@ AòÿÿÿK\r A  j" At"\n  \nK"ArAj AI!\n 	   !	 \nò !@ E\r  E\r   	 ü\n  @ E\r  E\r   j  ü\n     j"k!@  F\r  E\r   j j 	 j j ü\n  @ Aj"AF\r  	 ô    6    \nAxr6    j j"6  jA :  à        ´ ý @  (  , " A H"" I\r @@  (AÿÿÿÿqAjA\n " k I\r  E\r  (    A H!@  F\r   j!@  k"E\r   j  ü\n    A    jIA   Oj!@ E\r   j  ü\n    j!@@  , AJ\r    6   Aÿ q:   jA :         j k  A   û   ç  2A!@  I\r    j   kÿ "  kA !      µ H@  (  (  ("  ("    I¥ "\r A !   F\r AA   I! I# A k"$  Aj Aj A j     Aj (Þ  A j$ E# Ak"$  Aj       (6    (6 Aj$ 6 @  F\r  AJ\r  A-:  A  k! Aj!      E@@  k"A	J\r A=!   J\rA !  é !   6   6 )A   ArgkAÑ	lAv"   At( ± IkAjA A 6¨Í A   AjA|q" ! A (¨Í !A A 6¨Í @@ AF\r   E\r@ E\r   A  ü   AjA  ! Ý       Y A A 6¨Í A   Ahj A (¨Í ! A A 6¨Í @  AF\r A  ! Ý      @  E\r   Ahj"   ( Aj6 î@@  E\r @  Ahj"( \r A A 6¨Í A A Aæ AAÖ  A (¨Í ! A A 6¨Í   AF\r   ( "Aj6  AG\r   Auj-  \r @  Apj( "E\r A A 6¨Í     A (¨Í !A A 6¨Í  AF\r   A  ! Ý          {@@ (L"A H\r  E\r Aÿÿÿÿq© (G\r@  Aÿq" (PF\r  (" (F\r   Aj6   :     ä     @ AÌ j" E\r  ã @@  Aÿq" (PF\r  (" (F\r   Aj6   :    ä !@  AqE\r        ( "Aÿÿÿÿ 6    ( !  A 6  \r   A¡ W# Ak"$ A AAA ( "   6    Á A\n  «   A (¤   ä A A 6¨Í    A (¨Í ! A A 6¨Í @@  AF\r A A 6¨Í A A¶ A  A (¨Í ! A A 6¨Í   AG\rA  ! Ý    A A 6¨Í A AÜ A  A (¨Í ! A A 6¨Í   AG\r A  ! Ý      A (°Í  A³ A   +@A  A  AK"õ " \r   !    # A k"$   AjAv!@A (´Í " \r A Aô6ÌÍ AÌÍ ! A AÌÍ 6´Í  Aj!A !@@@@  AÀÑ G\r A !  Aj"Aq\r@  /" kAqA   K j" O\r     k";   AÿÿqAtj"  ;  A ;   Aj"AqE\r Aµ 6 A§6 Aê 6 AÙ      O\r  / !@@ \r A  AtAÀÍ j6´Í   ;   A ;  A j$   Aµ 6 A6 Aê 6AÙ  Aj    !  / AtAÀÍ j!  , @  AÀÍ I\r   AÀÑ O\r      Ì ß  A~j!  A|j!A !A (´Í "!@@ " E\r  AÀÑ F\r@    /"Atj G\r    /  j;@  / "Atj  G\r    j; @ \r A  6´Í    / ;   AÀÍ kAv;   / AtAÀÍ j!  !   AÀÍ kAv; A  6´Í \n   ¸      ¸ Aô    ¸ Aô 3 @ \r   ( (F@   G\r A  ( (¯ E# AÐ k"$ @@@  ( (G\r A!A ! A³ AÈ³ A   "E\r  ( "E\r AjA A8ü  A: K A6    6  6 A6D  Aj A ( (  @ (,"AG\r   ($6  AF! AÐ j$   Aë 6 Aç6 A¦ 6 AÙ    ø# AÀ k"$     ( "Axj( "j!@@ A|j( "( (G\r A !@ A H\r  A  A  kF! A~F\r B 7  6  6   6  6 B 7 B 7$ B 7, A 6< B74  Aj  AA  ( (   A  (AF!@ A H\r    k" H\r  B 7  6  6  6  6 B 7 B 7$ B 7, A 6< B74  Aj  AA  ( (   (\r B 7  6  6   6  6 B 7 B 7$ B 7, B 7 3 A 6< A: ;  Aj AA  ( (  A !@@ ((  (A  ($AFA  ( AFA  (,AF!@ (AF\r @ (,E\r A !@ ( AF\r A !A ! ($AG\r (! AÀ j$  w@ ($"\r   6  6 A6$  (86@@ ( (8G\r  ( G\r  (AG\r  6 A: 6 A6  Aj6$# @  ( ((G\r     ¡ D @  ( ((G\r     ¡   ("      ( (    A: 5@  (G\r  A: 4@@ ("\r  A6$  6  6 AG\r (0AF\r@  G\r @ ("AG\r   6 ! (0AG\r AF\r  ($Aj6$ A: 6ª @@   (  E\r   (G\r (AF\r  6@   (   E\r @@  (F\r   (G\r AG\r A6   6 @ (,AF\r  A ;4  ("    A   ( (  @ - 5AG\r  A6, - 4E\r A6,  6  ((Aj6( ($AG\r (AG\r A: 6  ("       ( (  ± @@   (  E\r   (G\r (AF\r  6   (   E\r @@  (F\r   (G\r AG\r A6   6  6   ((Aj6(@ ($AG\r  (AG\r  A: 6 A6,L @   (  E\r      ¤   ("        ( (  \' @   (  E\r      ¤ Z# Ak"$   ( 6@    Aj  ( (  " E\r   (6  Aj$   E@  Alj( "E\r  Að· A¨´ A   E\r   (   Axj( "  Ahj       AÜµ Aj6      «   Aô  Aç $   A¤¶ Aj6   Aj°   « 4  ( "A|j" ( Aj"6 @ AJ\r  Atjó      ¯   Aô    ($   A¸¶ Aj6   Aj°   «    ³   Aô    (   ¯   Aô    ¯   Aô    \n   $ #   kApq"$   # µ# A°$k"$ @@@@@  E\r  E\r \rA !  E\r A}6   ´ !  Aôj6p  Aô j"6l  6h   6`    j6d A Aü   Aj6ü  Aj" 6ø   6ô  A Aü  B 7  A¬j6  Aj" 6   6 B 7 B 7 B 7¤ B 7¸  AÈj6´  A¸j" 6°   6¬ B 7À B 7Ô  Aäj6Ð  AÔj" 6Ì   6È B 7Ü A;ä A6è A : æ A 6ü B 7ô B 7ì  Aøj"6ø# A6H Aå 6D  )D78@@@@@@@@@ Aà j A8j½ \r  A6¬$ Aä 6¨$  )¨$70 Aà j A0j½ E\rA A 6¨Í A¨  Aà j !A (¨Í ! A A 6¨Í   AF\r E\r@ (d" (`"G\r  !  -  A.G\r A¿ " A:     k6   6   6  AÜû 6     / AàqAÀ\nr;   (d6` A6¤$ Aã 6 $  ) $7(@@ Aà j A(j½ \r  A6$ Aâ 6$  )$7  Aà j A j½ E\rA ! A A 6¨Í A¨  Aà j !A (¨Í !A A 6¨Í  AF\r  6$ E\r A\r6$ A 6$  )$7 Aà j Aj½ E\rA ! A !@ (`" (dF\r A ! -  Aß G\r A!  Aj6` A$j Aà jA À @ E\r  ($E\r@ (d" (`"F\r  -  A.G\r  6` Aà jA  A$jÁ ! A A 6¨Í A©  Aà j ! A (¨Í !A A 6¨Í  AF\r  (d (`F\r ! Ý   E\rA !@ E\r  ( ! A6\\ B7T  6P A 6L  6H A¸ 6D (È (ÌF\r A® 6 A A 6¨Í  A6 Aµ 6A AÙ   A (¨Í ! A A 6¨Í   AF\r A~!A !  ! Ý A A 6¨Í Aª    AÄ j A (¨Í ! A A 6¨Í   AF\r AÄ jA Ä @ E\r   (L6  (H! A !@ E\r   6  Aà jÅ  A°$j$    ! Ý  Aà jÅ     ~# A k"$   (!   ( "6   k6  ) "7  )7  7 @ Aj Ð "E\r     (  B §j6  A j$   #~# Ak"$  AÄ j  Ò !@@@@@  ("  ( "F\r   k!@ -  "AÇ F\r  AÔ G\r@ AI\r @@@@@@@@@@ - "A¿j	\n\n\n\n\n  A­j	   Aj6 A !A A 6¨Í A«    !A (¨Í !A A 6¨Í  AF\r\r E\r  AjA¿ "A:   6 A6 A¢ 6 Aì¸ 6   / AàqAÀ\nr;    Aj6 A !A A 6¨Í A©    !A (¨Í !A A 6¨Í  AF\r E\r  AjA¿ "A:   6 A6 Aº 6 Aì¸ 6   / AàqAÀ\nr;    Aj6 A !A A 6¨Í A©    !A (¨Í !A A 6¨Í  AF\r E\r\n  AjA¿ "A:   6 A6 AÚ 6 Aì¸ 6   / AàqAÀ\nr; \n   Aj6 A !A A 6¨Í A©    !A (¨Í !A A 6¨Í  AF\r\n E\r	  AjA¿ "A:   6 A\r6 AÁ 6 Aì¸ 6   / AàqAÀ\nr; 	   Aj6 A !A A 6¨Í A©    !A (¨Í !A A 6¨Í  AF\r	 E\r  AjA¿ "A:   6 A6 A 6 Aì¸ 6   / AàqAÀ\nr;    Aj6 A !A A 6¨Í A©    !A (¨Í !A A 6¨Í  AF\r E\r A,j  AÀ  (0E\r  ( "  (F\r -  Aß G\r   Aj6 A !A A 6¨Í A©    !A (¨Í !A A 6¨Í  AF\r E\r  AjA¿ "A:   6  6 A¸º 6   / AàqAÀ\nr;    Aj6 A !A A 6¨Í A¬   A  !A (¨Í !A A 6¨Í  AF\r  6, E\r  AÏ  A,jÁ !   Aj6 A !A A 6¨Í A¬   A  !A (¨Í !A A 6¨Í  AF\r E\r  AjA¿ "A:   6 A(6 Añ 6 Aì¸ 6   / AàqAÀ\nr;  Aã F\r   Aj"6 A !A !@  F\r  -  Aö F!  Õ \rA !A A 6¨Í A¨    !A (¨Í !A A 6¨Í  AF\r E\r  AjA¿ "A:  Aì¸ 6   / AàqAÀ\nr; @ E\r   6 A6 A 6  6 A6 Aþ 6A ! AI\r@@@ - "A®j    Aj6 A !A A 6¨Í A¬   A  !A (¨Í !A A 6¨Í  AF\r E\r  AjA¿ "A:   6 A6 AÆ 6 Aì¸ 6   / AàqAÀ\nr;    Aj6 A !A A 6¨Í A¬   A  !A (¨Í !A A 6¨Í  AF\r E\r   A,jÖ !@@  ( "  (F\r  -  Aß G\r    Aj6 A ! E\r  AjA¿ "A:   6 A6 A 6 Aì¸ 6   / AàqAÀ\nr;  AÉ G\r   Aj6 A ! A 6,   A,j× \r (,"E\r  AjA¿ "A:   6 A6 AÓ 6 Aì¸ 6   / AàqAÀ\nr;    6@A ! A : 4 A 60 A ;,  (è!  (ì! A : <A A 6¨Í    kAu68A¬    A,j !A (¨Í !A A 6¨Í @@ AF\r  E\r  Aèj! (8"  (ì  (èkAu"	  	K!\n  AÌj! !@@@@  \nF\rA A 6¨Í A­    !A (¨Í !A A 6¨Í  AF\r  (Ì  (ÐF\r ( (!A A 6¨Í A®  A  !A (¨Í !A A 6¨Í  AF\r ( E\rA A 6¨Í A®  A  !A (¨Í !A A 6¨Í  AF\r  ( "( ( kAuO\rA A 6¨Í A®  A  !A (¨Í !A A 6¨Í  AF\r ( !A A 6¨Í A¯    !A (¨Í !A A 6¨Í  AF\r ( !A A 6¨Í A­    !A (¨Í !A A 6¨Í  AF\r (  6 Aj! @   (ì  (è"kAuM\r  AÕ 6 A A 6¨Í  A6 A 6A AÙ   A (¨Í ! A A 6¨Í   AF\r     Atj6ìA !  	I\r@ AÀ jÛ E\r  ! A\r6( AÈ 6$  )$7A !A !\n@@@@@@@@   Aj½ E\r   Aj!  (  (kAu!@@@  ( "  (F\r  -  AÅ F\rA A 6¨Í A«    !A (¨Í !A A 6¨Í  AF\r  6 E\r  AjÜ     Aj6 A A 6¨Í A°  Aj    A (¨Í !A A 6¨Í  AF\r  AjA¿ !\n )!\r \nA\n:  \n \r7 \nAù 6  \n \n/ AàqAÀ\nr; @ - ,\r  - -AqE\r A !A A 6¨Í A©    !A (¨Í !A A 6¨Í  AF\r E\r@@  ( "  ("F\r  -  Aö G\r    Aj"6 A !A !  Aj!  Aj!  (  (k"Au!	 - <Aq!@A A 6¨Í A©    !A (¨Í !A A 6¨Í  AF\r  6 E\r@   (  (kG\r  E\r  A¿ "A× :   6 Aðù 6   / AàqAÀ\nr;   6  AjÜ @ AÀ jÛ \r   (  ( "F\r -  AÑ G\rA A 6¨Í A°  Aj   	 A (¨Í !A A 6¨Í  AF\r (! (!  (!  ( !A !@  F\r A ! -  AÑ G\r    Aj6 A !A A 6¨Í A±    !A (¨Í !A A 6¨Í  AF\r E\r  AjA(¿ !  (0! - 4!  AA AA ß " : $  6   6  \n6  6  6  6  6 Aèú 6 \n ! Ý  ! Ý \n ! Ý 	A ! ! Ý  ! Ý  ! Ý  ! Ý  ! Ý    Aj6 A !  Õ \r   Õ \r A !A A 6¨Í A¨    !A (¨Í !A A 6¨Í  AF\r E\r   AjA¿ "A:   6 A6 Aã 6 Aì¸ 6   / AàqAÀ\nr;  à  Aj$   ! Ý  à     °@@@  ( "(" AjApq"jAøO\r  !@ AùI\r  ArÊ "E\r ( ! A 6  6   6  AjA Ê "E\rA ! A 6  6    6    j6  jAj  ¸ (! ( "!@ E\r  !  F\r  ! -  Aî G\r   Aj"6 @@  G\r A !A !A !A ! ,  APjA	K\r @@@  F\r  ,  APjA	M\r !  k! !  Aj"6     6   6 a  AjA¿ !  ´ ! ( !  A:    6   6   6  Aì¸ 6     / AàqAÀ\nr;   ½%~# A0k"$  A 6@@@@@@@@@@  ("  ( "F\r   k!@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ -  "A¿j:!!&!!! !!! % !!!!!!!!!!	\n!!! \r!  Aò F"M\r$@ AA    j-  AÿqAÖ F"M\r    j-  AÿqAË Fj!  M\r$@  j-  A¼j %&%  Aj"M\r$  j-  "Aj"A	K\r#A tAqE\r#%   Aj6   A± á !(   Aj6   AÒ â !\'   Aj6   AÓ á !&   Aj6   A á !%   Aj6   A ã !$   Aj6   A ä !#   Aj6   AÆ å !"   Aj6   A½ æ !!   Aj6   A ç !    Aj6   Aù è !   Aj6   A· á !   Aj6   A® ä !   Aj6   A¤ é !   Aj6   AjA¿ "A:  A6 A 6 A°» 6   / AàqAÀ\nr;    Aj6   Aë ê !   Aj6   Aâ ë !   Aj6   A¶ å !   Aj6   A ì !   Aj6   A ã !   Aj6   Aô í !   Aj6   AÝ ç !   Aj6  A(j  î  (,E\r@  ( "  (F\r  -  AÉ G\r    Aj6   Â "E\r  ( "  (F\r -  AÅ G\r   Aj6   AjA¿ ! )(! A:   6  7 Aì 6   / AàqAÀ\nr; \r   A(jï !A ! AI\r@@@@@@@@@@@@@@@@@@@ - "A¿j8%%%%%%%%%%!%%%%%%%%%%%%%%\r %	%%%!%%\n!!%   Aj6   A é !$   Aj6   Aÿ í !#   Aj6   A é !"   Aj6   AÖ á !!   Aj6  A6 Aÿ 6  )7 @   ½ E\r   Aâ ð !!A ! A(j  A À    A(jñ !  ( "  (F\r  -  Aß G\r    Aj6   AjA¿ "A:   6 AÜ 6   / AàqAÀ\nr;  @ AG\r    Aj6   - !   Aj6 @@@@@@ Aj%%%%%% %  AÉ è !$  AÀ ò !#  A ì !"  A ð !!  A ã !   Aø ó !@ AG\r    Aj6  - !   Aj6 @@@@@@ Aj$$$$$$ $  AÝ è !#  AÔ ò !"  A¯ ì !!  A¦ ð !   A ã !  A ó !   Aj"6   F\r  k"AI\r -  AÿqAÄ G\r@ - "AÒ F\r  AÁ G\r@ AK\r    Aj6  - !   Aj6 @@@@@@ Aj$$$$$$ $  A© ë !#  A» ô !"  AÖ ã !!  A ó !   Aâ õ !  Aó ö !@ AK\r    Aj6  - !   Aj6 @@@@@@ Aj###### #  A½ ë !"  AÏ ô !!  Aê ã !   A¡ ó !  Aö õ !  A ö !   Aj"6 @@  F\r  ,  APjA	K\r  A(j  A À    A(jñ !  ÷ "E\r  ( "  (F\r -  Aß G\r   Aj6   AjA¿ "A :   AÂ F:   6 AÌ 6   / AàqAÀ\nr;    Aj6   Aû ê !   Aj6   Aò ê !   Aj6   AÚ â !   Aj6   AÇ á !   Aj6   AÀ æ !   Aj6 A !  A Ô "E\r  AjA¿ "A:  AA Aë F" 6 AÆ A¿   6  6 A¸ 6   / AàqAÀ\nr;    Aj6   AÃ æ !  ø ! A6, Aû 6(  )(7A !   Aj½ E\r@@  (  ( "F\r  ,  "A1H\r @ A9K\r A ! Aj  A À     Ajñ "6$  ( "  ("F\r -  Aß G\r   Aj"6 @  F\r  -  Að G\r    Aj6   AjA¿ "A:   6 A° 6   / AàqAÀ\nr;    Â "6 E\r   Aj A$jù ! Aß F\r   ÷ "6A ! E\r  ( "  (F\r -  Aß G\r   Aj6    Â "6$ E\r   A$j Ajù !   Aj6   Â "E\r  AjA¿ "A:  A 6  6 A  6   / AàqAÀ\nr;    Aj6    Â "6( E\r   A(jú !   Aj"6 @@  F\r @ ,  APjA	K\r A ! A(j  A À    A(jñ !  ( "  (F\r -  Aß G\r Aj! -  Aß G\r  Aj!A !A !  ÷ "E\r  ( "  (F\r -  Aß G\r Aj!   6   Â "E\r	  AjA¿ AA A Aß " 6  6 A 6    Aj6 A !  Â "E\r\r  Â "E\r\r  AjA¿ A - AvAAß " 6  6 A 6 \r@ AI\r @ - "Aj  Aå F\r   û "6 E\r  - AG\r\r  (  ( "F\r\r -  AÉ G\r\r  Aj AjÜ A !   A ü "6( E\r   Aj A(jý !   Aj6   Â "E\r\r  AjA¿ A - AvAAß " 6 Aø 6    Aj6    Â "6( E\r A 6   A(j Ajþ !   Aj6    Â "6( E\r A6   A(j Ajþ !   Aj6   Â "E\r\n  AjA¿ "A:  A6 A¶ 6  6 A¸ 6   / AàqAÀ\nr;    Aj6   Â "E\r	  AjA¿ "A:  A\n6 A¥ 6  6 A¸ 6   / AàqAÀ\nr; @ AI\r  - Aô F\r A :    A  Ajÿ "6 E\r@  (  ( "G\r  - E\r\n - !@ -  AÉ G\r @ Aq"E\r   - AqE\r@ \r   Aj AjÜ    A ü "6( E\r	   Aj A(jý ! AqE\r	   !A !  6 AÏ F\r   !   !  6 E\r  Aj AjÜ A ! A0j$  B     ( (  @  / AÀqAÀ F\r     ( (  ,  AÆ     ("Aj6   (j :      Aj!@@  (#"E\r   ( 6#  F\r  Ì  @  (è"  AôjF\r  Ì   AÌjÈ   A jÉ   AjÊ   AjÊ   V@  ( j"  ("M\r    At" Aàj"  K"6    ( Í "6 \r «      @  ( "  AjF\r  Ì    @  ( "  AjF\r  Ì    @  ( "  AjF\r  Ì      Aô      ( (        ( ($    ~# A k"$ A !@ ("  (K\r    6 ) !   ) "7A !  BÿÿÿÿV\r   7  7 Aj Aj E! A j$      6    ´ 6  µ  B 7   6   B 7  B 7,  B 74  B 7<  B 7D    A j"6    Aj"6   6    AÌ j6(    A,j"6$   6   Aj AÌj    ( A j   ( " (Ì6Ð  ( 6¤  ×~# Ak"$ @@  ("  ( "F\r @@@@ ,  A¶jAw    Aj6 A !  ÷ "E\r  ( "  (F\r -  AÅ G\r   Aj6  !   Aj"6   Aj!  (  (kAu!@@@@  F\r  -  AÅ F\r   Ó "6 E\r  AjÜ   (!  ( !    Aj6     Ý   AjA¿ ! ) ! A):   7 A÷ 6   / AàqAÀ\nr; A !@  kAI\r  - AÚ G\r    Aj6 A !  ¾ "E\r  ( "  (F\r -  AÅ G\r   Aj6  !   !   E\r A !  A  "E\r  Ó "E\r  AjA¿ "A":   6  6 Aø 6   / AàqAÀ\nr;   Â ! Aj$  # Aà k"$ @@@@@@@  ("  ( "F\r @ -  "AÚ F\r  AÎ G\r   Aj"6 @@  F\r  -  AÈ F\r   !@ E\r   6@  ( "  ("F\r @ -  AÏ G\r    Aj"6  E\r	A! -  AÒ G\r A!   Aj"6  E\r E\rA !   Aj"6  E\rA!A!   Aj6    ¾ "6\\A ! E\r  ( "  ("F\r -  AÅ G\r   Aj"6 @  F\r  -  Aó G\r    Aj"6      6    Aß æ 6   AÜ j Aj ! Aj  Ò !@@@  ( "  (F\r  -  Aä G\r    Aj6  Aj  AÀ A !  ( "  (F\r -  Aß G\r   Aj6 A !A A 6¨Í A¬     !A (¨Í !A A 6¨Í  AF\r  6 E\r   AÜ j Aj !A !A A 6¨Í A¬     !A (¨Í !A A 6¨Í  AF\r  6 E\r     (   ( 6    AÜ j Aj ! à  !Ý A ! A : \\     AÜ jÿ "6 E\r@  (  ( "F\r  -  AÉ G\r @ - \\\r   Aj AjÜ A !    A Gü "6 E\r@ E\r  A:    Aj Ajý !A   - \\! !Ý  à    A!  j :   A 6  Aj!A !@@@@@@@  F"\r  -  AÅ F\r@ E\r  A : A ! \r  k!@@@@@ -  "A­j  AÄ F\r AÉ G\rA ! E\r\n    A Gü "6 E\r\n - A-F\r\n@ E\r  A:     Aj Ajý "6 E\r AI\r - A rAô G\r \r  ø !@@ AI\r  - Aô G\r    Aj6   A­ ç !   "E\r - AF\r \r  6  (!  ( ! !  û !   Aj6 A ! E\r  (  ("F\r   A|j6 !      !  6 E\r  AjÜ   ( "!   ("F\r  ! -  AÍ G\r    Aj"6  ! A ! Aà j$  ¨# Ak"$ A!@  ( "  (F\r @@ -  Aè G\r A!   Aj6  Aj  AÀ  (E\r  ( "  (F\r -  Aß G\r   Aj6  -  Aö G\rA!   Aj6  Aj  AÀ  (E\r  ( "  (F\r -  Aß G\rA!   Aj6    AÀ  (E\r  ( "  (F\r -  Aß G\r   Aj6 A ! Aj$  °A!@  ("  ( "F\r  ,  "A0H\r A !@ A:I\r  A¿jAÿqAK\r@@  F\r ,  "A0H\r@@ A:O\r AP! A¿jAÿqAO\rAI!   Aj"6  A$l j Aÿqj!   6 A ! # Ak"$   Aj!  Aj!A !@@  ( "  ("F\r  -  A× G\r    Aj"6 A !@  F\r  -  AÐ G\r    Aj6 A!   "\rA! Aj$   A¿ ! ( ! A:   :   6  6 A¼ 6   / AàqAÀ\nr;   6   6  AjÜ  m# Ak"$ @   (  ( " kAuI\r  Aæ 6 A6 AÕ 6 AÙ     Aj$    Atjm# Ak"$ @   (  ( " kAuI\r  Aæ 6 A6 AÕ 6 AÙ     Aj$    Atjm# Ak"$ @   (  ( " kAuI\r  Aæ 6 A6 AÕ 6 AÙ     Aj$    AtjOA!@  ( " (  ( " F\r A !  -  ARj" AÿqA1K\r B  ­Bÿ§! Aq¶@@  ("  (G\r    ( "k"At!@@   AjG\r  Ê "E\r@  F\r  E\r    ü\n     6     Í "6  E\r    AuAtj6  j! ( !   Aj6  6 «  # A k"$ @@  (" ("kAuK\r  Aj   Atj"k"¿ !@  F\r  E\r    ü\n     6    Au6  ( (" kAuK\r    Atj6 A j$  Aµ 6 A¨6 AÕ 6 AÙ     A 6 A6 AÕ 6AÙ  Aj  z  - !  A: A A 6¨Í A²    !A (¨Í !A A 6¨Í @ AF\r    :   !Ý    :        A     F  ( AÌj  Aj"   ( A j  A j"  É  È   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   p# Ak"$ @@@  Aj \r  ( ( "k ("O\r  B 7    6   6    j6  Aj$ I~  AjA¿ !  ) !  A:    7  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   I~  AjA¿ !  ) !  A:    7  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   S  AjA¿ !  ´ !  A:    6   6  A°» 6     / AàqAÀ\nr;   þ6~~# AÀk"$  A6 A 6  )7   Aj½ !@@@@@@  ³ "E\r  A¸j ´ A !@@@@@@@@@@@@ - \r 	\n - ! )¸!  ÷ "E\r  ÷ "E\r  AjA¿ "A6:   6  7  6 AÂ 6   / Aàq AvrAÀ\nr;   )¸"7 - !  7   Aj Avµ !@  ( "  (F\r  -  Aß G\r    Aj6   )¸"7 - !  7   Aj Avµ !  ÷ "E\r - !  AjA¿ ! )¸! A8:   7  6 AØÃ 6   / Aàq AvrAÀ\nr;   ÷ "E\r\r  ÷ "E\r\r - !  AjA¿ "A7:   6  6 AÄÄ 6   / Aàq AvrAÀ\nr; \r  ÷ "E\r  ÷ "E\r - !  AjA¿ ! )¸! A::   6  7  6 A¸Å 6   / Aàq AvrAÀ\nr;   Aj!  (  (kAu!@@@  ( "  (F\r  -  Aß F\r   ÷ "6° E\r\r  A°jÜ     Aj6  A°j   Ý A !  Â "	E\r Aú 6 A6  )7   Aj½ !  (  (kAu!\n@@@  ( "  (F\r  -  AÅ F\r E\r\r   ÷ "6  E\r\r  A jÜ     Aj6  A j   \nÝ  - !  AjA ¿ ! )°! ) ! AÀ :   Aq:   :   7  	6  7 A¤Æ 6   / Aàq AvrAÀ\nr;   ÷ "E\r\n - !  AjA¿ "AÁ :   Aq: \r  :   6 AÇ 6   / Aàq AvrAÀ\nr; \n   ÷ "6 A ! E\r	  Aj!  (  (kAu!@@@  ( "  (F\r  -  AÅ F\r   ÷ "6° E\r  A°jÜ     Aj6  A°j   Ý   - "Aq: ¬  Av: ÿ   A j A°j A¬j Aÿj¶ !	  - !A !  A : A A 6¨Í A©    !A (¨Í !A A 6¨Í  AF\r   :  E\r  (  (k!	A !@  ( "  ("F\r  -  Aß G\r A!   Aj"6   Aj! 	Au!	@@  F\r  -  AÅ G\r    Aj6 	   ÷ "6° E\r  A°jÜ  E\r  (!  ( !   ÷ "E\r  ÷ "E\r  ÷ "E\r - !  AjA¿ "A9:   6  6  6 AÐÉ 6   / Aàq AvrAÀ\nr;   Â "E\r  ÷ "E\r - !  AjA¿ ! )¸! A=:   6  6  7 AÀÊ 6   / Aàq AvrAÀ\nr; @@ - AqE\r   Â !  ÷ ! E\r - !  AjA¿ ! )¸! A<:  B 7  6  7 A¨Ë 6   / Aàq AvrAÀ\nr; A !  ("  ( "k"AI\r@@ -  "Aæ F\r @ AÔ F\r  AÌ G\r   !  û !@@ - "Að F\r  AF\r AÌ G\r , APjA	K\r  · !  F\r   Aj"6   F\rA !@@@ -  "Aò G\r A !@@ AÒ F\r  Aì F\r AÌ G\r	A!A!A!A !A!A !   Aj6   ³ "E\r@@ - A~j  A¸j ¸  (¸ (¼jAj-  A*G\r  ÷ "E\rA !@@ \r  !  ÷ "E\r   !   ! A¸j ´   AjA¿ ! )¸! AÇ :   :   7  6  6 AÌÛ 6   / AàqAÀ\nr;  A6ø AÜ 6ô  )ô7x@   Aø j½ E\r   Aj!  (  (kAu!@@@  ( "  (F\r  -  AÅ F\r   ¹ "6¸ E\r  A¸jÜ     Aj6  A¸j   Ý   AjA¿ ! )¸! AÆ :   7 A 6 Aß 6   / AàqAÀ\nr;  A6ð Aö 6ì  )ì7p@   Að j½ E\r   Â "E\r  ÷ "E\r A¸j  AÀ A !  ( "  (F\r -  AÅ G\r   Aj6   AjA¿ ! )¸! AÅ :   7  6  6 Aøß 6   / AàqAÂ\nr;  A6è A³ 6ä  )ä7h@   Aè j½ E\r   ÷ "E\r  AjA¿ "A<:  B 7  6 A	6 AØ 6 A¨Ë 6   / AàqAÂ\nr;   ("  ( "F\r  kAI\r -  AÿqAò G\r - A rAñ G\r A6¼ A 6¸  )¸7`@@   Aà j½ E\r   Aj!  (  (kAu!@@@  ( "  (F\r  -  Aß F\r   Â "6° E\r  A°jÜ     Aj6  A°j   Ý  (´! (°! A6´ A  6°  )°7XA !A !   AØ j½ E\r  Aj!  Aj!  ( "  (F!  (  (kAu!\r@ Aq\r@@@@ -  AØ G\r    Aj6   ÷ "E\rA !  ( "  ("	F\r -  AÎ G\rA!\n   Aj"6 @ -  AÔ G\r    Aj6   Â "E\r A¿ "AÕ :   6 Aèá 6   / AàqAÀ\nr;  -  AÑ G\r   Aj6   ÷ "E\r A¿ "AÖ :   6 AØâ 6   / AàqAÀ\nr; A !\n@  	F\r  -  AÒ G\r    Aj6   A Ô "E\r A¿ "AÔ :   6  \n:   6 Aøà 6   / AàqAÀ\nr;   6   A jÜ   ( "  (F"\r  -  AÅ G\r    Aj6  A j   \rÝ  A¿ !  ) !  AÓ :    7   6   6  AÌã 6     / AàqAÀ\nr;   ! !Ý    :     A6à AÖ 6Ü  )Ü7P@   AÐ j½ E\r   Â "E\r  ÷ "E\r A¸j  AÀ   Aj!  (  (kAu!	A !@  ( "  ("F\r@ -  Aß G\r    Aj6  A°j  A À     A°jñ 6   A jÜ @ -  "Að G\r    Aj"6   F\r -  AÅ G\r   Aj6  A°j   	Ý   AjA$¿ ! )¸! )°! A;:   Að F:    7  7  6  6 A¼ä 6   / AàqAÀ\nr;  A6Ø A£ 6Ô  )Ô7H@   AÈ j½ E\r    ÷ "6¸ E\r   A¸jú ! A6Ð Aß 6Ì  )Ì7@@   AÀ j½ E\r @  (  ( "F\r  -  AÔ G\r   û "E\r  AjA¿ "A>:   6 A¬å 6   / AàqAÀ\nr;    · "6¸ E\r   A¸jº ! A6È A 6Ä  )Ä78@   A8j½ E\r   Aj!  (  (kAu!@@@  ( "  (F\r  -  AÅ F\r   Ó "6¸ E\r  A¸jÜ     Aj6  A¸j   Ý   AjA¿ ! )¸! A :   7 A æ 6   / AàqAÀ\nr;   6°   A°jº ! A6À AÐ 6¼  )¼70@   A0j½ E\r   Â "E\r  Aj!  (  (kAu!@@@  ( "  (F\r  -  AÅ F\r   ¹ "6¸ E\r  A¸jÜ     Aj6  A¸j   Ý   AjA¿ ! )¸! AÆ :   7  6 Aß 6   / AàqAÀ\nr;  A6¸ Aè 6´  )´7(@   A(j½ E\r   Aâ å ! A6° Aß 6¬  )¬7 @   A j½ E\r   ÷ "E\r  AjA¿ "AÈ :   6 Aç 6   / AàqAÀ\nr; @@@  ( "  (F\r  -  Aõ G\r    Aj6     "6  E\rA ! A 6¬ A j  ( (    ) "7° BpBR\r A6¼ AÉ 6¸  )¸7A !A ! A°j Aj \r@  ( "  (G\r A !@@ -  Aô G\r A!   Aj6   Â !A !A ! -  Aú G\rA!   Aj6   ÷ !  6¬ A6¼ A 6¸A ! A 6   )¸7@   Aj½ E\r    » "6  E\r@  (  ( "F\r  -  AÉ G\r A !   A ü "6° E\r    A j A°jý 6 @@@  ( "  (F\r  -  AÅ F\r   ¼ "6° E\r    A j A°j½ 6     Aj6    ¾ "6° E\r   A j A°j½ ! A6´ Aë 6°  )°7@   Aj½ \r    ¾ "6  As Er\r   A j¿ !@@  (  ( "F\r  ,  APjA	K\r A!@   ¼ "6¬ E\r@@ Aq\r    A j A¬j½ ! E\r    A¬j¿ !  6 A !  ( "  (F\r  -  AÅ G\r    Aj6    » "6  E\r  (  ( "F\r  -  AÉ G\r A !   A ü "6¬ E\r    A j A¬jý 6    ¾ "6¬ E\r   A j A¬j½ !A !  Aj!  (!  (!@@ \r @@  ( "  (F\r  -  AÅ G\r    Aj6    Ó "6¸ E\r  A¸jÜ   E\r  A¬jÜ  A¸j    kAuÝ  A : ° A: ÿ   A j A¸j A°j Aÿj¶ !A ! A°j   	Ý A !  (´AFrAG\r  - !  AjA¿ ! )°! AÄ :   7  6 AàÈ 6   / Aàq AvrAÀ\nr;  AÀj$  ãA !@  ( "  ("F\r  -  AÄ G\r    Aj"6   F\r @ -  Aô F\r  -  AÔ G\r   Aj6   ÷ "E\r   ( "  (F\r  -  AÅ G\r    Aj6   AjA¿ "A<:  B 7  6 A6 Aý 6 A¨Ë 6   / AàqAÀ\nr;  U   AjA¿ !  ( ! ( !  A:    6   6  A  6     / AàqAÀ\nr;   G   AjA¿ !  ( !  A*:    6  A´Ü 6     / AàqAÀ\nr;   Þ# A k"$ A !@@@  ( "  ("F\r  -  AÔ G\r    Aj"6 @@@  G\r A !@@ -  "AÌ F\r A !   Aj6 A !   Aj \r  ( "  ("F\r -  Aß G\r (Aj!   Aj"6   F\r -  !A ! AÿqAß F\rA !   Aj \r  ( "  (F\r -  Aß G\r (Aj!   Aj6 @  - AG\r   6   k6   Ajñ !@  - AG\r  \r   AjA¿ A,AAAß "A :  A 6  6 A½ 6  - A,G\r@  (ì"  (ðG\r    (è"k"At!@@   AôjG\r  Ê "E\r@  F\r  E\r    ü\n     6è    Í "6è E\r    AuAtj6ð  j!   Aj6ì  6   AÌj!@@   (Ð  (ÌkAuO\r   Ù ( E\r    Ù ( "( ( kAuI\rA !  ( G\r   (Ð  (ÌkAu"K\r@  G\r  A 6  Aj¢   AÇ á !  Ù (  Ú ( ! A j$   Aµ 6 A±.6 AÕ 6 AÙ    «  ®	~# Ak"$ A !@  ( "  ("F\r  -  AÉ G\r    Aj"6 @ E\r     (Ì6Ð   A j6   AÌj ¢     ( 6¤  (!  ( !  F!  A j!  Aj!  Aj!  (  (kAu!	@@@ Aq\r  -  AÅ G\r A !@@ E\r    Ó "6  E\r  Ü   6@@@ - "A)F\r  A"G\r (!\n )! A¿ "\nA(:  \n 7 \nA´ô 6  \n \n/ A`q"Ar"\r;  §" B §Atj! !@@@  F\r ( ! Aj! / AqAF\r  \n Ar"\r;  !@@@  F\r ( ! Aj! / AqAF\r  \n \rAÿgqAr"\r; @@  F\r ( ! Aj! / AÀqAÀ F\r  \n \rA¿þqAÀ r;   \n6  Aj£    Ó "6  E\r  Ü   ( "  (F"\r  -  AÑ G\r    Aj6   Þ "E\r  ( "  (F\r -  AÅ G\r   Aj6     	Ý  A¿ ! ) ! A+:   6  7 A¤õ 6   / AàqAÀ\nr;  Aj$  U   AjA¿ !  ( ! ( !  A-:    6   6  Aö 6     / AàqAÀ\nr;   V   AjA¿ !  ( !  A\r ( "- AvAAß " A :    6   6  Aä 6   Â# Ak"$  A6 A 6  )7 A !A !@   ½ E\r   A­ ç !@@  (  ( "F\r  -  AÓ G\r A !   "E\r - AF\r  \r A:   !      ! Aj$  Ù# A0k"$  A6, AÖ 6(  )(7@@   Aj½ E\r A!A  !A ! A6$ Aþ 6   ) 7@   Aj½ E\r A!A !A ! A6 Aª 6  )7 @   ½ \r A !A!A !A!A !A¤ !  A Ô !@@ \r  E\r   AjA¿ " A:    6   6   6  A 6     / AàqAÀ\nr;  !  A0j$   Ñ~# A0k"$ @@  ( "  (F\r  -  AÕ G\r    Aj6  A(j  î A ! (,"E\r A	6 AÌ 6  )("7   7  )7 @ Aj Ð E\r   ) !   §"A	j6     j6 Aj  î  (! (!   7  E\r   "E\r  AjA¿ "A:   6  6  6 A ÿ 6   / AàqAÀ\nr; A !@  (  ( "F\r  -  AÉ G\r A !  A ü "E\rA !   "E\r  AjA¿ "A:   6  7  6 A 6   / AàqAÀ\nr;    !@  Â "\r A !@ \r  !  AjA¿ A / " AÀqAv  AvAq  A\nvAqß " 6  6 A 6  A0j$  à~# Að k"$    ! A6l AÙ 6h  )h70@@@   A0j½ E\r   AÍ ê ! A6d A 6`  )`7(@   A(j½ E\r A !  ÷ "E\r  ( "  (F\r -  AÅ G\r   Aj6   AjA¿ "A:   6 AÈü 6   / AàqAÀ\nr;  A6\\ Aõ 6X  )X7 A !   A j½ E\r   Aj!  (  (kAu!@@@  ( "  (F\r  -  AÅ F\r   Â "6P@ E\r   AÐ jÜ A !   Aj6  AÐ j   Ý   AjA¿ ! )P! A:   7 A¸ý 6   / AàqAÀ\nr;  A6L A¿ 6H  )H7   Aj½ A !  ( "  ("F\r  -  AÆ G\r    Aj"6 @  F\r  -  AÙ G\r    Aj6   Â "E\r   Aj!  (  (kAu!	@@@  ( "  (F\r @ -  AÅ G\r    Aj6 A ! -  Aö G\r    Aj6  A6D AÚ 6@  )@7@   Aj½ E\r A!A! A6< AÝ 68  )87   Aj½ \r   Â "6P E\r  AÐ jÜ   AÐ j   	Ý   AjA ¿ !  )P!  AA AA ß " 6  :   6  7  6 A°þ 6  Að j$  ¾  Aj!  ( !@ ( " Aj"G\r @@  G\r  ! Ì     Aj6   6   6  ( !@@ (" G\r  !@  k"E\r    ü\n   ( ! (!  ( !     kj6  6     6 @  G\r    (6   (6  Aj6  6  6     6   (!   (6  6  (!   (6  6  ( 6  ¾  Aj!  ( !@ ( " Aj"G\r @@  G\r  ! Ì     A,j6   6   6  ( !@@ (" G\r  !@  k"E\r    ü\n   ( ! (!  ( !     kj6  6     6 @  G\r    (6   (6  A,j6  6  6     6   (!   (6  6  (!   (6  6  ( 6  A !@  ( "  ("F\r  -  Aò G\r    Aj"6 A!@  F\r  -  AÖ G\r    Aj"6  Ar!@  F\r  -  AË G\r    Aj6  Ar! ·@   F\r @  ,  "Aß G\r   Aj" F\r@ ,  "APjA	K\r   Aj Aß G\r  Aj!@  F\r@ ,  "APjA	K\r  Aj! Aj   Aß F APjA	K\r   !@@ Aj" G\r   ,  APjA\nI\r   U   AjA¿ !  ( ! ( !  A:    6   6  AÈó 6     / AàqAÀ\nr;   ð# Ak"$ A !@  ( "  ("F\r  -  AÓ G\r    Aj"6 @  F\r @ ,  "Aá H\r  Aú K\rA !@@@@@@@ Aÿq"Aj						  AjA!A!A!A!A!   Aj6   AjA¿ "A0:   6 A°ì 6   / AàqAÀ\nr;     ¤ "6@  F\r   Aj AjÜ  ! ! Aß G\r    Aj6   (  (F\r  AjA ¥ ( !A ! A 6   AjÖ \r   ( "  (F\r  -  Aß G\r  (!   Aj6  Aj"  (  (kAuO\r   Aj ¥ ( ! Aj$  æ	~# A0k"$   6$  6(@@   A$j× \r   (!  ( !@@@@ E\r @  G\r A ! -  AÆ G\r A!   Aj"6 A !@  F\r  -  AÌ G\r    Aj"6   F\r  ,  "A1H\r @ A9K\r    ! AÕ G\r    ¦ ! A6  Aè 6  )7@   Aj½ E\r   Aj!  (  (kAu!@    "6 E\r  AjÜ   ( "  (F\r  -  AÅ G\r    Aj6  Aj   Ý   AjA¿ ! )! A5:   7 Aï 6   / AàqAÀ\nr; @  ("  ( "F\r  -  A½jAÿqAK\r A ! E\r ($\r@ - A0G\r   AjA¿ ! (! A/:   6 Aðí 6   / AàqAÀ\nr;   6(  (!  ( ! !A !  F\r@ -  AÃ G\r    Aj"	6 A !@@ 	 G\r A !\nA !\n 	-  AÉ G\r    Aj"	6 A!\n  	F\r 	-  "AOjAÿqAK\r  APj6   	Aj6 @ E\r  A:  @ \nE\r    Ô \r A ! A : /   A(j A/j Aj§ !  kAI\r -  AÿqAÄ G\r - "	APj"AK\r AF\r  	APj6   Aj6 @ E\r  A:   A: /   A(j A/j Aj§ !   ¨ !@@ E\r  ($"E\r   AjA¿ "A:   6  6 Aôð 6   / AàqAÀ\nr;  ! E\r@ As   ¤ "Er\r   AjA¿ "A:   6  6 Aäñ 6   / AàqAÀ\nr; @ E\r  E\r   AjA¿ "A:   6  6 AÜò 6   / AàqAÀ\nr;  !A ! A0j$  ²\n~# A°k"$ A !@  ( "  ("F\r  -  AÌ G\r    Aj"6 @  F\r @@@@@@@@@@@@@@@@@@@@@@ -  A¿j9	\n\r    Aj6  A6¬ AÒ 6¨  )¨7   AjÀ ! A6¤ Aä 6   ) 7@   Aj½ E\r  A 6   AjÁ ! A6 Aà 6  )7   Aj½ E\r A6   AjÁ !   Aj6  A6 A 6  )7    A jÀ !   Aj6  A6 A 6  )7(   A(jÀ !   Aj6  A\r6 A 6  )70   A0jÀ !   Aj6  A6ü AÆ 6ø  )ø78   A8jÀ !   Aj6  A6ô A½ 6ð  )ð7@   AÀ jÀ !   Aj6  A 6ì Aµ 6è  )è7H   AÈ jÀ !   Aj6  A6ä Aÿ 6à  )à7P   AÐ jÀ !   Aj6  A6Ü Aï 6Ø  )Ø7X   AØ jÀ !\r   Aj6  A6Ô AÍ 6Ð  )Ð7`   Aà jÀ !   Aj6  A6Ì AÙ 6È  )È7h   Aè jÀ !   Aj6  A6Ä AØ 6À  )À7p   Að jÀ !\n   Aj6  A6¼ Aë 6¸  )¸7x   Aø jÀ !	   Aj6  A6´ Aâ 6°  )°7   AjÀ !   Aj"6   kA	I\r A\nj!A !@@ AF\r  j-  "Aj!	A ! Aj"\n! APjAÿqA\nI\r  \n! 	AÿqAI\r 	   6 A !  F\r -  AÅ G\r   Aj6   AjA¿ "AÎ :  A6  6 AðÍ 6   / AàqAÀ\nr;    Aj"6   kAI\r Aj!A !@@ AF\r  j-  "Aj!	A ! Aj"\n! APjAÿqA\nI\r  \n! 	AÿqAI\r    6 A !  F\r -  AÅ G\r   Aj6   AjA¿ "AÏ :  A6  6 AäÎ 6   / AàqAÀ\nr;    Aj"6   kA!I\r A"j!A !@@ A F\r  j-  "Aj!	A ! Aj"\n! APjAÿqA\nI\r  \n! 	AÿqAI\r    6 A !  F\r -  AÅ G\r   A#j6   AjA¿ "AÐ :  A 6  6 AØÏ 6   / AàqAÀ\nr;  A6¬ Aå 6¨  )¨7   Aj½ E\r  ¾ "E\r  ( "  (F\r -  AÅ G\r   Aj6  !  Â "E\r  ( "  (F\r -  AÅ G\r   Aj6   AjA¿ "AÊ :   6 AÌÐ 6   / AàqAÀ\nr;  A6¤ A¡ 6   ) 7   Aj½ E\r@  ( "  ("F\r  -  A0G\r    Aj"6   F\r -  AÅ G\r   Aj6   Aã â !  kAI\r - Aì G\rA !  A ¦ "E\r  ( "  (F\r -  AÅ G\r   Aj6   AjA¿ "AË :   6 AÙ 6   / AàqAÀ\nr;   Â "E\r  Aj  AÀ A ! (E\r   ( "  (F\r  -  AÅ G\r    Aj6   AjA¿ ! )! AÌ :   7  6 AðÙ 6   / AàqAÀ\nr;  A°j$  # Ak"$ @@  ("  ( "G\r A ! A !  -  AÔ G\r  A6 Añ 6A ! @  kAI\r  - !  Aj  ÀA î AG!  Aj$   \n~# A k"$   6 A6 A° 6   6  )7(  Aj6@@@   A(j½ E\r  AjA ï !  AjA¿ A#A AAß " 6 A¨Ó 6  A6 A÷ 6  )7 @@@@@   A j½ E\r   - !  A: A !A A 6¨Í A¬   A  !A (¨Í !A A 6¨Í  AF\r@ E\r  AjA ï !  AjA¿ A$A AAß " 6  6 A Ô 6    :  A6 A 6|  )|7@   Aj½ E\r  AjAï !@  Â "\r A !  AjA¿ A%A AAß " 6  6 A¤Õ 6  A6x A 6t  )t7@   Aj½ E\r   Aj! AjAï !  (  (kAu! AÀ j  à "Aj!  (!  ( !@@@@@  F\r  -  AÅ G\r    Aj6 A !A A 6¨Í A³     !A (¨Í !A A 6¨Í  AF\r  68 E\r  A8jÜ   ( "  ("F\r  -  AÑ G\r    Aj6 A A 6¨Í A±    !A (¨Í !A A 6¨Í  AF\r E\r  ( "  (F\r -  AÅ G\r   Aj6  !Ý  !Ý A ! A64 AÃ 60  )07A !   Aj½ E\r   ( "E\r  AjA¿ A\'A AAß " 6 A× 6  !Ý    : A A 6¨Í A°  A8j    A (¨Í !A A 6¨Í @ AF\r   AjA¿ !  )8!	  A&A AAß " 6  	7  6 A Ö 6  !Ý  á  á  A j$     Ç# A0k"$ A !@   A,j \r  (,"Aj  (  ( "kO\r   6$  6(    j6  A\n6  A 6  )$7  )7@ Aj AjÐ E\r   AÖ ò !   A$jï ! A0j$  A    :   Aº 6    At At A?qrAÿqr A\ntr  / Aàqr;    A  A  A     A 	   B 7    Aô N~# Ak"$    )"7   7   !  ( Ã  Aj$ H@ ("E\r    Æ @ E\r   (  (j (  ü\n      ( j6        Aô # A k"$  A6 A­ 6  )7  Aj !  ( Ã  A6 Aë 6  )7    !  ( Ã  A j$ A ! A 6 A!@  ("  ( "F\r  -  AFjAÿqAöI\r @A !  F\r -  APjAÿqA	K\r  A\nl"6    Aj"6    ,  jAPj"6  !      )7    Aô @~# Ak"$    )"7   7    Aj$    Aô f@@  ("\r A !  Ã   (A G!  - !@@ \r  AqE\r A:A. AqÄ   ( Ã ¶@@  ("  (G\r    ( "k"At!@@   AjG\r  Ê "E\r@  F\r  E\r    ü\n     6     Í "6  E\r    AuAtj6  j! ( !   Aj6  6 «  ¶@@  ("  (G\r    ( "k"At!@@   AjG\r  Ê "E\r@  F\r  E\r    ü\n     6     Í "6  E\r    AuAtj6  j! ( !   Aj6  6 «  Ì~# Ak"$   Aj!@@  ( "  (F\r  -  AÂ G\r    Aj6  Aj  î  (\rA ! Aj$   A¿ ! )! A	 / "AÀqAv AvAq A\nvAqß " 7  6 A î 6  ! m# Ak"$ @   (  ( " kAuI\r  Aæ 6 A6 AÕ 6 AÙ     Aj$    AtjÜ~~# A k"$ @ E\r     (Ì6Ð A6 A 6  )7(@@@@@@   A(j½ E\r A ! AØ j  A À   ( "  (F\r -  Aß G\r   Aj6   AjA¿ ! )X! A3:   7 A¼Ñ 6   / AàqAÀ\nr;  A6 Aî 6  )7 @   A j½ E\r   (!    (Ð  (ÌkAu6  Aj! AØ j  à "Aj!  (  (kAu!	@@@@@   E\rA A 6¨Í A³     !A (¨Í !A A 6¨Í  AF\r  6P E\r  AÐ jÜ  A A 6¨Í A°  AÐ j   	 A (¨Í !A A 6¨Í @@@ AF\r  (T\r  (Ð"  (ÌG\r AÕ 6 A A 6¨Í  A6 Aö 6A AÙ   A (¨Í !A A 6¨Í  AG\r\n !Ý \n   A|j6ÐA !@  ( "  (F\r  -  AÑ G\r    Aj6 A !A A 6¨Í A±    !A (¨Í !A A 6¨Í  AF\r E\r A6L Aü 6H  )H7@   Aj½ \r @A A 6¨Í A©    !A (¨Í !A A 6¨Í  AF\r  6@ E\r  AÀ jÜ   (  ( "F\r  -  "AÑ F\r AÅ G\r A !A A 6¨Í A°  AÀ j   	 A (¨Í !A A 6¨Í @@ AF\r   ( "  (F\rA !@ -  "	AÑ G\r    Aj6 A !A A 6¨Í A±    !A (¨Í !A A 6¨Í  AF\r E\r  ( "  (F\r -  !	A ! 	AÿqAÅ G\r   Aj6 A ! A8j  A À   ( "  (F\r -  Aß G\r   Aj6   AjA(¿ ! )P! )@!\n )8! A4:   7   6  \n7  6  7 AØ 6   / AàqAÀ\nr;  !Ý 	 !Ý A ! á    6 !Ý  A64 Aü 60  )07A !   Aj½ E\r A ! AØ j  A À   ( "  (F\r  -  Aß G\r    Aj6   A§ ð ! A j$   !Ý  !Ý   á    6   c   AjA¿ !  ( ! -  ! ( !  A1:    6   :    6  Að 6     / AàqAÀ\nr;   ¾# A k"$ @@@@  ³ "E\r @ - "AG\r   - !A !  A :    A G  - "r: A A 6¨Í A©    !A (¨Í !A A 6¨Í  AF\r  6@ E\r @ E\r  A:     Aj¬ !   :    : A ! A\nK\r@ AG\r  - AqE\r Aj ¸    Ajñ ! A6 Aý 6  )7@   Aj½ E\r    "E\r  AjA¿ "A:   6 AÌê 6   / AàqAÀ\nr; A !  ( "  ("F\r -  Aö G\r   Aj"6   F\r -  APjAÿqA	K\r   Aj6     "6 E\r   Aj¬ ! !Ý    :    :    A ! A j$  A !@@  - \r   A:   (!A A 6¨Í A´    !A (¨Í !A A 6¨Í  AF\r  A :   !Ý   A :    1@  - Av"AF\r  E     ( (   A !@@  - \r   A:   (!A A 6¨Í Aµ    !A (¨Í !A A 6¨Í  AF\r  A :   !Ý   A :    1@  - Aq"AF\r  E     ( (  A !@@  - \r   A:   (!A A 6¨Í A¶    !A (¨Í !A A 6¨Í  AF\r  A :   !Ý   A :    4@  / A\nvAq"AF\r  E     ( (  @  - E\r     A:   ("( (!A A 6¨Í     !A (¨Í !A A 6¨Í @ AF\r   A :   !Ý   A :       Aô @@  - \r   A:   (! ( (!A A 6¨Í     A (¨Í !A A 6¨Í  AF\r  A :  !Ý   A :    @@  - \r   A:   (! ( (!A A 6¨Í     A (¨Í !A A 6¨Í  AF\r  A :  !Ý   A :    ØA !@  (  ( "kAI\r A>!A !@@ " F\r@  jAv"At", ¾ " ,  "N\r  Aj! !  G\r  Aj  A¾ j- À - ÀH"!   ! A ! At"- ¾  -  G\r  A¾ j"-  - G\r    Aj6  ! ú~# A0k"$    (Ñ ! @@ - A\nK\r   ) ! A6$ Aî 6   7(  7  ) 7 Aj AjÐ E\r    ( "Aj"6     ("Axj"6 E\r  -  A G\r    Awj6   A	j6  A0j$  Aú 6 AÑ6 AÕ 6 AÙ    h~@  ÷ "\r A   AjA¿ !  ) !  AÂ :    6   7  AìÂ 6     / Aàq rAÀ\nr;   r~  AjA¿ !  -  ! ( ! ) ! -  !  A?:    :    7   6  AøÇ 6     / Aàq A?qrAÀ\nr;   ¦# AÀ k"$  A6< Aè 68  )87@@   Aj½ E\r   A á ! A64 AÀ 60  )07@   Aj½ E\r    A ! A(j  A À   ( "  (F\r -  Aß G\r   Aj6    A(jÂ ! A6$ A© 6   ) 7A !   Aj½ E\r A ! A(j  A À  (,E\r   ( "  (F\r  -  Að G\r    Aj6    A ! A(j  A À   ( "  (F\r  -  Aß G\r    Aj6    A(jÂ ! AÀ j$      (Ñ °# Ak"$ @@@  ("  ( "F\r   kAI\r  -  AÿqAä G\r @ - "AØ F\r @ Aø F\r  Aé G\r   Aj6     "6 E\r   ¹ "6 E\r A :    Aj Aj AjÃ !   Aj6    ÷ "6 E\r   ¹ "6 E\r A:    Aj Aj AjÃ !   Aj6 A !  ÷ "E\r  ÷ "E\r  ¹ "E\r  AjA¿ "AÒ :   6  6  6 AÞ 6   / AàqAÀ\nr;   ÷ !A ! Aj$  `   AjA¿ !  ( !  A<:   B 7   6  A\n6  Aµ 6  A¨Ë 6     / AàqAÀ\nr;   §# Ak"$ @@  (  ( "F\r @ -  "AÄ F\r  AÔ G\r   û "6 E\r  Aj AjÜ    ø "6 E\r  Aj AjÜ    ! Aj$  # Ak"$     "6@@ \r A !  (  ( "F\r  -  AÉ G\r A !   A ü "6 E\r    Aj Ajý ! Aj$  U   AjA¿ !  ( ! ( !  A:    6   6  Aüç 6     / AàqAÀ\nr;   # A0k"$ @@  (  ( "F\r  ,  APjA	K\r   ¼ ! A6, A 6(  )(7@   Aj½ E\r @@  (  ( "F\r  ,  APjA	K\r   ¼ !  » !@ \r A !  AjA¿ "A2:   6 Aìè 6   / AàqAÀ\nr;  A6$ A 6   ) 7   Aj½ A !   A ¨ "6 E\r @  (  ( "G\r  ! ! -  AÉ G\r A !   A ü "6 E\r    Aj Ajý ! A0j$  G   AjA¿ !  ( !  A.:    6  A¼ë 6     / AàqAÀ\nr;   ¸~# Ak"$  Aj  AÀ A !@ (E\r   ( "  (F\r  -  AÅ G\r    Aj6   AjA¿ ! ) ! )! AÍ :   7  7 AÌ 6   / AàqAÀ\nr;  Aj$  K   AjA¿ !  ( !  AÉ :   AÍ 6    A G:     / AàqAÀ\nr;   J~  AjA¿ !  ) !  AÃ :    7  AÜÚ 6     / AàqAÀ\nr;   d   AjA¿ !  ( ! ( ! -  !  AÑ :    :    6   6  A¬Ý 6     / AàqAÀ\nr;      Aô ô~# Aà k"$ A !@ (\r    )"7P@@ B "BR\r  A6\\ Aø 6X  )X70 AÐ j A0j E\r  )"B !  7P BR\r A6\\ Aà 6X  )X7( AÐ j A(j \r A(Æ A!  ( A  / A?q" AF AGÇ    )"7P@@ BpBR\r  A6\\ A 6X  )X7  AÐ j A j E\r A6L AÓ 6H  )H7  Aj    )"7  7@  Aj ! A6< AÓ 68  )87  Aj !  (   / A?q AFÇ @ E\r  A)È  Aà j$      (Aj6   Ä > @  j  / A?qK\r  A(Æ    Ã  A)È    Ã      (Aj6   Ä    Aô X~# Ak"$    )"7   7   !  (   / A?qA Ç  Aj$    Aô W~# Ak"$   (   / A?qAÇ    )"7   7    Aj$    Aô @   (   / A?qA Ç  AÛ Æ   ( AA Ç  AÝ È    Aô o~# Ak"$   (   / A?qAÇ    )"7   7   !  (   / A?qA Ç  Aj$    A ô È# AÀ k"$ @  - AG\r  A6< Aß 68  )87  Aj  A64 Añ 60  )07  Aj !@  - AG\r  A6, AË 6(  )(7  Aj @  (E\r  A(Æ   Aj Ó  A)È  A6$ AÓ 6   ) 7    !  ( Ã @  (E\r  A(Æ   Aj Ó  A)È  AÀ j$ Õ# Ak"$ A !A!@@   (F\r ("!@ Aq\r  A6 AÆ 6  )7     (!A !  (  Atj(  AA Ç @  (G\r     ( (    6 ! Aj! !  Aj$    Aô Ï# A0k"$ @  - AG\r  A6, Aß 6(  )(7  Aj  A6$ Að 6   ) 7  Aj !@  - \rAG\r  A6 AË 6  )7     A Ä !  ( Ã  A0j$    Aô ^ @  - AG\r  A(Æ   ( Ã @  - AG\r  A)È  A(Æ   Aj Ó  A)È    Aô D  A(Æ   ( Ã  A)È  A(Æ   Aj Ó  A)È    Aô ¬# A k"$   (   / A?qA Ç  A6 A 6  )7  Aj !  ( AA Ç  A6 A± 6  )7    !  ( AAÇ  A j$    Aô ¹~# A0k"$    )"7  7(  Aj "(! A 6 AÇ 6  A6$  ) 7  Aj !  (! ( (!A A 6¨Í     A (¨Í !A A 6¨Í @ AF\r  A6 Aø 6  )7    !  6 A(Æ   ( AA Ç  A)È  A0j$  !Ý   6      Aô ~# A k"$    )"7  7  Aj "A(Æ   ( Ã  A)È    )"7   7    A j$ # Ak"$    6  (Ì! (Ð!  B 7    A4j6    Aj"6   6  B 7  B 7$  B 7,    kAu6   Aj6 AÌj Aj¢  Aj$   Ù# Ak"$ @@  ( "(Ð (Ì"kAu  ("O\r  AÕ 6 A A 6¨Í  A×6 Aµ 6A AÙ   A (¨Í ! A A 6¨Í   AF\r    Atj6Ð  AjÉ  Aj$   A  ! Ý        Aô ~# AÀ k"$ @  (AI\r  A(Æ    )"7  70  Aj A)È @@  (-  Aî G\r  A-Ä !  (!   (Aj6<  Aj68  )87  Aj    )"7  7(  Aj @  (AK\r    )"7   7     AÀ j$    Aô Z# Ak"$  AA  - " 6 Aâ A÷   6  )7     Aj$    Aô # AÀ k"$ @  (AI\r   (! A<j!A ! @@  AF\r APA©   j", "APjA\nI jA A	 ,  "APjA\nI jAtj:   Aj!  Aj!   A<j æ  B 70 B 7( B 7   *<»9  A jAAÛ  Ajå 6  A j6  )7  Aj  AÀ j$    Aô # AÐ k"$ @  (AI\r   (! AÈ j!A ! @@  AF\r APA©   j", "APjA\nI jA A	 ,  "APjA\nI jAtj:   Aj!  Aj!   AÈ j æ  B 78 B 70 B 7( B 7   +H9  A jA A  Ajå 6  A j6  )7  Aj  AÐ j$    Aô # Að k"$ @  (A I\r   (! Aà j!A ! @@  A F\r APA©   j", "APjA\nI jA A	 ,  "APjA\nI jAtj:   Aj!  Aj!   Aà j æ  A0jA A*ü   )`7  )h7  A0jA*A¬  Ajå 6,  A0j6(  )(7  Aj  Að j$    Aô # A k"$  A6 AÆ 6  )7  Aj !  ( Ã  A6 Aà 6  )7     A j$    (   (  þ ¥# Ak"$   ( " Atj" ("Aj6 AjA¿ "A!:   6  6 A¬Ò 6   / AàqAÀ\nr;   6@  (( "E\r   Aj£  Aj$     Aô ~# A0k"$  A6, AÞ 6(  )(7  Aj !   )"7  7   Aj !  A6 Aµ 6  )7      A0j$    Aô ~# AÐ k"$ @@@@@  (  A 6(A! A(j! A¦ 6 A! A j! Aì 6A! Aj!  6  ) 7  Aj @  (" E\r   Aj­! AÐ j"! @  Aj"   B\n"B\n~}§A0r:   B	V! ! \r    60    k64  )07  Aj  AÐ j$    Aô G# Ak"$  A	6 AÉ 6  )7     Aj$    ( Ã    Aô T# Ak"$   ( Ã  A6 AÓ 6  )7     Aj$    ( Ã    Aô s# Ak"$    ( ( (  @  ( ª \r  A6 AÓ 6  )7     Aj$ )   ( Ã    ( ( (     Aô å# A k"$  (! A 6 A	6 Aª 6  )7  Aj !A A 6¨Í A·   Aj  A (¨Í ! A A 6¨Í @  AF\r  A6 AÇ 6  )7      6 A j$  !Ý   6   m# Ak"$   ( Ã @  (E\r  A\n6 Aô 6  )7    !  ( Ã  Aj$    Aô a# Ak"$    ( ( (   A6 AÝ 6  )7     Aj$     ( ( (     A(ô ~# A0k"$  A6, A 6(  )(7  Aj !   ) "7  7   Aj ! A6 Aµ 6  )7        A0j$ Ã# AÐ k"$ @@  (E\r  (! A 6 AÇ 6H A6L  )H7   A j !A A 6¨Í A·   Aj  A (¨Í !A A 6¨Í  AF\r A6D Aø 6@  )@7  Aj   6@  (E\r  A\n6< Aô 68  )87  Aj !  ( Ã  A64 AÓ 60  )07  Aj  A(Æ   Aj Ó  A)È @  (E\r  A\n6, Aô 6(  )(7    !  ( Ã  AÐ j$  !Ý   6      Aô # A k"$  A6 AË 6  )7  Aj !@  (" - A4G\r      A6 A 6  )7     A j$    Aô ¼~# A k"$  A(Æ   ( Ã  A)È @@  (-  Aî G\r  A-Ä !  (!   (Aj6  Aj6  )7  Aj    )"7  7  Aj  A j$    Aô k~# A k"$  A6 AÀ 6  )7  Aj !   )"7   7    A j$    Aô æ~# AÐ k"$    6D  6@ A(Æ   (!@@  - "AG\r  E\r@@ E\r   AAÇ  AÀ j  A6L AÓ 6H  )H78  A8j !   )"70  7H  A0j ! A6L AÓ 6H  )H7(  A(j  A6L AÝ 6H  )H7   A j !@@  - \r   (E\r A6L AÓ 6H  )H7  Aj !   )"7  7H  Aj ! A6L AÓ 6H  )H7  Aj !@  - AG\r  AÀ j   ( AAÇ  A)È  AÐ j$ y# Ak"$   (!  ( A(Æ  (! AÀ\n; 	 A*:   6 A´Ü 6 Aj  ( Ã   ( A)È  Aj$    Aô ä# A k"$  (! (! B7 (!  (!A A 6¨Í Aª    A (¨Í !A A 6¨Í @@ AF\r @@@@ ("Aj  (! ( (!A A 6¨Í      A (¨Í !A A 6¨Í  AF\r  6A!@  F\r A6 AÆ 6  )7    !  6  (!A A 6¨Í Aª    A (¨Í !A A 6¨Í @ AF\r  Aj! !Ý  A6 AÝ 6  )7  Aj   6  6 A j$  !Ý   6  6      Aô Ã# Ak"$ @@  - AG\r  AÛ Ä !  ( Ã  AÝ Ä  A.Ä !  ( Ã @  ("- A¯jAÿqAI\r  A6 A 6  )7      (!  Ã  Aj$    Aô Ñ# A k"$  AÛ Ä !  ( Ã  A6 AÀ 6  )7  Aj !  ( Ã  AÝ Ä !@  ("- A¯jAÿqAI\r  A6 A 6  )7      (!  Ã  A j$    Aô c@@  ("E\r     Aj ( (  \r  ( Ã   Aj Aû Ä " Ó   Aý Ä    Aô D  A(Æ   ( Ã  A)È  A(Æ   ( Ã  A)È    Aô # A0k"$  A6, AÓ 6(  )(7  Aj !@@  - \r   (E\r Aû Æ   ( Ã @@  - \r   (E\r Aý È @  - AG\r  A	6$ AÌ 6   ) 7  Aj   (E\r  A6 A 6  )7    !  ( Ã  A;Ä  A0j$    Aô `# Ak"$  A\n6 AÈ 6  )7    !  ( Ã  A;Ä  Aj$    Aô `# Ak"$  A\n6 Aô 6  )7    !  ( Ã  A;Ä  Aj$    Aô Ü# Ak"$  A6 A 6  )7    !@  (E\r  A Ä "A(Æ   Aj Ó  A)È  A Ä "Aû Æ   ("  (Atj! @@   G\r  A Ä Aý È  Aj$  (  Ã  Aj!    A$ô î# Aà k"$   ( Ã  A6\\ AÃ 6X  )X7   A j !  ( Ã  A6T Aâ 6P  )P7  Aj !@@  (\r  A6L AÁ 6H AÈ j! @  (-  Aî G\r  Aù 6@ A6D  )@7  Aj   (!   (Aj6<  Aj68 A8j!    )70 A0j!    ) 7  Aj !  A6, Aø 6(  )(7      Aà j$    Aô # A k"$  A	6 A× 6  )7    "A(Æ   (!  AÀ\n;  A*:    6 A´Ü 6 Aj   A)È  A j$    Aô    Aj Ó    Aô U# Ak"$  A6 AÑ 6  )7    !  ( Ã  Aj$     (" ( (     Aô b# Ak"$   ( Ã  A6 Aß 6  )7    !  ( Ã  Aj$ G   AjA¿ !  ( !  A:    6  AÔé 6     / AàqAÀ\nr;      Aô `# Ak"$  A6 A 6  )7    "  ( ( (   Aj$    Aô U# Ak"$  A	6 Aÿ 6  )7    !  ( Ã  Aj$    Aô U# Ak"$  A6 AÉ 6  )7    !  ( Ã  Aj$     (" ( (     Aô U# Ak"$  A6 Aß 6  )7    !  ( Ã  Aj$ È~# A0k"$    · @@ (AI\r   ) ! A6$ A 6   7(  7  ) 7 Aj AjÐ E\r    ( Aj6     (Azj6 A0j$  Aµ 6 AÎ\r6 AÕ 6 AÙ        (AtAÌ j( Ñ    Aô x~# A k"$  A6 AÜ 6  )7  Aj ! Aj  ¶   )"7  7     A j$    Aô ¤~# AÀ k"$  A6< AÜ 68  )87(  A(j ! A0j    ( (    )0"78  7   A j !@  (AI\r  A6< A£ 68  )87  Aj !@  (AG\r  A6< AÁ 68  )87  Aj  A6< Aø 68  )87  Aj  AÀ j$     (" ( (     Aô °~# A0k"$    ( ( (   A6, AÉ 6(  )(7  Aj !   )"7  7   Aj ! A6 AÌ 6  )7     A0j$    Aô %  AÛ Æ   Aj Ó  AÝ È    Aô # A k"$ @  - AG\r  A6 A 6  )7  Aj  Aj  ("   ( (    )7     A j$     (" ( (     Aô )   ( Ã  AÀ Ä !  ( Ã     (" ( (     Aô b# Ak"$   ( Ã  A	6 Aë 6  )7    !  ( Ã  Aj$     (" ( (     Aô b# Ak"$   ( Ã  A6 Aß 6  )7    !  ( Ã  Aj$    Aô b# Ak"$   ( Ã  A6 Aß 6  )7    !  ( Ã  Aj$ e@@ (AF\r   (! (!  (!A ! A 6  6A !@  O\r   ( Atj(  ª ! e@@ (AF\r   (! (!  (!A ! A 6  6A !@  O\r   ( Atj(  ¬ ! e@@ (AF\r   (! (!  (!A ! A 6  6A !@  O\r   ( Atj(  ® ! p@@ (AF\r   (! (!  (!A ! A 6  6@  O\r   ( Atj( "    ( (  !      Aô j@@ (AF\r   (! (!  (!A ! A 6  6@  O\r    ( Atj(  ( (  j@@ (AF\r   (! (!  (!A ! A 6  6@  O\r    ( Atj(  ( (     Aô å# A k"$  (! A 6 AÇ 6 A6  )7  Aj !A A 6¨Í A·   Aj  A (¨Í ! A A 6¨Í @  AF\r  A6 Aø 6  )7      6 A j$  !Ý   6       (" ( (     Aô    ( Ã   ( Ã    Aô    Aj Ó    Aô    ( Ã    Aô _# Ak"$  A6 AÏ 6  )7   Aj   " Ó   AÝ Ä  Aj$    Aô U# Ak"$  A6 Aî 6  )7    !  ( Ã  Aj$  A A   A(ô # Ak"$ @  ("E\r    ( (    ( ª \r  A6 AÓ 6  )7      ( Ã  Aj$ Ú# Aà k"$  A(Æ   Aj Ó  A)È @  ("E\r    ( (  @  ( "AqE\r  A6\\ A 6X  )X7(  A(j   ( !@ AqE\r  A	6T A 6P  )P7   A j   ( !@ AqE\r  A	6L A§ 6H  )H7  Aj @@@@  - $Aj  AÐ 6@A! AÀ j! AÌ 68A! A8j!  6  ) 7  Aj @  ("E\r   Ã @  (E\r  A\n64 Aô 60  )07  Aj !  ( Ã  Aà j$    Aô £~# A0k"$   ( Ã  A6, A÷ 6(  )(7  Aj !   )"7  7   Aj !  A6 Aõ 6  )7      A0j$    Aô k# Ak"$  A6 AÍ 6  )7    "A(Æ   ( AA Ç  A)È  Aj$    Aô g# Ak"$  A6 Aâ 6  )7    "A(Æ   Aj Ó  A)È  Aj$  A A   A ô a# Ak"$    ( ( (   A6 AÓ 6  )7     Aj$ # AÐ k"$  A(Æ   Aj Ó  A)È    ( ( (  @  ("AqE\r  A6L A 6H  )H7   A j   (!@ AqE\r  A	6D A 6@  )@7  Aj   (!@ AqE\r  A	6< A§ 68  )87  Aj @@@@  - Aj  AÐ 60A! A0j! AÌ 6(A! A(j!  6  ) 7  Aj @  (E\r  A Ä !  ( Ã  AÐ j$    Aô £~# A0k"$   ( Ã  A6, AÇ 6(  )(7  Aj !   )"7  7   Aj !  A6 Aø 6  )7      A0j$    Aô ~# A k"$   ( Ã  A6 AÓ 6  )7  Aj !   )"7   7   !@  (" E\r    Ã  A j$    ( ª    ( ¬    ( ®    Aô é# A0k"$    ( ( (  @  ("AqE\r  A6, A 6(  )(7  Aj   (!@ AqE\r  A	6$ A 6   ) 7  Aj   (!@ AqE\r  A	6 A§ 6  )7     A0j$     ( ( (     Aô a~# Ak"$    )"7   7   A(Ä !  ( Ã  A)Ä  Aj$    Aô U# Ak"$  A6 A¼ 6  )7    !  ( Ã  Aj$    Aô # A k"$ @  - \r  A	6 Aý 6  )7  Aj  A6 A 6  )7    "A(Æ   ( AA Ç  A)È  A j$    Aô Z~# Ak"$    ( ( (     )"7   7    Aj$    Aô # A k"$  A\r6 AÑ 6  )7  Aj !  ( Ã  A6 AÌ 6  )7     A j$    Aô # A k"$   ( Ã  A6 AÖ 6  )7  Aj !@  (" E\r    Ã  A6 AÌ 6  )7     A j$  A Aä~# A°k"$ A !@  (" - AG\r    )"7  BpBÀ R\r  A6¬ A 6¨  )¨7P A j AÐ j \r   (6¬  6¨ A"Ä ! ( " (Atj!A !	@@@@@  F"\r @ ( "- AÍ F\r  A¨j  ("  (j!\nA !@@   \nF\r@ AJ\r   -  "APjAÿqA	K\r   Aj!  A\nl jAPj! A¨j @ AH\r  A¨j @@@@@@@@@@ 	AqE\r @ APjA\nI\r @ Ayj	\n @ A¤j  A¿jAI\r  A"G\r\n A6¤ Aã 6   ) 7H  AÈ j @ Ayj  A"F\r\n AÜ G\r A6\\ AÎ 6X  )X7@  AÀ j \n A6 A 6  )7    	 A6 Aù 6  )7  Aj  A6 Aß 6  )7  Aj  A6 A 6  )7  Aj  A6| A 6x  )x7   A j  A6t A 6p  )p7(  A(j  A6l Aø 6h  )h70  A0j @@ A H\r  Aÿ G\r AÜ Ä ! @ AH\r   Aø Ä ! AI\r   Av, ð Ä    Aq, ð Ä A!	  ÀÄ  A"Ä  A6d AÝ 6`  )`78  A8j A !	 Aj!  A°j$  1  ( " (  ("  ( (     6   Aô     ( ( (  £# AÀ k"$ @ ("E\r @ ( jAj-  AÝ F\r  A6< AÓ 68  )87   A j  A64 AÝ 60  )07  Aj !@  ("E\r   Ã  A6, AÌ 6(  )(7  Aj "  ( ( (   AÀ j$  Aµ 6 AÈ6 A 6 AÙ       ( ª    Aô ß# A0k"$    ( ( (  @@@  ( ¬ \r   ( ® E\r Aø 6( A(j! AÓ 6  A j! A6  ) 7  Aj !  ( Ã  A6 A° 6  )7  Aj  A0j$ # Ak"$ @@  ( ¬ \r   ( ® E\r A6 Aõ 6  )7       ( ( (   Aj$    Aô V~# Ak"$    )"7   7   A Ä !  ( Ã  Aj$    ( ª    Aô ~# Aà k"$ @@@  ("- AG\r   !  (! \r   ( (  @  ( ¬ E\r  A6\\ AÓ 6X  )X7(  A(j @@  ( ¬ \r   ( ® E\r A6T Aø 6P  )P7   A j  A½ 6H AÈ j!  A6D A´ 6@  )@7  Aj !   )"7  78   Aj  Aø 60 A0j!   A6   ) 7  Aj  Aà j$ ~# A k"$ A !@  (" - AG\r    )"7A ! BpB°R\r  A6 A± 6  )7 Aj Aj E! A j$  ©# Ak"$ @@  ("- AG\r   \r  (!@@  ¬ \r   ( ® E\r A6 Aõ 6  )7       ( ( (   Aj$    ( ª       Aô »# AÀ k"$ @@  - \r   A: A A 6¨Í A¸  A8j    A (¨Í !A A 6¨Í  AF\r@ (<"E\r  ( (!A A 6¨Í     A (¨Í !A A 6¨Í  AF\rA A 6¨Í Aµ    !A (¨Í !A A 6¨Í  AF\r@ E\r  A64 AÓ 60  )07  Aj A A 6¨Í Aµ    !A (¨Í !A A 6¨Í  AF\r@@ \r A A 6¨Í A¶    !A (¨Í !A A 6¨Í  AF\r E\r A6, Aø 6(  )(7  Aj  AA (8"6$ AÍ AÑ  6   ) 7  Aj   A :  AÀ j$  !Ý   A :    ¯# AÀ k"$  (!   ("6 B 7   AÀ j6  A j"6  6 B 7( B 70 B 78@@@@@@@ ( (!A A 6¨Í     !A (¨Í !A A 6¨Í  AF\r - A\rG\r ("   H! (! (!@@ (" (F\r  !  k"	At!@@  G\r  Ê "E\r@  F\r  	E\r    	ü\n    6   Í "6 E\r   	AuAtj6  	j!  Aj"6  6   kAu"AI\r @ AjAv" I\r    6    6 AÕ 6 A A 6¨Í  A6 Aæ 6A AÙ   A (¨Í !A A 6¨Í  AF\r    Atj( G\r   A 6   6  !Ý    6    6 Aj   AÀ j$  !Ý    6    6   6    6«   Aj     # A k"$ @@  - \r   A: A A 6¨Í A¸  Aj    A (¨Í !A A 6¨Í  AF\r@ ("E\r A A 6¨Í Aµ    !A (¨Í !A A 6¨Í  AF\r@@ \r A A 6¨Í A¶    !A (¨Í !A A 6¨Í  AF\r E\r A6 Aõ 6  )7  Aj  ( (!A A 6¨Í     A (¨Í !A A 6¨Í  AF\r  A :  A j$  !Ý   A :     @  ( "  AjF\r  Ì   # Ak"$    6  Alj( "(!  A 6  A A  Aj¼ !@@ (\r  E\r   6  Ì    ´ AjÊ "6    ±  A 6 @Aðµ   AjA (ðµ (  E\r   ("   ( (  " ´ AjÊ "6    ±  Aj$ ú Aäoperator~ {...} operator|| operator|  imaginary Ty nx  complex Dx -+   0X0x -0X+0X 0X-0x+0x 0x tw throw operator new Dw \\v Dv Tu  const const_cast reinterpret_cast static_cast dynamic_cast unsigned short  noexcept __cxa_decrement_exception_refcount unsigned int _BitInt operator co_await struct  restrict objc_object _Sat short _Fract _Sat unsigned short _Fract _Sat _Fract _Sat long _Fract _Sat unsigned long _Fract _Sat unsigned _Fract float _Float std::nullptr_t wchar_t char8_t std::bfloat16_t char16_t char32_t \\t Ut Tt St this gs requires Memory write out of bounds Memory read out of bounds Ts %s:%d: %s nullptr sr operator allocator Unknown error unsigned char \\r rq sp /emsdk/emscripten/system/lib/libcxxabi/src/private_typeinfo.cpp /emsdk/emscripten/system/lib/libcxxabi/src/cxa_exception_emscripten.cpp /emsdk/emscripten/system/lib/libcxxabi/src/cxa_demangle.cpp /emsdk/emscripten/system/lib/libcxxabi/src/fallback_malloc.cpp Stack underflow on pop fp Tp  auto objcproto so Do terminate_handler unexpectedly threw an exception union dn nan \\n Tn Dn enum _Sat short _Accum _Sat unsigned short _Accum _Sat _Accum _Sat long _Accum _Sat unsigned long _Accum _Sat unsigned _Accum basic_iostream basic_ostream basic_istream ul tl bool ull il string literal Ul yptnk Tk pi li Stack overflow on push /emsdk/emscripten/system/lib/libcxxabi/src/demangle/Utility.h /emsdk/emscripten/system/lib/libcxxabi/src/demangle/ItaniumDemangle.h unsigned long long unsigned long basic_string __uuidof inf half %af \\f true operator delete false decltype  volatile long double _block_invoke Te std void terminate_handler unexpectedly returned \'unnamed std::bad_alloc mc \\b Ub 16b \'lambda \\a %a basic_ operator^ operator new[] operator[] operator delete[] \\\\ pixel vector[ sZ ____Z fpT $TT Stack underflow on RET $T rQ sP DO srN _GLOBAL__N NAN $N fL %LaL Stack overflow on CALL Ua9enable_ifI INF RE OE b1E b0E DC catching a class without an object? operator? operator> <char, std::char_traits<char> , std::allocator<char> operator>> operator<=> operator-> operator|= operator= operator^= operator>= operator>>= operator== operator<= operator<<= operator/= operator-= operator+= operator*= operator&= operator%= operator!= operator< template< id< operator<< .< "< [abi:  [enable_if: std:: unsigned __int128 __float128 decimal128 decimal64 decimal32 exception_header->referenceCount > 0 operator/ operator. sizeof... operator- -in- operator-- operator, operator+ operator++ operator* operator->* ::* operator.*  decltype(auto) (null) (anonymous namespace) operator()  ( operator name does not start with \'operator\' \'block-literal\' operator& operator&&  &&  & operator% \\" >" "" Invalid access! Popping empty vector! operator! shrinkToSize() can\'t expand! Pure virtual function called! throw  noexcept   at offset  this   requires  operator  reference temporary for  template parameter object for  typeinfo for  thread-local wrapper routine for  thread-local initialization routine for  typeinfo name for  construction vtable for  guard variable for  VTT for  covariant return thunk to  non-virtual thunk to  invocation function for block in  alignof  sizeof  > typename  initializer for module  ::friend  typeid  unsigned   ?   ->   =  libc++abi:  Unknown opcode:   :  sizeof...   ...  ,  operator""  C++: load_rom called with size %d\n Draw flag set at cycle %d\n First 4 bytes: %02X %02X %02X %02X\n C++: ROM loaded successfully, PC set to 0x%X\n Cycle %d: PC = 0x%X\n ERROR: data is NULL\n ERROR: get_raw_pixels() returned NULL\n           ðð `  pðððððððððððððð @@ððððððððàààððààððððððE                N ë§~ uú ¹,ý·z¼ Ì¢ =I×  *_·úXÙýÊ½áÍÜ@x }gaì å\nÔ Ì>Ov¯  D ® ®` úw!ë+ `A ©£nN                                                        *                    \'9H                                  8R`S  Ê        »Ûë+;PSuccess Illegal byte sequence Domain error Result not representable Not a tty Permission denied Operation not permitted No such file or directory No such process File exists Value too large for defined data type No space left on device Out of memory Resource busy Interrupted system call Resource temporarily unavailable Invalid seek Cross-device link Read-only file system Directory not empty Connection reset by peer Operation timed out Connection refused Host is down Host is unreachable Address in use Broken pipe I/O error No such device or address Block device required No such device Not a directory Is a directory Text file busy Exec format error Invalid argument Argument list too long Symbolic link loop Filename too long Too many open files in system No file descriptors available Bad file descriptor No child process Bad address File too large Too many links No locks available Resource deadlock would occur State not recoverable Owner died Operation canceled Function not implemented No message of desired type Identifier removed Device not a stream No data available Device timeout Out of streams resources Link has been severed Protocol error Bad message File descriptor in bad state Not a socket Destination address required Message too large Protocol wrong type for socket Protocol not available Protocol not supported Socket type not supported Not supported Protocol family not supported Address family not supported by protocol Address not available Network is down Network unreachable Connection reset by network Connection aborted No buffer space available Socket is connected Socket not connected Cannot send after socket shutdown Operation already in progress Operation in progress Stale file handle Remote I/O error Quota exceeded No medium found Wrong medium type Multihop attempted Required key not available Key has expired Key has been revoked Key was rejected by service             	             \n\n\n  	  	                               \r \r   	   	                                               	                                                  	                                                   	                                              	                                                      	                                                   	         0123456789ABCDEF    \n   d   è  \'    @B   áõ Ê;        00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899 ¤ ð N10__cxxabiv116__shim_type_infoE     Ô  N10__cxxabiv117__class_type_infoE      N10__cxxabiv117__pbase_type_infoE    4 ø N10__cxxabiv119__pointer_type_infoE     È                             ¨                          ´ È N10__cxxabiv120__si_class_type_infoE         \r       !   ` ø St9exception      ð St9bad_alloc        L    "   #       Ð    $   %    X ð St11logic_error     |    &   #     L St12length_error        °    \'   #    ¼ L St12out_of_range     Ü ð St13runtime_error   ` ø St9type_info        ( 9   :   ;   <   =   >   ` 0 N12_GLOBAL__N_116itanium_demangle12OutputBufferE         ?   @   A   B   C   D   E   F   G   H      Ð N12_GLOBAL__N_116itanium_demangle11SpecialNameE ` Ø N12_GLOBAL__N_116itanium_demangle4NodeE     Ð ?   @   A   B   C   D   E   I   J   H       ` ?   @   A   B   C   D   E   K   L   H    l Ð N12_GLOBAL__N_116itanium_demangle21CtorVtableSpecialNameE       Ø ?   @   A   B   C   M   E   N   O   H    ä Ð N12_GLOBAL__N_116itanium_demangle8NameTypeE     @ ?   @   A   B   C   D   E   P   Q   H    L Ð N12_GLOBAL__N_116itanium_demangle10ModuleNameE      ¬ R   S   T   U   C   D   E   V   W   X    ¸ Ð N12_GLOBAL__N_116itanium_demangle24ForwardTemplateReferenceE            aN" aS" aaA\n ad 7\n an7\n at6 aw\n  az6 cc  clì	 cm${	 co    cpì	 cvn dV"S da¼ dc°  de 	 dlç ds´	 dtM	 dv"C	 eO" eo eq1 ge gt ix± lS"G le< ls¸ lt  mI"^ mL"t mia	 ml\n	 mmp	 na¢ ne ng a	 nt \n nwh  oR"ú oo  or  pL"i pl	 pm	¤	 pp	 ps 	 ptï qu	  rM" rS"% rc  rm\nS\n rsØ sc¤  ssã st? sz? teu tiu     (! ?   @   A   B   C   D   E   Y   Z   H    4! Ð N12_GLOBAL__N_116itanium_demangle10BinaryExprE      ! ?   @   A   B   C   D   E   [   \\   H     ! Ð N12_GLOBAL__N_116itanium_demangle10PrefixExprE       " ?   @   A   B   C   D   E   ]   ^   H    " Ð N12_GLOBAL__N_116itanium_demangle11PostfixExprE     l" ?   @   A   B   C   D   E   _   `   H    x" Ð N12_GLOBAL__N_116itanium_demangle18ArraySubscriptExprE      à" ?   @   A   B   C   D   E   a   b   H    ì" Ð N12_GLOBAL__N_116itanium_demangle10MemberExprE      L# ?   @   A   B   C   D   E   c   d   H    X# Ð N12_GLOBAL__N_116itanium_demangle7NewExprE      ´# ?   @   A   B   C   D   E   e   f   H    À# Ð N12_GLOBAL__N_116itanium_demangle10DeleteExprE       $ ?   @   A   B   C   D   E   g   h   H    ,$ Ð N12_GLOBAL__N_116itanium_demangle8CallExprE     $ ?   @   A   B   C   D   E   i   j   H    $ Ð N12_GLOBAL__N_116itanium_demangle14ConversionExprE      ø$ ?   @   A   B   C   D   E   k   l   H    % Ð N12_GLOBAL__N_116itanium_demangle15ConditionalExprE     h% ?   @   A   B   C   D   E   m   n   H    t% Ð N12_GLOBAL__N_116itanium_demangle8CastExprE     Ð% ?   @   A   B   C   D   E   o   p   H    Ü% Ð N12_GLOBAL__N_116itanium_demangle13EnclosingExprE       @& ?   @   A   B   C   D   E   q   r   H    L& Ð N12_GLOBAL__N_116itanium_demangle14IntegerLiteralE      °& ?   @   A   B   C   D   E   s   t   H    ¼& Ð N12_GLOBAL__N_116itanium_demangle8BoolExprE     \' ?   @   A   B   C   D   E   u   v   H    $\' Ð N12_GLOBAL__N_116itanium_demangle16FloatLiteralImplIfEE     \' ?   @   A   B   C   D   E   w   x   H    \' Ð N12_GLOBAL__N_116itanium_demangle16FloatLiteralImplIdEE      ( ?   @   A   B   C   D   E   y   z   H    ( Ð N12_GLOBAL__N_116itanium_demangle16FloatLiteralImplIeEE     t( ?   @   A   B   C   D   E   {   |   H    ( Ð N12_GLOBAL__N_116itanium_demangle13StringLiteralE       ä( ?   @   A   B   C   D   E   }   ~   H    ð( Ð N12_GLOBAL__N_116itanium_demangle15UnnamedTypeNameE     T) ?   @   A   B   C   D   E         H    `) Ð N12_GLOBAL__N_116itanium_demangle26SyntheticTemplateParamNameE      Ð) ?   @   A   B   C   D   E             Ü) Ð N12_GLOBAL__N_116itanium_demangle21TypeTemplateParamDeclE       H* ?   @   A   B   C   D   E             T* Ð N12_GLOBAL__N_116itanium_demangle32ConstrainedTypeTemplateParamDeclE        Ì* ?   @   A   B   C   D   E             Ø* Ð N12_GLOBAL__N_116itanium_demangle24NonTypeTemplateParamDeclE        H+ ?   @   A   B   C   D   E             T+ Ð N12_GLOBAL__N_116itanium_demangle25TemplateTemplateParamDeclE       Ä+ ?   @   A   B   C   D   E             Ð+ Ð N12_GLOBAL__N_116itanium_demangle21TemplateParamPackDeclE       <, ?   @   A   B   C   D   E         H    H, Ð N12_GLOBAL__N_116itanium_demangle15ClosureTypeNameE     ¬, ?   @   A   B   C   D   E         H    ¸, Ð N12_GLOBAL__N_116itanium_demangle10LambdaExprE      - ?   @   A   B   C   D   E         H    $- Ð N12_GLOBAL__N_116itanium_demangle11EnumLiteralE     - ?   @   A   B   C   D   E         H    - Ð N12_GLOBAL__N_116itanium_demangle13FunctionParamE       ô- ?   @   A   B   C   D   E         H     . Ð N12_GLOBAL__N_116itanium_demangle8FoldExprE     \\. ?   @   A   B   C   D   E         H    h. Ð N12_GLOBAL__N_116itanium_demangle22ParameterPackExpansionE      Ô. ?   @   A   B   C   D   E         H    à. Ð N12_GLOBAL__N_116itanium_demangle10BracedExprE      @/ ?   @   A   B   C   D   E         H    L/ Ð N12_GLOBAL__N_116itanium_demangle15BracedRangeExprE     °/ ?   @   A   B   C   D   E       ¡   H    ¼/ Ð N12_GLOBAL__N_116itanium_demangle12InitListExprE         0 ?   @   A   B   C   D   E   ¢   £   H    ,0 Ð N12_GLOBAL__N_116itanium_demangle29PointerToMemberConversionExprE        0 ?   @   A   B   C   D   E   ¤   ¥   H    ¬0 Ð N12_GLOBAL__N_116itanium_demangle15ExprRequirementE     1 ?   @   A   B   C   D   E   ¦   §   H    1 Ð N12_GLOBAL__N_116itanium_demangle15TypeRequirementE     1 ?   @   A   B   C   D   E   ¨   ©   H    1 Ð N12_GLOBAL__N_116itanium_demangle17NestedRequirementE       ô1 ?   @   A   B   C   D   E   ª   «   H     2 Ð N12_GLOBAL__N_116itanium_demangle12RequiresExprE        d2 ?   @   A   B   C   D   E   ¬   ­   H    p2 Ð N12_GLOBAL__N_116itanium_demangle13SubobjectExprE       Ô2 ?   @   A   B   C   D   E   ®   ¯   H    à2 Ð N12_GLOBAL__N_116itanium_demangle19SizeofParamPackExprE     H3 ?   @   A   B   C   D   E   °   ±   H    T3 Ð N12_GLOBAL__N_116itanium_demangle13NodeArrayNodeE       ¸3 ?   @   A   B   C   D   E   ²   ³   H    Ä3 Ð N12_GLOBAL__N_116itanium_demangle9ThrowExprE        $4 ?   @   A   B   C   ´   E   µ   ¶   H    04 Ð N12_GLOBAL__N_116itanium_demangle13QualifiedNameE       4 ?   @   A   B   C   D   E   ·   ¸   H     4 Ð N12_GLOBAL__N_116itanium_demangle8DtorNameE     ü4 ?   @   A   B   C   D   E   ¹   º   H    5 Ð N12_GLOBAL__N_116itanium_demangle22ConversionOperatorTypeE      t5 ?   @   A   B   C   D   E   »   ¼   H    5 Ð N12_GLOBAL__N_116itanium_demangle15LiteralOperatorE     ä5 ?   @   A   B   C   ½   E   ¾   ¿   H    ð5 Ð N12_GLOBAL__N_116itanium_demangle19GlobalQualifiedNameE     X6 ?   @   A   B   C   À   E   Á   Â   H    d6 6 N12_GLOBAL__N_116itanium_demangle19SpecialSubstitutionE  ¨6 Ð N12_GLOBAL__N_116itanium_demangle27ExpandedSpecialSubstitutionE     6 ?   @   A   B   C   Ã   E   Ä   Å   H       H7 ?   @   A   B   C   Æ   E   Ç   È   H    T7 Ð N12_GLOBAL__N_116itanium_demangle10AbiTagAttrE      ´7 ?   @   A   B   C   D   E   É   Ê   H    À7 Ð N12_GLOBAL__N_116itanium_demangle21StructuredBindingNameE       ,8 ?   @   A   B   C   D   E   Ë   Ì   H    88 Ð N12_GLOBAL__N_116itanium_demangle12CtorDtorNameE        8 ?   @   A   B   C   Í   E   Î   Ï   H    ¨8 Ð N12_GLOBAL__N_116itanium_demangle12ModuleEntityE        9 ?   @   A   B   C   Ð   E   Ñ   Ò   H    9 Ð N12_GLOBAL__N_116itanium_demangle20MemberLikeFriendNameE        9 ?   @   A   B   C   Ó   E   Ô   Õ   H    9 Ð N12_GLOBAL__N_116itanium_demangle10NestedNameE      ð9 ?   @   A   B   C   D   E   Ö   ×   H    ü9 Ð N12_GLOBAL__N_116itanium_demangle9LocalNameE        \\: Ø   Ù   Ú   Û   C   D   E   Ü   Ý   Þ    h: Ð N12_GLOBAL__N_116itanium_demangle13ParameterPackE       Ì: ?   @   A   B   C   D   E   ß   à   H    Ø: Ð N12_GLOBAL__N_116itanium_demangle12TemplateArgsE        <; ?   @   A   B   C   á   E   â   ã   H    H; Ð N12_GLOBAL__N_116itanium_demangle20NameWithTemplateArgsE        ´; ?   @   A   B   C   D   E   ä   å   H    À; Ð N12_GLOBAL__N_116itanium_demangle20TemplateArgumentPackE        ,< ?   @   A   B   C   D   E   æ   ç   H    8< Ð N12_GLOBAL__N_116itanium_demangle25TemplateParamQualifiedArgE       ¨< ?   @   A   B   C   D   E   è   é   H    ´< Ð N12_GLOBAL__N_116itanium_demangle12EnableIfAttrE        = ?   @   A   B   C   D   E   ê   ë   H    $= Ð N12_GLOBAL__N_116itanium_demangle23ExplicitObjectParameterE     = ì   @   í   B   C   D   E   î   ï   ð    = Ð N12_GLOBAL__N_116itanium_demangle16FunctionEncodingE        > ?   @   A   B   C   D   E   ñ   ò   H    > Ð N12_GLOBAL__N_116itanium_demangle9DotSuffixE        p> ?   @   A   B   C   D   E   ó   ô   H    |> Ð N12_GLOBAL__N_116itanium_demangle12NoexceptSpecE        à> ?   @   A   B   C   D   E   õ   ö   H    ì> Ð N12_GLOBAL__N_116itanium_demangle20DynamicExceptionSpecE        X? ÷   @   ø   B   C   D   E   ù   ú   û    d? Ð N12_GLOBAL__N_116itanium_demangle12FunctionTypeE        È? ?   @   A   B   C   D   E   ü   ý   H    Ô? Ð N12_GLOBAL__N_116itanium_demangle13ObjCProtoNameE       8@ ?   @   A   B   C   D   E   þ   ÿ   H    D@ Ð N12_GLOBAL__N_116itanium_demangle17VendorExtQualTypeE       ¬@        B   C   D   E          ¸@ Ð N12_GLOBAL__N_116itanium_demangle8QualTypeE     A ?   @   A   B   C   D   E       H     A Ð N12_GLOBAL__N_116itanium_demangle15TransformedTypeE     A ?   @   A   B   C   D   E     	  H    A Ð N12_GLOBAL__N_116itanium_demangle12BinaryFPTypeE        ôA ?   @   A   B   C   D   E   \n    H     B Ð N12_GLOBAL__N_116itanium_demangle10BitIntTypeE      `B ?   @   A   B   C   D   E     \r  H    lB Ð N12_GLOBAL__N_116itanium_demangle20PostfixQualifiedTypeE        ØB ?   @   A   B   C   D   E       H    äB Ð N12_GLOBAL__N_116itanium_demangle15PixelVectorTypeE     HC ?   @   A   B   C   D   E       H    TC Ð N12_GLOBAL__N_116itanium_demangle10VectorTypeE      ´C     A   B     D   E          ÀC Ð N12_GLOBAL__N_116itanium_demangle9ArrayTypeE    0123456789ABCDEF        4D   @   A   B   C   D   E          @D Ð N12_GLOBAL__N_116itanium_demangle19PointerToMemberTypeE     ¨D ?   @   A   B   C   D   E       H    ´D Ð N12_GLOBAL__N_116itanium_demangle22ElaboratedTypeSpefTypeE       E   @   A   B   C   D   E        !   ,E Ð N12_GLOBAL__N_116itanium_demangle11PointerTypeE     E "  @   A   B   C   D   E   #  $  %   E Ð N12_GLOBAL__N_116itanium_demangle13ReferenceTypeE   w ¼ ¼ ¿ ± ¢  AèÀ                                                °`                            ÿÿÿÿÿÿÿÿ                                                            ðE                                             ¸`                           ÿÿÿÿ\n                                                               F ` Àh     A¨=$autoResumeAudioContext,$dynCall $stringToUTF8,$UTF8ToString  target_features+bulk-memory+bulk-memory-opt+call-indirect-overlong+\nmultivalue+mutable-globals+nontrapping-fptoint+reference-types+sign-ext');
}

function getBinarySync(file) {
  return file;
}

async function getWasmBinary(binaryFile) {

  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);

    // Warn on some common problems.
    if (isFileURI(binaryFile)) {
      err(`warning: Loading from a file URI (${binaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
    }
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  // prepare imports
  var imports = {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  };
  return imports;
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    wasmExports = instance.exports;

    assignWasmExports(wasmExports);

    updateMemoryViews();

    return wasmExports;
  }

  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    return receiveInstance(result['instance']);
  }

  var info = getWasmImports();

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module['instantiateWasm']) {
    return new Promise((resolve, reject) => {
      try {
        Module['instantiateWasm'](info, (inst, mod) => {
          resolve(receiveInstance(inst, mod));
        });
      } catch(e) {
        err(`Module.instantiateWasm callback failed with error: ${e}`);
        reject(e);
      }
    });
  }

  wasmBinaryFile ??= findWasmBinary();
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
  var exports = receiveInstantiationResult(result);
  return exports;
}

// end include: preamble.js

// Begin JS library code


  class ExitStatus {
      name = 'ExitStatus';
      constructor(status) {
        this.message = `Program terminated with exit(${status})`;
        this.status = status;
      }
    }

  /** @type {!Int16Array} */
  var HEAP16;

  /** @type {!Int32Array} */
  var HEAP32;

  /** not-@type {!BigInt64Array} */
  var HEAP64;

  /** @type {!Int8Array} */
  var HEAP8;

  /** @type {!Float32Array} */
  var HEAPF32;

  /** @type {!Float64Array} */
  var HEAPF64;

  /** @type {!Uint16Array} */
  var HEAPU16;

  /** @type {!Uint32Array} */
  var HEAPU32;

  /** not-@type {!BigUint64Array} */
  var HEAPU64;

  /** @type {!Uint8Array} */
  var HEAPU8;

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };
  var onPostRuns = [];
  var addOnPostRun = (cb) => onPostRuns.push(cb);

  var onPreRuns = [];
  var addOnPreRun = (cb) => onPreRuns.push(cb);


  
    /**
   * @param {number} ptr
   * @param {string} type
   */
  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[ptr];
      case 'i8': return HEAP8[ptr];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP64[((ptr)>>3)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  var noExitRuntime = true;

  function ptrToString(ptr) {
      assert(typeof ptr === 'number', `ptrToString expects a number, got ${typeof ptr}`);
      // Convert to 32-bit unsigned value
      ptr >>>= 0;
      return '0x' + ptr.toString(16).padStart(8, '0');
    }

  
    /**
   * @param {number} ptr
   * @param {number} value
   * @param {string} type
   */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[ptr] = value; break;
      case 'i8': HEAP8[ptr] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': HEAP64[((ptr)>>3)] = BigInt(value); break;
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var stackRestore = (val) => __emscripten_stack_restore(val);

  var stackSave = () => _emscripten_stack_get_current();

  var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        err(text);
      }
    };

  

  var UTF8Decoder = globalThis.TextDecoder && new TextDecoder();
  
  var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
      var maxIdx = idx + maxBytesToRead;
      if (ignoreNul) return maxIdx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.
      // As a tiny code save trick, compare idx against maxIdx using a negation,
      // so that maxBytesToRead=undefined/NaN means Infinity.
      while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
      return idx;
    };
  
  
    /**
   * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
   * array that contains uint8 values, returns a copy of that string as a
   * Javascript String object.
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number=} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */
  var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
  
      var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
  
      // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce(`Invalid UTF-8 leading byte ${ptrToString(u0)} encountered when deserializing a UTF-8 string in wasm memory to a JS string!`);
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
    /**
   * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
   * emscripten HEAP, returns a copy of that string as a Javascript String object.
   *
   * @param {number} ptr
   * @param {number=} maxBytesToRead - An optional length that specifies the
   *   maximum number of bytes to read. You can omit this parameter to scan the
   *   string until the first 0 byte. If maxBytesToRead is passed, and the string
   *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
   *   string will cut short at that byte index.
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */
  var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => {
      assert(typeof ptr == 'number', `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : '';
    };
  var ___assert_fail = (condition, filename, line, func) =>
      abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);

  var exceptionCaught =  [];
  
  
  var uncaughtExceptionCount = 0;
  var ___cxa_begin_catch = (ptr) => {
      var info = new ExceptionInfo(ptr);
      if (!info.get_caught()) {
        info.set_caught(true);
        uncaughtExceptionCount--;
      }
      info.set_rethrown(false);
      exceptionCaught.push(info);
      return ___cxa_get_exception_ptr(ptr);
    };

  var exceptionLast = null;
  
  class ExceptionInfo {
      // excPtr - Thrown object pointer to wrap. Metadata pointer is calculated from it.
      constructor(excPtr) {
        this.excPtr = excPtr;
        this.ptr = excPtr - 24;
      }
  
      set_type(type) {
        HEAPU32[(((this.ptr)+(4))>>2)] = type;
      }
  
      get_type() {
        return HEAPU32[(((this.ptr)+(4))>>2)];
      }
  
      set_destructor(destructor) {
        HEAPU32[(((this.ptr)+(8))>>2)] = destructor;
      }
  
      get_destructor() {
        return HEAPU32[(((this.ptr)+(8))>>2)];
      }
  
      set_caught(caught) {
        caught = caught ? 1 : 0;
        HEAP8[(this.ptr)+(12)] = caught;
      }
  
      get_caught() {
        return HEAP8[(this.ptr)+(12)] != 0;
      }
  
      set_rethrown(rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[(this.ptr)+(13)] = rethrown;
      }
  
      get_rethrown() {
        return HEAP8[(this.ptr)+(13)] != 0;
      }
  
      // Initialize native structure fields. Should be called once after allocated.
      init(type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor);
      }
  
      set_adjusted_ptr(adjustedPtr) {
        HEAPU32[(((this.ptr)+(16))>>2)] = adjustedPtr;
      }
  
      get_adjusted_ptr() {
        return HEAPU32[(((this.ptr)+(16))>>2)];
      }
    }
  
  
  var setTempRet0 = (val) => __emscripten_tempret_set(val);
  var findMatchingCatch = (args) => {
      var thrown = exceptionLast?.excPtr;
      if (!thrown) {
        // just pass through the null ptr
        setTempRet0(0);
        return 0;
      }
      var info = new ExceptionInfo(thrown);
      info.set_adjusted_ptr(thrown);
      var thrownType = info.get_type();
      if (!thrownType) {
        // just pass through the thrown ptr
        setTempRet0(0);
        return thrown;
      }
  
      // can_catch receives a **, add indirection
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var caughtType of args) {
        if (caughtType === 0 || caughtType === thrownType) {
          // Catch all clause matched or exactly the same type is caught
          break;
        }
        var adjusted_ptr_addr = info.ptr + 16;
        if (___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)) {
          setTempRet0(caughtType);
          return thrown;
        }
      }
      setTempRet0(thrownType);
      return thrown;
    };
  var ___cxa_find_matching_catch_2 = () => findMatchingCatch([]);

  var ___cxa_find_matching_catch_3 = (arg0) => findMatchingCatch([arg0]);

  
  
  
  
  
  
  
  
  var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
  
  var getExceptionMessageCommon = (ptr) => {
      var sp = stackSave();
      var type_addr_addr = stackAlloc(4);
      var message_addr_addr = stackAlloc(4);
      ___get_exception_message(ptr, type_addr_addr, message_addr_addr);
      var type_addr = HEAPU32[((type_addr_addr)>>2)];
      var message_addr = HEAPU32[((message_addr_addr)>>2)];
      var type = UTF8ToString(type_addr);
      _free(type_addr);
      var message;
      if (message_addr) {
        message = UTF8ToString(message_addr);
        _free(message_addr);
      }
      stackRestore(sp);
      return [type, message];
    };
  var getExceptionMessage = (exn) => getExceptionMessageCommon(exn.excPtr);
  
  var decrementExceptionRefcount = (exn) => ___cxa_decrement_exception_refcount(exn.excPtr);
  
  var incrementExceptionRefcount = (exn) => ___cxa_increment_exception_refcount(exn.excPtr);
  var ___cxa_throw = (ptr, type, destructor) => {
      var info = new ExceptionInfo(ptr);
      // Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
      info.init(type, destructor);
      ___cxa_increment_exception_refcount(ptr);
      exceptionLast = new CppException(ptr);
      uncaughtExceptionCount++;
      throw exceptionLast;
    };

  var ___resumeException = (ptr) => {
      if (!exceptionLast) {
        exceptionLast = new CppException(ptr);
      }
      throw exceptionLast;
    };

  var __abort_js = () =>
      abort('native code called abort()');

  var getHeapMax = () =>
      // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
      // full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
      // for any code that deals with heap sizes, which would require special
      // casing all heap size related code to treat 0 specially.
      2147483648;
  
  var alignMemory = (size, alignment) => {
      assert(alignment, "alignment argument is required");
      return Math.ceil(size / alignment) * alignment;
    };
  
  var growMemory = (size) => {
      var oldHeapSize = wasmMemory.buffer.byteLength;
      var pages = ((size - oldHeapSize + 65535) / 65536) | 0;
      try {
        // round size grow request up to wasm page size (fixed 64KB per spec)
        wasmMemory.grow(pages); // .grow() takes a delta compared to the previous size
        updateMemoryViews();
        return 1 /*success*/;
      } catch(e) {
        err(`growMemory: Attempted to grow heap from ${oldHeapSize} bytes to ${size} bytes, but got error: ${e}`);
      }
      // implicit 0 return to save code size (caller will cast "undefined" into 0
      // anyhow)
    };
  var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      requestedSize >>>= 0;
      // With multithreaded builds, races can happen (another thread might increase the size
      // in between), so return a failure, and let the caller retry.
      assert(requestedSize > oldSize);
  
      // Memory resize rules:
      // 1.  Always increase heap size to at least the requested size, rounded up
      //     to next page multiple.
      // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
      //     geometrically: increase the heap size according to
      //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
      //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
      // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
      //     linearly: increase the heap size by at least
      //     MEMORY_GROWTH_LINEAR_STEP bytes.
      // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
      //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
      // 4.  If we were unable to allocate as much memory, it may be due to
      //     over-eager decision to excessively reserve due to (3) above.
      //     Hence if an allocation fails, cut down on the amount of excess
      //     growth, in an attempt to succeed to perform a smaller allocation.
  
      // A limit is set for how much we can grow. We should not exceed that
      // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
        return false;
      }
  
      // Loop through potential heap size increases. If we attempt a too eager
      // reservation that fails, cut down on the attempted size and reserve a
      // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); // ensure geometric growth
        // but limit overreserving (default to capping at +96MB overgrowth at most)
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296 );
  
        var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
  
        var replacement = growMemory(newSize);
        if (replacement) {
  
          return true;
        }
      }
      err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
      return false;
    };

  var SYSCALLS = {
  varargs:undefined,
  getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
  };
  var _fd_close = (fd) => {
      abort('fd_close called without SYSCALLS_REQUIRE_FILESYSTEM');
    };

  var INT53_MAX = 9007199254740992;
  
  var INT53_MIN = -9007199254740992;
  var bigintToI53Checked = (num) => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);
  function _fd_seek(fd, offset, whence, newOffset) {
    offset = bigintToI53Checked(offset);
  
  
      return 70;
    ;
  }

  var printCharBuffers = [null,[],[]];
  
  var printChar = (stream, curr) => {
      var buffer = printCharBuffers[stream];
      assert(buffer);
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    };
  
  var flush_NO_FILESYSTEM = () => {
      // flush anything remaining in the buffers during shutdown
      _fflush(0);
      if (printCharBuffers[1].length) printChar(1, 10);
      if (printCharBuffers[2].length) printChar(2, 10);
    };
  
  
  var _fd_write = (fd, iov, iovcnt, pnum) => {
      // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr+j]);
        }
        num += len;
      }
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    };

  var autoResumeAudioContext = (ctx) => {
      for (var event of ['keydown', 'mousedown', 'touchstart']) {
        for (var element of [document, document.getElementById('canvas')]) {
          element?.addEventListener(event, () => {
            if (ctx.state === 'suspended') ctx.resume();
          }, { 'once': true });
        }
      }
    };

  var wasmTableMirror = [];
  
  
  var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        /** @suppress {checkTypes} */
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      /** @suppress {checkTypes} */
      assert(wasmTable.get(funcPtr) == func, 'JavaScript-side Wasm function table mirror is out of date!');
      return func;
    };
  var dynCall = (sig, ptr, args = [], promising = false) => {
      assert(ptr, `null function pointer in dynCall`);
      assert(!promising, 'async dynCall is not supported in this mode')
      assert(getWasmTableEntry(ptr), `missing table entry in dynCall: ${ptr}`);
      var func = getWasmTableEntry(ptr);
      var rtn = func(...args);
  
      function convert(rtn) {
        return rtn;
      }
  
      return convert(rtn);
    };

  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(typeof str === 'string', `stringToUTF8Array expects a string (got ${typeof str})`);
      // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
      // undefined and false each don't write out any bytes.
      if (!(maxBytesToWrite > 0))
        return 0;
  
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
      for (var i = 0; i < str.length; ++i) {
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
        // and https://www.ietf.org/rfc/rfc2279.txt
        // and https://tools.ietf.org/html/rfc3629
        var u = str.codePointAt(i);
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 0x10FFFF) warnOnce(`Invalid Unicode code point ${ptrToString(u)} encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).`);
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
          // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
          // We need to manually skip over the second code unit for correct iteration.
          i++;
        }
      }
      // Null-terminate the pointer to the buffer.
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };



  var getCFunc = (ident) => {
      var func = Module['_' + ident]; // closure exported function
      assert(func, `Cannot call unknown function ${ident}, make sure it is exported`);
      return func;
    };
  
  var writeArrayToMemory = (array, buffer) => {
      assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
      HEAP8.set(array, buffer);
    };
  
  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var c = str.charCodeAt(i); // possibly a lead surrogate
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
  
  
  var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };
  
  
  
  
  
    /**
   * @param {string|null=} returnType
   * @param {Array=} argTypes
   * @param {Array=} args
   * @param {Object=} opts
   */
  var ccall = (ident, returnType, argTypes, args, opts) => {
      // For fast lookup of conversion functions
      var toC = {
        'string': (str) => {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) { // null string
            ret = stringToUTF8OnStack(str);
          }
          return ret;
        },
        'array': (arr) => {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }
      };
  
      function convertReturnValue(ret) {
        if (returnType === 'string') {
          return UTF8ToString(ret);
        }
        if (returnType === 'boolean') return Boolean(ret);
        return ret;
      }
  
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      assert(returnType !== 'array', 'Return type should not be "array".');
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func(...cArgs);
      function onDone(ret) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret);
      }
  
      ret = onDone(ret);
      return ret;
    };

  
    /**
   * @param {string=} returnType
   * @param {Array=} argTypes
   * @param {Object=} opts
   */
  var cwrap = (ident, returnType, argTypes, opts) => {
      return (...args) => ccall(ident, returnType, argTypes, args, opts);
    };

  var handleException = (e) => {
      // Certain exception types we do not treat as errors since they are used for
      // internal control flow.
      // 1. ExitStatus, which is thrown by exit()
      // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
      //    that wish to return to JS event loop.
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      checkStackCookie();
      if (e instanceof WebAssembly.RuntimeError) {
        if (_emscripten_stack_get_current() <= 0) {
          err('Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 65536)');
        }
      }
      quit_(1, e);
    };
  
  
  var runtimeKeepaliveCounter = 0;
  var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
  var _proc_exit = (code) => {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        Module['onExit']?.(code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    };
  
  
  /** @param {boolean|number=} implicit */
  var exitJS = (status, implicit) => {
      EXITSTATUS = status;
  
      checkUnflushedContent();
  
      // if exit() was called explicitly, warn the user if the runtime isn't actually being shut down
      if (keepRuntimeAlive() && !implicit) {
        var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
        readyPromiseReject?.(msg);
        err(msg);
      }
  
      _proc_exit(status);
    };
  var _exit = exitJS;
  
  
  var maybeExit = () => {
      if (!keepRuntimeAlive()) {
        try {
          _exit(EXITSTATUS);
        } catch (e) {
          handleException(e);
        }
      }
    };
  var callUserCallback = (func) => {
      if (ABORT) {
        err('user callback triggered after runtime exited or application aborted.  Ignoring.');
        return;
      }
      try {
        return func();
      } catch (e) {
        handleException(e);
      } finally {
        maybeExit();
      }
    };
  
  function getFullscreenElement() {
      return document.fullscreenElement || document.mozFullScreenElement ||
             document.webkitFullscreenElement || document.webkitCurrentFullScreenElement ||
             document.msFullscreenElement;
    }
  
  /** @param {number=} timeout */
  var safeSetTimeout = (func, timeout) => {
      
      return setTimeout(() => {
        
        callUserCallback(func);
      }, timeout);
    };
  
  
  var preloadPlugins = [];
  
  var Browser = {
  useWebGL:false,
  isFullscreen:false,
  pointerLock:false,
  moduleContextCreatedCallbacks:[],
  workers:[],
  preloadedImages:{
  },
  preloadedAudios:{
  },
  getCanvas:() => Module['canvas'],
  init() {
        if (Browser.initted) return;
        Browser.initted = true;
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = (name) => {
          return !Module['noImageDecoding'] && /\.(jpg|jpeg|png|bmp|webp)$/i.test(name);
        };
        imagePlugin['handle'] = async (byteArray, name) => {
          var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          if (b.size !== byteArray.length) { // Safari bug #118630
            // Safari's Blob can only take an ArrayBuffer
            b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
          }
          var url = URL.createObjectURL(b);
          return new Promise((resolve, reject) => {
            var img = new Image();
            img.onload = () => {
              assert(img.complete, `Image ${name} could not be decoded`);
              var canvas = /** @type {!HTMLCanvasElement} */ (document.createElement('canvas'));
              canvas.width = img.width;
              canvas.height = img.height;
              var ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              Browser.preloadedImages[name] = canvas;
              URL.revokeObjectURL(url);
              resolve(byteArray);
            };
            img.onerror = (event) => {
              err(`Image ${url} could not be decoded`);
              reject();
            };
            img.src = url;
          });
        };
        preloadPlugins.push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = (name) => {
          return !Module['noAudioDecoding'] && name.slice(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = async (byteArray, name) => {
          return new Promise((resolve, reject) => {
            var done = false;
            function finish(audio) {
              if (done) return;
              done = true;
              Browser.preloadedAudios[name] = audio;
              resolve(byteArray);
            }
            var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            var url = URL.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', () => finish(audio), false); // use addEventListener due to chromium bug 124926
            audio.onerror = (event) => {
              if (done) return;
              err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.slice(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            safeSetTimeout(() => {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          });
        };
        preloadPlugins.push(audioPlugin);
  
        // Canvas event setup
  
        function pointerLockChange() {
          var canvas = Browser.getCanvas();
          Browser.pointerLock = document.pointerLockElement === canvas;
        }
        var canvas = Browser.getCanvas();
        if (canvas) {
          // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
          // Module['forcedAspectRatio'] = 4 / 3;
  
          document.addEventListener('pointerlockchange', pointerLockChange, false);
  
          if (Module['elementPointerLock']) {
            canvas.addEventListener("click", (ev) => {
              if (!Browser.pointerLock && Browser.getCanvas().requestPointerLock) {
                Browser.getCanvas().requestPointerLock();
                ev.preventDefault();
              }
            }, false);
          }
        }
      },
  createContext(/** @type {HTMLCanvasElement} */ canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module['ctx'] && canvas == Browser.getCanvas()) return Module['ctx']; // no need to recreate GL context if it's already been created for this canvas.
  
        var ctx;
        var contextHandle;
        if (useWebGL) {
          // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
          var contextAttributes = {
            antialias: false,
            alpha: false,
            majorVersion: 1,
          };
  
          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute];
            }
          }
  
          // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
          // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
          // Browser.createContext() should not even be emitted.
          if (typeof GL != 'undefined') {
            contextHandle = GL.createContext(canvas, contextAttributes);
            if (contextHandle) {
              ctx = GL.getContext(contextHandle).GLctx;
            }
          }
        } else {
          ctx = canvas.getContext('2d');
        }
  
        if (!ctx) return null;
  
        if (setInModule) {
          if (!useWebGL) assert(typeof GLctx == 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');
          Module['ctx'] = ctx;
          if (useWebGL) GL.makeContextCurrent(contextHandle);
          Browser.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach((callback) => callback());
          Browser.init();
        }
        return ctx;
      },
  fullscreenHandlersInstalled:false,
  lockPointer:undefined,
  resizeCanvas:undefined,
  requestFullscreen(lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer == 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas == 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Browser.getCanvas();
        function fullscreenChange() {
          Browser.isFullscreen = false;
          var canvasContainer = canvas.parentNode;
          if (getFullscreenElement() === canvasContainer) {
            canvas.exitFullscreen = Browser.exitFullscreen;
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullscreen = true;
            if (Browser.resizeCanvas) {
              Browser.setFullscreenCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          } else {
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
  
            if (Browser.resizeCanvas) {
              Browser.setWindowedCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          }
          Module['onFullScreen']?.(Browser.isFullscreen);
          Module['onFullscreen']?.(Browser.isFullscreen);
        }
  
        if (!Browser.fullscreenHandlersInstalled) {
          Browser.fullscreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullscreenChange, false);
          document.addEventListener('mozfullscreenchange', fullscreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
          document.addEventListener('MSFullscreenChange', fullscreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
  
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullscreen = canvasContainer['requestFullscreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullscreen'] ? () => canvasContainer['webkitRequestFullscreen'](Element['ALLOW_KEYBOARD_INPUT']) : null) ||
                                           (canvasContainer['webkitRequestFullScreen'] ? () => canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) : null);
  
        canvasContainer.requestFullscreen();
      },
  requestFullScreen() {
        abort('Module.requestFullScreen has been replaced by Module.requestFullscreen (without a capital S)');
      },
  exitFullscreen() {
        // This is workaround for chrome. Trying to exit from fullscreen
        // not in fullscreen state will cause "TypeError: Document not active"
        // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
        if (!Browser.isFullscreen) {
          return false;
        }
  
        var CFS = document['exitFullscreen'] ||
                  document['cancelFullScreen'] ||
                  document['mozCancelFullScreen'] ||
                  document['msExitFullscreen'] ||
                  document['webkitCancelFullScreen'] ||
            (() => {});
        CFS.apply(document, []);
        return true;
      },
  safeSetTimeout(func, timeout) {
        // Legacy function, this is used by the SDL2 port so we need to keep it
        // around at least until that is updated.
        // See https://github.com/libsdl-org/SDL/pull/6304
        return safeSetTimeout(func, timeout);
      },
  getMimetype(name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.slice(name.lastIndexOf('.')+1)];
      },
  getUserMedia(func) {
        window.getUserMedia ||= navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        window.getUserMedia(func);
      },
  getMovementX(event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },
  getMovementY(event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },
  getMouseWheelDelta(event) {
        var delta = 0;
        switch (event.type) {
          case 'DOMMouseScroll':
            // 3 lines make up a step
            delta = event.detail / 3;
            break;
          case 'mousewheel':
            // 120 units make up a step
            delta = event.wheelDelta / 120;
            break;
          case 'wheel':
            delta = event.deltaY
            switch (event.deltaMode) {
              case 0:
                // DOM_DELTA_PIXEL: 100 pixels make up a step
                delta /= 100;
                break;
              case 1:
                // DOM_DELTA_LINE: 3 lines make up a step
                delta /= 3;
                break;
              case 2:
                // DOM_DELTA_PAGE: A page makes up 80 steps
                delta *= 80;
                break;
              default:
                abort('unrecognized mouse wheel delta mode: ' + event.deltaMode);
            }
            break;
          default:
            abort('unrecognized mouse wheel event: ' + event.type);
        }
        return delta;
      },
  mouseX:0,
  mouseY:0,
  mouseMovementX:0,
  mouseMovementY:0,
  touches:{
  },
  lastTouches:{
  },
  calculateMouseCoords(pageX, pageY) {
        // Calculate the movement based on the changes
        // in the coordinates.
        var canvas = Browser.getCanvas();
        var rect = canvas.getBoundingClientRect();
  
        // Neither .scrollX or .pageXOffset are defined in a spec, but
        // we prefer .scrollX because it is currently in a spec draft.
        // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
        var scrollX = ((typeof window.scrollX != 'undefined') ? window.scrollX : window.pageXOffset);
        var scrollY = ((typeof window.scrollY != 'undefined') ? window.scrollY : window.pageYOffset);
        // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
        // and we have no viable fallback.
        assert((typeof scrollX != 'undefined') && (typeof scrollY != 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');
        var adjustedX = pageX - (scrollX + rect.left);
        var adjustedY = pageY - (scrollY + rect.top);
  
        // the canvas might be CSS-scaled compared to its backbuffer;
        // SDL-using content will want mouse coordinates in terms
        // of backbuffer units.
        adjustedX = adjustedX * (canvas.width / rect.width);
        adjustedY = adjustedY * (canvas.height / rect.height);
  
        return { x: adjustedX, y: adjustedY };
      },
  setMouseCoords(pageX, pageY) {
        const {x, y} = Browser.calculateMouseCoords(pageX, pageY);
        Browser.mouseMovementX = x - Browser.mouseX;
        Browser.mouseMovementY = y - Browser.mouseY;
        Browser.mouseX = x;
        Browser.mouseY = y;
      },
  calculateMouseEvent(event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
  
          // add the mouse delta to the current absolute mouse position
          Browser.mouseX += Browser.mouseMovementX;
          Browser.mouseY += Browser.mouseMovementY;
        } else {
          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return; // the "touch" property is only defined in SDL
  
            }
            var coords = Browser.calculateMouseCoords(touch.pageX, touch.pageY);
  
            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
              var last = Browser.touches[touch.identifier];
              last ||= coords;
              Browser.lastTouches[touch.identifier] = last;
              Browser.touches[touch.identifier] = coords;
            }
            return;
          }
  
          Browser.setMouseCoords(event.pageX, event.pageY);
        }
      },
  resizeListeners:[],
  updateResizeListeners() {
        var canvas = Browser.getCanvas();
        Browser.resizeListeners.forEach((listener) => listener(canvas.width, canvas.height));
      },
  setCanvasSize(width, height, noUpdates) {
        var canvas = Browser.getCanvas();
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },
  windowedWidth:0,
  windowedHeight:0,
  setFullscreenCanvasSize() {
        // check if SDL is available
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)] = flags;
        }
        Browser.updateCanvasDimensions(Browser.getCanvas());
        Browser.updateResizeListeners();
      },
  setWindowedCanvasSize() {
        // check if SDL is available
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)] = flags;
        }
        Browser.updateCanvasDimensions(Browser.getCanvas());
        Browser.updateResizeListeners();
      },
  updateCanvasDimensions(canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if ((getFullscreenElement() === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      },
  };
  var createContext = Browser.createContext;
// End JS library code

// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.

{

  // Begin ATMODULES hooks
  if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];
if (Module['preloadPlugins']) preloadPlugins = Module['preloadPlugins'];
if (Module['print']) out = Module['print'];
if (Module['printErr']) err = Module['printErr'];
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];

Module['FS_createDataFile'] = FS.createDataFile;
Module['FS_createPreloadedFile'] = FS.createPreloadedFile;

  // End ATMODULES hooks

  checkIncomingModuleAPI();

  if (Module['arguments']) arguments_ = Module['arguments'];
  if (Module['thisProgram']) thisProgram = Module['thisProgram'];

  // Assertions on removed incoming Module JS APIs.
  assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['read'] == 'undefined', 'Module.read option was removed');
  assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
  assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
  assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)');
  assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
  assert(typeof Module['ENVIRONMENT'] == 'undefined', 'Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
  assert(typeof Module['STACK_SIZE'] == 'undefined', 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time')
  // If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
  assert(typeof Module['wasmMemory'] == 'undefined', 'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally');
  assert(typeof Module['INITIAL_MEMORY'] == 'undefined', 'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically');

  if (Module['preInit']) {
    if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
    while (Module['preInit'].length > 0) {
      Module['preInit'].shift()();
    }
  }
  consumedModuleProp('preInit');
}

// Begin runtime exports
  Module['ccall'] = ccall;
  Module['cwrap'] = cwrap;
  Module['createContext'] = createContext;
  // End runtime exports
  // Begin JS library exports
  Module['ExitStatus'] = ExitStatus;
  Module['HEAP16'] = HEAP16;
  Module['HEAP32'] = HEAP32;
  Module['HEAP64'] = HEAP64;
  Module['HEAP8'] = HEAP8;
  Module['HEAPF32'] = HEAPF32;
  Module['HEAPF64'] = HEAPF64;
  Module['HEAPU16'] = HEAPU16;
  Module['HEAPU32'] = HEAPU32;
  Module['HEAPU64'] = HEAPU64;
  Module['HEAPU8'] = HEAPU8;
  Module['addOnPostRun'] = addOnPostRun;
  Module['onPostRuns'] = onPostRuns;
  Module['callRuntimeCallbacks'] = callRuntimeCallbacks;
  Module['addOnPreRun'] = addOnPreRun;
  Module['onPreRuns'] = onPreRuns;
  Module['getValue'] = getValue;
  Module['noExitRuntime'] = noExitRuntime;
  Module['ptrToString'] = ptrToString;
  Module['setValue'] = setValue;
  Module['stackRestore'] = stackRestore;
  Module['stackSave'] = stackSave;
  Module['warnOnce'] = warnOnce;
  Module['___assert_fail'] = ___assert_fail;
  Module['UTF8ToString'] = UTF8ToString;
  Module['UTF8ArrayToString'] = UTF8ArrayToString;
  Module['UTF8Decoder'] = UTF8Decoder;
  Module['findStringEnd'] = findStringEnd;
  Module['___cxa_begin_catch'] = ___cxa_begin_catch;
  Module['exceptionCaught'] = exceptionCaught;
  Module['uncaughtExceptionCount'] = uncaughtExceptionCount;
  Module['___cxa_find_matching_catch_2'] = ___cxa_find_matching_catch_2;
  Module['findMatchingCatch'] = findMatchingCatch;
  Module['exceptionLast'] = exceptionLast;
  Module['ExceptionInfo'] = ExceptionInfo;
  Module['setTempRet0'] = setTempRet0;
  Module['___cxa_find_matching_catch_3'] = ___cxa_find_matching_catch_3;
  Module['___cxa_throw'] = ___cxa_throw;
  Module['getExceptionMessage'] = getExceptionMessage;
  Module['getExceptionMessageCommon'] = getExceptionMessageCommon;
  Module['stackAlloc'] = stackAlloc;
  Module['decrementExceptionRefcount'] = decrementExceptionRefcount;
  Module['incrementExceptionRefcount'] = incrementExceptionRefcount;
  Module['___resumeException'] = ___resumeException;
  Module['__abort_js'] = __abort_js;
  Module['_emscripten_resize_heap'] = _emscripten_resize_heap;
  Module['getHeapMax'] = getHeapMax;
  Module['alignMemory'] = alignMemory;
  Module['growMemory'] = growMemory;
  Module['_fd_close'] = _fd_close;
  Module['SYSCALLS'] = SYSCALLS;
  Module['_fd_seek'] = _fd_seek;
  Module['bigintToI53Checked'] = bigintToI53Checked;
  Module['INT53_MAX'] = INT53_MAX;
  Module['INT53_MIN'] = INT53_MIN;
  Module['_fd_write'] = _fd_write;
  Module['flush_NO_FILESYSTEM'] = flush_NO_FILESYSTEM;
  Module['printChar'] = printChar;
  Module['printCharBuffers'] = printCharBuffers;
  Module['autoResumeAudioContext'] = autoResumeAudioContext;
  Module['dynCall'] = dynCall;
  Module['getWasmTableEntry'] = getWasmTableEntry;
  Module['wasmTableMirror'] = wasmTableMirror;
  Module['stringToUTF8'] = stringToUTF8;
  Module['stringToUTF8Array'] = stringToUTF8Array;
  Module['ccall'] = ccall;
  Module['getCFunc'] = getCFunc;
  Module['writeArrayToMemory'] = writeArrayToMemory;
  Module['stringToUTF8OnStack'] = stringToUTF8OnStack;
  Module['lengthBytesUTF8'] = lengthBytesUTF8;
  Module['cwrap'] = cwrap;
  Module['createContext'] = createContext;
  Module['Browser'] = Browser;
  Module['callUserCallback'] = callUserCallback;
  Module['handleException'] = handleException;
  Module['maybeExit'] = maybeExit;
  Module['_exit'] = _exit;
  Module['exitJS'] = exitJS;
  Module['_proc_exit'] = _proc_exit;
  Module['keepRuntimeAlive'] = keepRuntimeAlive;
  Module['runtimeKeepaliveCounter'] = runtimeKeepaliveCounter;
  Module['getFullscreenElement'] = getFullscreenElement;
  Module['safeSetTimeout'] = safeSetTimeout;
  Module['preloadPlugins'] = preloadPlugins;
  // End JS library exports

// end include: postlibrary.js

function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
  ignoredModuleProp('logReadFiles');
  ignoredModuleProp('loadSplitModule');
  ignoredModuleProp('onMalloc');
  ignoredModuleProp('onRealloc');
  ignoredModuleProp('onFree');
  ignoredModuleProp('onSbrkGrow');
}

// Imports from the Wasm binary.
var _strerror = Module['_strerror'] = makeInvalidEarlyAccess('_strerror');
var _load_rom = Module['_load_rom'] = makeInvalidEarlyAccess('_load_rom');
var _emulate_cycle = Module['_emulate_cycle'] = makeInvalidEarlyAccess('_emulate_cycle');
var _should_draw = Module['_should_draw'] = makeInvalidEarlyAccess('_should_draw');
var _get_display_buffer = Module['_get_display_buffer'] = makeInvalidEarlyAccess('_get_display_buffer');
var _get_display_width = Module['_get_display_width'] = makeInvalidEarlyAccess('_get_display_width');
var _get_display_height = Module['_get_display_height'] = makeInvalidEarlyAccess('_get_display_height');
var _key_down = Module['_key_down'] = makeInvalidEarlyAccess('_key_down');
var _key_up = Module['_key_up'] = makeInvalidEarlyAccess('_key_up');
var _reset = Module['_reset'] = makeInvalidEarlyAccess('_reset');
var _malloc = Module['_malloc'] = makeInvalidEarlyAccess('_malloc');
var _free = Module['_free'] = makeInvalidEarlyAccess('_free');
var _fflush = Module['_fflush'] = makeInvalidEarlyAccess('_fflush');
var _emscripten_stack_get_end = Module['_emscripten_stack_get_end'] = makeInvalidEarlyAccess('_emscripten_stack_get_end');
var _emscripten_stack_get_base = Module['_emscripten_stack_get_base'] = makeInvalidEarlyAccess('_emscripten_stack_get_base');
var _setThrew = Module['_setThrew'] = makeInvalidEarlyAccess('_setThrew');
var __emscripten_tempret_set = Module['__emscripten_tempret_set'] = makeInvalidEarlyAccess('__emscripten_tempret_set');
var _emscripten_stack_init = Module['_emscripten_stack_init'] = makeInvalidEarlyAccess('_emscripten_stack_init');
var _emscripten_stack_get_free = Module['_emscripten_stack_get_free'] = makeInvalidEarlyAccess('_emscripten_stack_get_free');
var __emscripten_stack_restore = Module['__emscripten_stack_restore'] = makeInvalidEarlyAccess('__emscripten_stack_restore');
var __emscripten_stack_alloc = Module['__emscripten_stack_alloc'] = makeInvalidEarlyAccess('__emscripten_stack_alloc');
var _emscripten_stack_get_current = Module['_emscripten_stack_get_current'] = makeInvalidEarlyAccess('_emscripten_stack_get_current');
var ___cxa_decrement_exception_refcount = Module['___cxa_decrement_exception_refcount'] = makeInvalidEarlyAccess('___cxa_decrement_exception_refcount');
var ___cxa_increment_exception_refcount = Module['___cxa_increment_exception_refcount'] = makeInvalidEarlyAccess('___cxa_increment_exception_refcount');
var ___get_exception_message = Module['___get_exception_message'] = makeInvalidEarlyAccess('___get_exception_message');
var ___cxa_can_catch = Module['___cxa_can_catch'] = makeInvalidEarlyAccess('___cxa_can_catch');
var ___cxa_get_exception_ptr = Module['___cxa_get_exception_ptr'] = makeInvalidEarlyAccess('___cxa_get_exception_ptr');
var memory = Module['memory'] = makeInvalidEarlyAccess('memory');
var __indirect_function_table = Module['__indirect_function_table'] = makeInvalidEarlyAccess('__indirect_function_table');
var wasmMemory = Module['wasmMemory'] = makeInvalidEarlyAccess('wasmMemory');
var wasmTable = Module['wasmTable'] = makeInvalidEarlyAccess('wasmTable');

function assignWasmExports(wasmExports) {
  assert(typeof wasmExports['strerror'] != 'undefined', 'missing Wasm export: strerror');
  assert(typeof wasmExports['load_rom'] != 'undefined', 'missing Wasm export: load_rom');
  assert(typeof wasmExports['emulate_cycle'] != 'undefined', 'missing Wasm export: emulate_cycle');
  assert(typeof wasmExports['should_draw'] != 'undefined', 'missing Wasm export: should_draw');
  assert(typeof wasmExports['get_display_buffer'] != 'undefined', 'missing Wasm export: get_display_buffer');
  assert(typeof wasmExports['get_display_width'] != 'undefined', 'missing Wasm export: get_display_width');
  assert(typeof wasmExports['get_display_height'] != 'undefined', 'missing Wasm export: get_display_height');
  assert(typeof wasmExports['key_down'] != 'undefined', 'missing Wasm export: key_down');
  assert(typeof wasmExports['key_up'] != 'undefined', 'missing Wasm export: key_up');
  assert(typeof wasmExports['reset'] != 'undefined', 'missing Wasm export: reset');
  assert(typeof wasmExports['malloc'] != 'undefined', 'missing Wasm export: malloc');
  assert(typeof wasmExports['free'] != 'undefined', 'missing Wasm export: free');
  assert(typeof wasmExports['fflush'] != 'undefined', 'missing Wasm export: fflush');
  assert(typeof wasmExports['emscripten_stack_get_end'] != 'undefined', 'missing Wasm export: emscripten_stack_get_end');
  assert(typeof wasmExports['emscripten_stack_get_base'] != 'undefined', 'missing Wasm export: emscripten_stack_get_base');
  assert(typeof wasmExports['setThrew'] != 'undefined', 'missing Wasm export: setThrew');
  assert(typeof wasmExports['_emscripten_tempret_set'] != 'undefined', 'missing Wasm export: _emscripten_tempret_set');
  assert(typeof wasmExports['emscripten_stack_init'] != 'undefined', 'missing Wasm export: emscripten_stack_init');
  assert(typeof wasmExports['emscripten_stack_get_free'] != 'undefined', 'missing Wasm export: emscripten_stack_get_free');
  assert(typeof wasmExports['_emscripten_stack_restore'] != 'undefined', 'missing Wasm export: _emscripten_stack_restore');
  assert(typeof wasmExports['_emscripten_stack_alloc'] != 'undefined', 'missing Wasm export: _emscripten_stack_alloc');
  assert(typeof wasmExports['emscripten_stack_get_current'] != 'undefined', 'missing Wasm export: emscripten_stack_get_current');
  assert(typeof wasmExports['__cxa_decrement_exception_refcount'] != 'undefined', 'missing Wasm export: __cxa_decrement_exception_refcount');
  assert(typeof wasmExports['__cxa_increment_exception_refcount'] != 'undefined', 'missing Wasm export: __cxa_increment_exception_refcount');
  assert(typeof wasmExports['__get_exception_message'] != 'undefined', 'missing Wasm export: __get_exception_message');
  assert(typeof wasmExports['__cxa_can_catch'] != 'undefined', 'missing Wasm export: __cxa_can_catch');
  assert(typeof wasmExports['__cxa_get_exception_ptr'] != 'undefined', 'missing Wasm export: __cxa_get_exception_ptr');
  assert(typeof wasmExports['memory'] != 'undefined', 'missing Wasm export: memory');
  assert(typeof wasmExports['__indirect_function_table'] != 'undefined', 'missing Wasm export: __indirect_function_table');
  _strerror = Module['_strerror'] = createExportWrapper('strerror', 1);
  _load_rom = Module['_load_rom'] = createExportWrapper('load_rom', 2);
  _emulate_cycle = Module['_emulate_cycle'] = createExportWrapper('emulate_cycle', 0);
  _should_draw = Module['_should_draw'] = createExportWrapper('should_draw', 0);
  _get_display_buffer = Module['_get_display_buffer'] = createExportWrapper('get_display_buffer', 0);
  _get_display_width = Module['_get_display_width'] = createExportWrapper('get_display_width', 0);
  _get_display_height = Module['_get_display_height'] = createExportWrapper('get_display_height', 0);
  _key_down = Module['_key_down'] = createExportWrapper('key_down', 1);
  _key_up = Module['_key_up'] = createExportWrapper('key_up', 1);
  _reset = Module['_reset'] = createExportWrapper('reset', 0);
  _malloc = Module['_malloc'] = createExportWrapper('malloc', 1);
  _free = Module['_free'] = createExportWrapper('free', 1);
  _fflush = Module['_fflush'] = createExportWrapper('fflush', 1);
  _emscripten_stack_get_end = Module['_emscripten_stack_get_end'] = wasmExports['emscripten_stack_get_end'];
  _emscripten_stack_get_base = Module['_emscripten_stack_get_base'] = wasmExports['emscripten_stack_get_base'];
  _setThrew = Module['_setThrew'] = createExportWrapper('setThrew', 2);
  __emscripten_tempret_set = Module['__emscripten_tempret_set'] = createExportWrapper('_emscripten_tempret_set', 1);
  _emscripten_stack_init = Module['_emscripten_stack_init'] = wasmExports['emscripten_stack_init'];
  _emscripten_stack_get_free = Module['_emscripten_stack_get_free'] = wasmExports['emscripten_stack_get_free'];
  __emscripten_stack_restore = Module['__emscripten_stack_restore'] = wasmExports['_emscripten_stack_restore'];
  __emscripten_stack_alloc = Module['__emscripten_stack_alloc'] = wasmExports['_emscripten_stack_alloc'];
  _emscripten_stack_get_current = Module['_emscripten_stack_get_current'] = wasmExports['emscripten_stack_get_current'];
  ___cxa_decrement_exception_refcount = Module['___cxa_decrement_exception_refcount'] = createExportWrapper('__cxa_decrement_exception_refcount', 1);
  ___cxa_increment_exception_refcount = Module['___cxa_increment_exception_refcount'] = createExportWrapper('__cxa_increment_exception_refcount', 1);
  ___get_exception_message = Module['___get_exception_message'] = createExportWrapper('__get_exception_message', 3);
  ___cxa_can_catch = Module['___cxa_can_catch'] = createExportWrapper('__cxa_can_catch', 3);
  ___cxa_get_exception_ptr = Module['___cxa_get_exception_ptr'] = createExportWrapper('__cxa_get_exception_ptr', 1);
  memory = Module['memory'] = wasmMemory = wasmExports['memory'];
  __indirect_function_table = Module['__indirect_function_table'] = wasmTable = wasmExports['__indirect_function_table'];
}

var wasmImports = {
  /** @export */
  __assert_fail: ___assert_fail,
  /** @export */
  __cxa_begin_catch: ___cxa_begin_catch,
  /** @export */
  __cxa_find_matching_catch_2: ___cxa_find_matching_catch_2,
  /** @export */
  __cxa_find_matching_catch_3: ___cxa_find_matching_catch_3,
  /** @export */
  __cxa_throw: ___cxa_throw,
  /** @export */
  __resumeException: ___resumeException,
  /** @export */
  _abort_js: __abort_js,
  /** @export */
  emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */
  fd_close: _fd_close,
  /** @export */
  fd_seek: _fd_seek,
  /** @export */
  fd_write: _fd_write,
  /** @export */
  invoke_ii,
  /** @export */
  invoke_iii,
  /** @export */
  invoke_v,
  /** @export */
  invoke_vi,
  /** @export */
  invoke_vii,
  /** @export */
  invoke_viii,
  /** @export */
  invoke_viiii
};

function invoke_iii(index,a1,a2) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vii(index,a1,a2) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_ii(index,a1) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vi(index,a1) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_v(index) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)();
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

var calledRun;

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

function run() {

  stackCheckInit();

  preRun();

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    assert(!calledRun);
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    readyPromiseResolve?.(Module);
    Module['onRuntimeInitialized']?.();
    consumedModuleProp('onRuntimeInitialized');

    assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(() => {
      setTimeout(() => Module['setStatus'](''), 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    flush_NO_FILESYSTEM();
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.');
    warnOnce('(this may also be due to not including full filesystem support - try building with -sFORCE_FILESYSTEM)');
  }
}

var wasmExports;

// In modularize mode the generated code is within a factory function so we
// can use await here (since it's not top-level-await).
wasmExports = await (createWasm());

run();

// end include: postamble.js

// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.
//
// We assign to the `moduleRtn` global here and configure closure to see
// this as an extern so it won't get minified.

if (runtimeInitialized)  {
  moduleRtn = Module;
} else {
  // Set up the promise that indicates the Module is initialized
  moduleRtn = new Promise((resolve, reject) => {
    readyPromiseResolve = resolve;
    readyPromiseReject = reject;
  });
}

// Assertion for attempting to access module properties on the incoming
// moduleArg.  In the past we used this object as the prototype of the module
// and assigned properties to it, but now we return a distinct object.  This
// keeps the instance private until it is ready (i.e the promise has been
// resolved).
for (const prop of Object.keys(Module)) {
  if (!(prop in moduleArg)) {
    Object.defineProperty(moduleArg, prop, {
      configurable: true,
      get() {
        abort(`Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`)
      }
    });
  }
}
// end include: postamble_modularize.js



  return moduleRtn;
}

// Export using a UMD style export, or ES6 exports if selected
export default Module;

