To build `npm install`.

To add package dependencies: `npm install lodash --save`.

To require in Observable:

```
 async function requireFromGithubLocal(jsFileUrl,prop){
  const response = await fetch(jsFileUrl);
  const blob = await response.blob();
  return require(URL.createObjectURL(blob)).catch(() => {debugger; return window[prop]});
}

data_table = requireFromGithubLocal("https://raw.githubusercontent.com/RobinL/open_data_munge/ts_object/build/open-data-munge.js")

```

