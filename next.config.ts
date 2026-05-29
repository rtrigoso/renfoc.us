import nextMdx from '@next/mdx'

const withMdx = nextMdx({
  extension: /\.mdx?$/,
  options: {/* otherOptions… */}
})

const nextConfig = withMdx({
  pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],
  transpilePackages: ['next-mdx-remote'],
  output: "export",
  images: {
    domains: ['renfoc.us'],
    loaderFile: './image-loader.js',
  },
  experimental: {
    cssChunking: true,
    optimizeCss: true
  }
})

export default nextConfig
