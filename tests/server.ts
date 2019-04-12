export const clientModuleLoadTest = function () {
  const testingWpModule = `server: testing loading webpack module: `;
  try {
    // BUG: Avoid using dynamic imports in server side components
    // const module = await import(`./foo/foo.css`)
    const module = require(`./post/view`)
    // console.log(testingWpModule, `module.css`, module.css);
    // console.log(testingWpModule, `module.img`, module.img2);
  } catch (error) {
    console.log(testingWpModule, `failure`, error);
    return
  }
}
