# bos-workspace

## Getting started

Clone and build locally 

```cmd
git clone https://github.com/NEARBuilders/bos-workspace.git#1.0.0.wip
yarn build
```

go where you need to create a project

```cmd
./relative/path/bos-workspace/bin/bw.js init buildbox
```

this will create a project. Navigate into it:

```cmd
cd buildbox
/relative/path/bos-workspace/bin/bw.js dev
```

Feedback:

- [ ] build after testing throws tsc error
- [ ] init without project name throws error "[path] argument is required"
- [x] home doesn't run because "hello" is not a function (need to default VM.require, fix in "init")
- [ ] socket connects and disconnects, why? nice error logging
- [ ] how could bw init be configured with template repositories? -- also, for easy integration, init structure should match/work with bos components download (I think mv ./widget ./src/widget, configs stay where they are)
- [ ] newly initialized typescript files are throwing errors, want to include package.json, eslint, tsconfig, etc... (open to choose typescript or javascript)
- [ ] I think module/hello should match: module.hello rather than hello.module
- [ ] I really like the alias pattern -- alias/name, config/account, module/hello
- [ ] We could prompt the account name during bw init
- [ ] Idk what error, but hot-reload was killed once during editing (exception handling)
- [ ] I think the output should be /build, rather than in .bos; although maybe something like bos-loader.json should stay in .bos
