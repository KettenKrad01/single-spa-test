let apps = []
let started = false;

export function registerApplication ({name, app, activeWhen, customProps}) {
  apps.push({
    name,
    activeWhen,
    loadApp: app,
    customProps: customProps || {},
    status: 'NOT_LOADED'
  })
}

export function start() {
  started = true;

  window.addEventListener('popstate', () => {
    reroute()
  });

  // 重写 history API
  window.history.pushState = patchedUpdateState(window.history.pushState);
  window.history.replaceState = patchedUpdateState(window.history.replaceState);

  reroute();
}

function patchedUpdateState (originalMethod) {
    return function () {
      const urlBefore = window.location.href;
      const result = originalMethod.apply(this, arguments);
      const urlAfter = window.location.href;

      if (urlBefore !== urlAfter) {
        reroute();
      }

      return result;
    }
}

let appChangeUnderway = false;  // 判断应用是否更改中
let waitingOnAppChange = false; // 判断状态在变更过程reroute是否被再次调用
async function reroute () {
  if (!started) {
    // 在源码中，如果成功匹配路由，即使没有start也会加载资源，但不会执行生命周期。这里个人认为可以start之后才加载资源。
    return;
  }

  if (appChangeUnderway) {
    waitingOnAppChange = true
    return
  }

  const {
    appsToUnmount,
    appsToLoad,
    appsToMount,
  } = getAppChanges();

  appChangeUnderway = true;

  // 卸载应用
  const unmountPromises = appsToUnmount.map(toUnmountPromise);
  await Promise.all(unmountPromises);

  // 挂载应用
  const mountPromises = appsToMount.map(bootstrapAndMount);
  await Promise.all(mountPromises);

  // 加载应用
  const loadPromises = appsToLoad.map((app) => {
    return toLoadPromise(app).then(bootstrapAndMount);
  });

  await Promise.all(loadPromises);

  appChangeUnderway = false;

  if (waitingOnAppChange) {
    waitingOnAppChange = false
    reroute();
  }
}

async function bootstrapAndMount(app) {
  if (shouldBeActive(app)) {
    await toBootstrapPromise(app)
    if (shouldBeActive(app)) {
      return await toMountPromise(app)
    }
  }

  return app
}

async function toMountPromise(app) {
  if (app.status !== 'NOT_MOUNTED') return app
  app.status = 'MOUNTING'
  try {
    await app.mount(app.customProps)
    app.status = 'MOUNTED'
  } catch(error) {
    console.error(error);
    app.status = 'SKIP_BECAUSE_BROKEN'
  }

  return app
}

async function toBootstrapPromise(app) {
  if (app.status !== 'NOT_BOOTSTRAPPED') return app;
  app.status = 'BOOTSTRAPPING';

  try {
    await app.bootstrap(app.customProps)
    app.status = 'NOT_MOUNTED';
  } catch(error) {
    console.error(error);
    app.status = 'SKIP_BECAUSE_BROKEN';
  }

  return app;
}

async function toLoadPromise(app) {
  const {loadPromise, status} = app;

  if (loadPromise) return loadPromise;
  if (!['NOT_LOADED', 'LOAD_ERROR'].includes(status)) return app;

  app.status = 'LOADING_SOURCE_CODE';
  try {
    app.loadPromise = app.loadApp(app.customProps);
    const res = await app.loadPromise;
    app.status = 'NOT_BOOTSTRAPPED';
    app.bootstrap = res.bootstrap;
    app.mount = res.mount;
    app.unmount = res.unmount;
  } catch(error) {
    console.error(error);
    app.status = 'LOAD_ERROR';
  }

  delete app.loadPromise;
  return app;
}

async function toUnmountPromise(app) {
  const {status, unmount} = app;

  if (status !== 'MOUNTED') return app;
  app.status = 'UNMOUNTING';
  try {
    await unmount(app.customProps)
    app.status = 'NOT_MOUNTED';
  } catch(error) {
    console.error(error);
    app.status = 'SKIP_BECAUSE_BROKEN';
  }

  return app;
}

// 计算应用下一个状态
export function getAppChanges() {
  const appsToUnmount = [], appsToLoad = [], appsToMount = [];

  apps.forEach((app) => {
    const appShouldBeActive = shouldBeActive(app)
    switch (app.status) {
      case 'LOAD_ERROR':
      case 'NOT_LOADED':
      case 'LOADING_SOURCE_CODE':
        if (appShouldBeActive) appsToLoad.push(app);
        break;
      case 'NOT_BOOTSTRAPPED':
      case 'NOT_MOUNTED':
        if (appShouldBeActive) appsToMount.push(app);
        break;
      case 'MOUNTED':
        if (!appShouldBeActive) appsToUnmount.push(app);
        break;
    }
  });

  return { appsToUnmount, appsToLoad, appsToMount };
}

export function shouldBeActive(app) {
  try {
    return app.activeWhen(window.location);
  } catch (err) {
    return false;
  }
}
