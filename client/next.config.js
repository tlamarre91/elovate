module.exports = ({
  distDir: "build",
  future: {
    webpack5: true
  },
  webpack: (config, options) => {
    const {
      isServer,
      webpack
    } = options;
    if (!isServer) {
      const resourceRegExp = /firebase-admin/;
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp })
      );
    }
    return config;
  }
});
