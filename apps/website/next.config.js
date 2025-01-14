/*eslint-disable @typescript-eslint/no-var-requires*/
const nextTranslate = require('next-translate');

const withNx = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  experimental: { images: { layoutRaw: true } },
  images: {
    domains: ['api.staging.mygateway.xyz', 'node.mygateway.xyz'],
  },
  compiler: {
    emotion: true,
  },
};

// eslint-disable-next-line import-helpers/order-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextTranslate(withNx(nextConfig)));
